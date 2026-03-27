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

// Fechar modal e limpa os campos do formulário de login

const btnFechar = document.querySelector(".fechar")
const formLogin = document.getElementById("formLogin")

btnFechar.addEventListener("click", () => {
    overlay.style.display = "none";

    formLogin.reset(); //limpa os campos
});

// Redireciona do botão enviar do formulário de login para a página inicial do dashboard

formLogin.addEventListener("submit" , function(e) {
    e.preventDefault();
    window.location.href = "../dashboard/index.html";
});

// Mensagem de envio e apaga o formulário de contato

document.addEventListener("DOMContentLoaded", function () {

    // Pega o formulário e mensagem pelo id
    const form = document.getElementById("formContato");
    const mensagem = document.getElementById("mensagem");

    // Escuta quando o formulário é enviado (clicar no botão)
    form.addEventListener("submit", function (event) {

        // Impede a página de recarregar
        event.preventDefault();

        // Adiciona a classe "mostrar" e faz a mensagem aparecer
        mensagem.classList.add("mostrar");

        // Limpa os campos do formulário
        form.reset();

        // Espera 3 segundos
        setTimeout(function () {

            // Remove a classe "mostrar" e faz a mensagem sumir
            mensagem.classList.remove("mostrar");
        }, 3000);
    });
});