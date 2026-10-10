// Filtro de ordem 

const ordemFiltros = document.querySelectorAll('.ordem-filtro'); // div inteira

ordemFiltros.forEach((ordemFiltro) => {
    const ordemBtn = ordemFiltro.querySelector(".ordem-btn"); // o filtro selecionado (atual)
    const ordemTexto = ordemBtn.querySelector("span"); // texto do atual
    const ordemOpcoes = ordemFiltro.querySelectorAll(".ordem-opcoes button"); // opções que aparecem ao abrir o filtro

    ordemBtn.addEventListener("click", () => {
        ordemFiltro.classList.toggle("aberto");
    });

    ordemOpcoes.forEach(opcao => {
        opcao.addEventListener('click', () => {
            ordemTexto.textContent = opcao.textContent;
            ordemFiltro.classList.remove('aberto');
        });
    });
});

document.addEventListener('click', (event) => {
    ordemFiltros.forEach(ordemFiltro => {
        if (!ordemFiltro.contains(event.target)) {
            ordemFiltro.classList.remove('aberto');
        }
    });
});


/// ===== MODAIS =====

// abrir modal
function abrirModal(modalName) {
    const modal = document.querySelector(modalName);
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    console.log("modal abriu!");
}

// fechar modal
function fecharModal(modal) {
    // adiciona a classe da animação de saída do modal
    modal.querySelector(".modal")
        ?.classList.add("modal-fechando");

    // espera a animação terminar antes de esconder o modal
    setTimeout(() => {
        modal.style.display = "none";

        // remove a classe para permitir que a animação funcione novamente ao abrir
        modal.querySelector(".modal")
            ?.classList.remove("modal-fechando");
    }, 300);

    document.body.style.overflow = "auto";
}

// evento de clique em um botão pra ele abrir seu modal correspondente
function modalBtnConfig(btnModal, modal) {
    document.addEventListener("click", (event) => {
        const btn = event.target.closest(btnModal);
        if (!btn) return;
        abrirModal(modal)
        
    })
    console.log(`${modal} configurado`);
}

// configura botões e seus modais correspondentes
modalBtnConfig(".ver-detalhes-acao", "#modalDetalhes");
modalBtnConfig(".editar-os-acao", "#modalEditar");
modalBtnConfig(".atualizar", "#modalStatus");
modalBtnConfig(".cadastrarCliente", "#modalAddCliente");
modalBtnConfig(".btn-editar", "#modalEditarCliente");
modalBtnConfig(".editar-veiculos", "#modalEditarVeiculos");
modalBtnConfig(".atualizar-status", "#modalStatus");

// evento de clique pra fechar modais
document.addEventListener("click", (event) => {
    const btnFechar = event.target.closest(".btn-fechar");
    if (!btnFechar) return;

    // pega o overlay em que o botão ta dentro
    const overlay = btnFechar.closest(".overlay");
    if (!overlay) return;
    fecharModal(overlay);
})

// botão de confirmar mudança de status
const confirmarStatus = document.querySelector(".confirmar-status");

if (confirmarStatus) {
    confirmarStatus.addEventListener("click", () => {        
        const overlay = confirmarStatus.closest(".overlay");
        if (!overlay) return;
        fecharModal(overlay);
    })
}

// Mais opções
// controla os cliques dos botões "Mais ações"

document.addEventListener('click', (event) => {

    const btnAcoes = event.target.closest('.btn-acoes');

    console.log("botao existe: ", btnAcoes);

    // abre o menu clicado e fecha os outros
    if (btnAcoes) {

        const acao = btnAcoes.closest('.acoes');

        document.querySelectorAll('.acoes').forEach(outro => {
            if (outro !== acao) {
                outro.classList.remove('aberto');
                outro.classList.remove('abrir-cima');
            }
        });

        acao.classList.toggle('aberto');

        // verifica o espaço disponível
        if (acao.classList.contains('aberto')) {

            const opcoes = acao.querySelector('.opcoes-acoes');
            const rect = opcoes.getBoundingClientRect();

            const espacoEmbaixo = window.innerHeight - rect.top;

            if (espacoEmbaixo < rect.height) {
                acao.classList.add('abrir-cima');
            }
        }

        return;
    }

    const opcao = event.target.closest('.opcoes-acoes button');

    // fecha o menu depois de escolher uma opção
    if (opcao) {
        opcao.closest('.acoes').classList.remove('aberto');
        return;
    }

    // fecha o menu quando clica fora dele
    if (!event.target.closest('.acoes')) {
        document.querySelectorAll('.acoes').forEach(acao => {
            acao.classList.remove('aberto');
            acao.classList.remove('abrir-cima');
        });
    }

});

// opcoes de atualizar status
const opcoesStatus = document.querySelectorAll('.status-opcoes div');

opcoesStatus.forEach(status => {
    status.addEventListener("click", () => {
        trocar(status)
    })    
});

function trocar(statusSelecionado) {
    opcoesStatus.forEach(status => {
        status.classList.remove('status-ativo');
    });
    statusSelecionado.classList.add('status-ativo');
}

//Mandar os dados do formulario para o PHP
const formAddCliente = document.querySelector(".form-cliente");

formAddCliente.addEventListener("submit", (enviar) => {
  enviar.preventDefault();

  const dados = new FormData(formAddCliente);

  fetch("../php/cliente-cadastrar.php", {
    method: "POST",
    body: dados,
  })
    .then((resposta) => resposta.text())
    .then((resultado) => {      
        if (resultado == "Sucesso") {
            alert("Cliente cadastrado com sucesso!")
            listarClientes();
            fecharModal(formAddCliente.closest(".overlay"));
        }
        else {
            alert("Erro ao cadastrar cliente: " + resultado)
        }
    });
});

function listarClientes() {
    fetch("../php/cliente-listar.php", {
      method: "GET",
    })
      .then((resposta_lista) => resposta_lista.text())
      .then((resulta_lista) => {
        const infoCliente = JSON.parse(resulta_lista);
    
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
        pega();
      });
}

listarClientes();

function pega() {
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
            fetch("../php/cliente-seleciona.php", {
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

function pegaCliente() {
    fetch("../php/cliente-detalhes.php", {
        method: "GET",
    })
    .then((resposta) => resposta.json())
    .then((cliente) => {
        console.log("Dados do cliente recebidos:", cliente);

        if (cliente.erro) {
            console.error(cliente.erro);
            return;
        }

        const containerPai = document.querySelector(".cliente-detalhes");
        
        if (containerPai) {
            const nomeSpan = containerPai.querySelector(".info-destaque");
            if (nomeSpan) nomeSpan.textContent = cliente.nome;

            const telefoneSpan = containerPai.querySelector(".info-secundaria");
            const iconTelefone = telefoneSpan?.querySelector("i");

            if (iconTelefone) {
                iconTelefone.classList.add("fa-solid", "fa-phone");
            }

            if (telefoneSpan) {
                telefoneSpan.append(document.createTextNode(cliente.telefone));
        }
}
    })
    .catch(erro => console.error("Erro ao buscar dados da sessão:", erro));
}

// Verifica se a div de detalhes existe na página atual antes de chamar a função
const containerPai = document.querySelector(".cliente-detalhes");
if (containerPai) {
    pegaCliente();
}
