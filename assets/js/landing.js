// fundo modal
const overlay = document.querySelector(".overlay");

// botões de login/cadastro que abrem o modal
const btnLogin = document.querySelectorAll(".link-entrar");
const btnCadastro = document.querySelectorAll(".link-cadastrar")

// opções de login/cadastro dentro do modal
const optionLogin = document.querySelector(".optionLogin");
const optionCadastro = document.querySelector(".optionCadastro");

// forms de login e cadastro do modal
const formLogin = document.querySelector(".formLogin")
const formCadastro = document.querySelector(".formCadastro")

const formRedefinir = document.querySelector(".formRedefinir")
const esqueciSenha = document.querySelector(".esqueciSenha")

// variável pra guardar se o form escolhido é de login ou não
let login;
let redefinir;

// função pra trocar o form dentro do modal
function switchForm() {
    console.log("login no switch: ", login)
    if (login) {
        optionCadastro.className = 'optionCadastro'
        formCadastro.className = 'formCadastro'
        
        if (redefinir) {
            formLogin.className = "formLogin"
            formRedefinir.className = "formRedefinir active"
            optionLogin.className = 'formLogin'          
        }
        else {
            formRedefinir.className = "formRedefinir"
            optionLogin.className = 'optionLogin active'
            formLogin.className = 'formLogin active'
        }
    }
    else {
        optionCadastro.className = 'optionCadastro active'
        formCadastro.className = 'formCadastro active'
        
        formRedefinir.className = "formRedefinir"    
        
        optionLogin.className = 'optionLogin'
        formLogin.className = 'formLogin'
    }
}

// função pra abrir o modal
function openModal() {
    overlay.style.display = "flex";
    switchForm();
}

// clique em botões de login
btnLogin.forEach(btn => {
    btn.addEventListener("click", () => {
        login = true;
        openModal();
    });
});

// clique em botões de cadastro
btnCadastro.forEach(btn => {
    btn.addEventListener("click", () => {
        login = false;
        openModal();
    });
});

// clique para alternar para form de cadastro
optionCadastro.addEventListener("click", () => {
    login = false;
    redefinir = false;
    switchForm();
})

// clique para alternar para form de login
optionLogin.addEventListener("click", () => {
    login = true;
    redefinir = false;
    switchForm();
})

esqueciSenha.addEventListener("click", () => {
    redefinir = true;
    switchForm()
})

// Fechar modal e limpar os campos dos formulários
const btnFechar = document.querySelector(".btn-fechar")

btnFechar.addEventListener("click", () => {
    overlay.style.display = "none";
    login = false;
    redefinir = false;
    formLogin.reset();
    formCadastro.reset();
    formRedefinir.reset();
});

// submit cadastro: enviar dados do form para o php
formCadastro.addEventListener("submit", (enviar) => {
    enviar.preventDefault();

    const dados = new FormData(formCadastro);

    fetch("./php/usuario-cadastro.php", {
        method: "POST", body: dados,
    })
        .then((resposta) => resposta.text())
        .then((resultado) => {
            if (resultado.trim() === "Sucesso") {
                alert("Cadastrado com sucesso! Realize o login para acessar o sistema.")
                login = true;
                switchForm();       
            }
            else {
                alert(resultado)
            }            
        });
});

// submit login: enviar dados do form para o php
formLogin.addEventListener("submit", (enviar) => {
    enviar.preventDefault();

    const dados = new FormData(formLogin);

    fetch("./php/usuario-login.php", {
        method: "POST", body: dados,
    })
        .then((resposta) => resposta.text())
        .then((resultado) => {
            if (resultado.trim() === "Sucesso") {                
                alert("Login realizado com sucesso!")
                window.location.href = "./dashboard/painel.html"
            }
            else {
                alert(resultado); // mostra o erro
            }            
        });
});

// Esconder e mostrar a senha
const senhasIcone = document.querySelectorAll(".campo i")

console.log(senhasIcone)
senhasIcone.forEach(icone => {
    icone.addEventListener("click", () => {
        const campo = icone.closest(".campo");
        const senhaCampo = campo.querySelector(".campoSenha")
        if (senhaCampo.type === "password") {
            senhaCampo.type = "text";
            icone.className = "ti ti-eye-off"
        }
        else {
            senhaCampo.type = "password";
            icone.className = "ti ti-eye"
        }
    })
});

// Mensagem de envio e apaga o formulário de contato
document.addEventListener("DOMContentLoaded", function () {
    // Pega o formulário e mensagem pelo id
    const form = document.querySelector(".formContato");
    const mensagem = document.querySelector("#mensagem");

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