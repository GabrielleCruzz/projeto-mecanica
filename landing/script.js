const linkLogin = document.getElementById("login");
const btnLogin = document.getElementById("btnlogin"); // botão "Faça login"
const overlay = document.getElementById("overlay");

// função pra abrir o modal
function openModal(e) {
    overlay.style.display = "flex";
}

// abrir pelo link do menu
if (linkLogin) {
    linkLogin.addEventListener("click", openModal);
}

// abrir pelo botão
if (btnLogin) {
    btnLogin.addEventListener("click", openModal);
}

// fechar clicando fora
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});
