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
