const btnCadastrar = document.getElementById("cadastrarCliente");
const overlay = document.getElementById("overlay");
const btnFechar = document.getElementById("btnFechar");

// Modal

// Abre o modal e trava o scroll da página
function abrirModal() {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Fecha o modal e libera o scroll da página
function fecharModal() {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
}

// Eventos de abrir e fechar o modal
btnCadastrar.onclick = abrirModal;
btnFechar.onclick = fecharModal;

// Veículos

const btnAdicionar = document.getElementById("btnAdicionar");
const containerVeiculos = document.querySelector(".campos-veiculo");

// Cria uma nova linha de veículo
function criarLinhaVeiculo() {
    const linha = document.createElement("div");
    linha.classList.add("linha-veiculo");

    linha.innerHTML = `
        <div class="linha-separadora"></div>
        <div class="campo">
            <input type="text" required>
            <label>Placa</label>
        </div>
        <div class="campo">
            <input type="text" required>
            <label>Marca</label>
        </div>
        <div class="campo">
            <input type="text" required>
            <label>Modelo/Ano</label>
        </div>
        <button type="button" class="btn-excluir">Excluir</button>
    `;

    // Remove a linha ao clicar no botão excluir
    linha.querySelector(".btn-excluir").onclick = () => linha.remove();

    return linha;
}

// Adiciona nova linha de veículo antes do botão
btnAdicionar.onclick = () => {
    containerVeiculos.insertBefore(criarLinhaVeiculo(), btnAdicionar);
};

// Serviços

const btnAddServico = document.getElementById("btnAddServico");
const listaServicos = document.getElementById("listaServicos");

// Cria uma nova linha de serviço
function criarServico() {
    const div = document.createElement("div");
    div.classList.add("linha-servico");

    div.innerHTML = `
        <input type="text" placeholder="Adicionar serviço">
        <input type="text" placeholder="Mão de obra">
        <button type="button" class="btn-excluir">X</button>
    `;

    // Remove a linha ao clicar no botão excluir
    div.querySelector(".btn-excluir").onclick = () => div.remove();

    return div;
}

// Adiciona novo serviço na lista
btnAddServico.onclick = () => {
    listaServicos.appendChild(criarServico());
};

// Peças

const btnAddPeca = document.getElementById("btnAddPeca");
const listaPecas = document.getElementById("listaPecas");

// Cria uma nova linha de peça
function criarPeca() {
    const div = document.createElement("div");
    div.classList.add("linha-peca");

    div.innerHTML = `
        <input type="text" placeholder="Peça">
        <input type="number" placeholder="Qnt.">
        <input type="text" placeholder="Valor">
        <button type="button" class="btn-excluir">X</button>
    `;

    // Remove a linha ao clicar no botão excluir
    div.querySelector(".btn-excluir").onclick = () => div.remove();

    return div;
}

// Adiciona nova peça na lista
btnAddPeca.onclick = () => {
    listaPecas.appendChild(criarPeca());
};



// Adiciona lista na busca
const input = document.querySelector(".busca input");
const lista = document.getElementById("lista");
let itens = Array.from(document.querySelectorAll(".item"));

// função principal: filtra e organiza os resultados
function filtrarLista() {

    // pega o valor digitado em minúsculo
    const valor = input.value.toLowerCase();
    // controla se encontrou algum resultado
    let temResultado = false;

    // ordena os itens:
    // 1. quem começa com o valor digitado vem primeiro
    // 2. depois ordena em ordem alfabética
    itens.sort((a, b) => {
        const textoA = a.textContent.toLowerCase();
        const textoB = b.textContent.toLowerCase();

        const comecaA = textoA.startsWith(valor);
        const comecaB = textoB.startsWith(valor);

        // se ambos são iguais na prioridade, ordena alfabeticamente
        return textoA.localeCompare(textoB);
    });

    // percorre os itens já ordenados
    itens.forEach(item => {

        const texto = item.textContent.toLowerCase();

        // verifica se inclui o valor digitado
        const match = texto.includes(valor);

        if (match) {
            // mostra o item
            item.style.display = "block";

            // adiciona na lista já na nova ordem
            lista.appendChild(item);

            temResultado = true;
        } else {
            item.style.display = "none";
        }
    });

    // mostra a lista só se tiver resultado
    if (valor && temResultado) {
        lista.style.display = "block";
    } else {
        lista.style.display = "none";
    }
}


// função quando clica em um item
function selecionarItem(item) {
    // coloca o nome no input
    input.value = item.textContent;

    // esconde a lista
    lista.style.display = "none";
}


// evento: quando digita
input.addEventListener("input", filtrarLista);


// evento: quando clica no input
input.addEventListener("focus", () => {
    if (input.value) {
        lista.style.display = "block";
    }
});


// adiciona clique em cada item
itens.forEach(item => {
    item.addEventListener("click", () => selecionarItem(item));
});


// evento global: clicar fora fecha a lista
document.addEventListener("click", (e) => {
    if (!e.target.closest(".busca")) {
        lista.style.display = "none";
    }
});