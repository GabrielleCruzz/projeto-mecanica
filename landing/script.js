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

// Esconder e mostrar a senha

const senhaInput = document.getElementById("senha");
const toggleSenha = document.getElementById("toggleSenha");
const senhaImg = toggleSenha.querySelector('img');

toggleSenha.addEventListener("click", () => {
    if (senhaInput.type === "password") { 
        senhaInput.type = "text"; // Mostra a senha
        senhaImg.src = "../img/olho-aberto.png";
        console.log(senhaImg)
    } else {
        senhaInput.type = "password"; // Esconde a senha
        senhaImg.src = "../img/olho-fechado.png";
    }
})


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