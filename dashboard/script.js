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