const btnCadastrar = document.getElementById("cadastrarCliente");
const overlay = document.getElementById("overlay");
const btnFechar = document.getElementById("btnFechar");

// Modal

// Abre o modal
function abrirModal() {
    overlay.style.display = "flex";
}

// Fecha o modal
function fecharModal() {
    overlay.style.display = "none";
}

// Eventos de abrir e fechar o modal
btnCadastrar.onclick = abrirModal;
btnFechar.onclick = fecharModal;