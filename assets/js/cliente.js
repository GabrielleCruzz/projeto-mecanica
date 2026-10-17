function listarClientes() {
    fetchPHP("../php/clientes/cliente-listar.php", "GET").then((dadosRecebidos) => {
        const infoCliente = JSON.parse(dadosRecebidos);
    
        const containerPai = document.querySelector(".cards-clientes");
        const cardModelo = document.querySelector(".cliente-card");
    
        containerPai.querySelectorAll(".cliente-card:not(.cliente-card-modelo)").forEach(card => card.remove());

        infoCliente.forEach((cliente) => {
            const card = cardModelo.cloneNode(true);
            card.classList.remove("cliente-card-modelo");
            card.querySelector(".info-destaque").textContent = cliente.nome;
        
            card.querySelector(".telefone").textContent = cliente.telefone;
        
            card.querySelector(".qt_veiculo").textContent =
                cliente.quantidade_veiculo + " Veículos cadastrados";
            
            card.setAttribute("data-cliente-id", cliente.id);

            containerPai.appendChild(card);
        });
        ativarCards();
    });
}

function buscarClientes(){
    const campoBusca = document.querySelector(".input-pesquisa");

    campoBusca.addEventListener("input", () => {
        const busca = campoBusca.value.toLowerCase().trim();

        const container = document.querySelector(".cards-clientes");
        const cards = [...container.querySelectorAll(".cliente-card:not(.cliente-card-modelo)")];

        cards.sort((a, b) => {
            const nomeA = a.querySelector(".info-destaque").textContent.toLowerCase();
            const nomeB = b.querySelector(".info-destaque").textContent.toLowerCase();

            return nomeB.startsWith(busca) - nomeA.startsWith(busca);
        });

        cards.forEach(card => container.appendChild(card));
        
        document.querySelectorAll(".cliente-card:not(.cliente-card-modelo)")
        .forEach(card => {
            const nome = card.querySelector(".info-destaque").textContent.toLowerCase();
            const telefone = card.querySelector(".telefone").textContent.toLowerCase();

            card.style.display =
                nome.includes(busca) || telefone.includes(busca) ? "" : "none";
        });
    });
}

// exibir todos os clientes
if (document.querySelector(".cards-clientes")) listarClientes();

if (document.querySelector(".input-pesquisa")) buscarClientes();

function ativarCards() {
    const clientesCards = document.querySelectorAll(".cliente-card");

    console.log("Quantidade de cards encontrados pelo JS:", clientesCards.length);

    clientesCards.forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-cliente-id");        
    
            if (!id) {
                console.log("Alerta: Este card não possui um ID definido!");
                return;
            }
            console.log(id)
            fetch("../php/clientes/cliente-seleciona.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cliente_id: id })
            })
                .then((resposta) => resposta.text())
                .then((resultado) => {
                    alert(resultado);
                        window.location.href = "../dashboard/detalhes-cliente.html";
                });
        })
    });
}

// função para pegar os dados do cliente ao clicar em um card de cliente
function recebeDadosCard() {
  fetchPHP("../php/clientes/cliente-detalhes.php", "GET").then((dadosRecebidos) => {
    console.log(dadosRecebidos);
    const cliente = JSON.parse(dadosRecebidos);
    console.log("Dados do cliente recebidos:", cliente);

    if (cliente.erro) {
        console.error(cliente.erro);
        return;
    }

    const containerPai = document.querySelector(".cliente-detalhes");
    
    if (containerPai) {
        // Preenche o nome na tela
        const nomeSpan = containerPai.querySelector(".info-destaque");
        const nomeTitle = document.querySelector(".title-cliente");
        if (nomeSpan) nomeSpan.textContent = cliente.nome;
        if (nomeTitle) nomeTitle.textContent = cliente.nome;

        // Preenche o telefone na tela
        const telefoneSpan = containerPai.querySelector(".info-secundaria span");
        if (telefoneSpan) telefoneSpan.textContent = cliente.telefone;
    }

    const containerVeiculos = document.querySelector("listaVeiculosCliente");
    let cardsVeiculos = ``;

    for (const veiculo of cliente.veiculos) {      
      let obs = (veiculo.observacoes == null) ? "Sem observações" : veiculo.observacoes;
      cardsVeiculos += `
        <div class="card-veiculos">
            <span class="info-destaque">${veiculo.Placa}</span>
            <span class="info-secundaria">${veiculo.Model_Marca} • ${veiculo.Ano}</span>
            <span class="info-secundaria">${obs}</span>
            <span class="info-historico">Último serviço em 20/06/2026</span>                            
        </div>
      `      
    }

    if (containerVeiculos) {
        containerVeiculos.innerHTML = cardsVeiculos;
    }
  });
}

// Verifica se a div de detalhes existe na página atual antes de chamar a função
const containerPai = document.querySelector(".cliente-detalhes");
if (containerPai) {
    recebeDadosCard();
}

const formEditarCliente = document.querySelector(".form-editar-cliente");

if (formEditarCliente) {
  formEditarCliente.addEventListener("submit", (enviar) => {
      enviar.preventDefault();
    
      const dados = new FormData(formEditarCliente);
    
      fetchPHP("../php/clientes/cliente-editar.php", "POST", dados).then((dadosRecebidos) => {
        if (dadosRecebidos == "Sucesso") {
                alert("Cliente editado com sucesso!")
                fecharModal(formEditarCliente.closest(".overlay"));
                // listarClientes();
                recebeDadosCard();
            }
            else {
                alert("Erro ao editar cliente: " + dadosRecebidos)
            }
      })
    });
}

const camposVeiculo = document.querySelector(".campos-veiculo");
const btnAdicionarVeiculo = document.querySelector(".btn-adicionar-veiculo");

// Adiciona um novo grupo de campos
btnAdicionarVeiculo.addEventListener("click", () => {
    // cria uma cópia do conjunto de campos
    const novoVeiculo = camposVeiculo.querySelector(".infos-veiculo").cloneNode(true);
    // limpa os campos clonados
    novoVeiculo.querySelectorAll("input").forEach(input => input.value = "");

    // Cria o botão para remover este grupo
    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.className = "btn-excluir-veiculo";
    btnExcluir.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    novoVeiculo.appendChild(btnExcluir);
    // adiciona no final o botão de adicionar mais veículos 
    camposVeiculo.insertBefore(novoVeiculo, btnAdicionarVeiculo);
});

// Remove um grupo adicional de veículos
camposVeiculo.addEventListener("click", (event) => {
    const btnExcluir = event.target.closest(".btn-excluir-veiculo");

    if (!btnExcluir) return;

    btnExcluir.closest(".infos-veiculo").remove();
});