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

// Formatar CPF ou CNPJ enquanto digita
const campoDocumento = formCadastro.querySelector('[name="cnpj_usuario"]');

campoDocumento.addEventListener("input", () => {
    const documento = campoDocumento.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

    if (/[A-Z]/.test(documento) || documento.length > 11) {
        campoDocumento.value = cpf.cnpj.format(documento, {
            strict: false
        });
    } else {
        campoDocumento.value = cpf.format(documento, {
            strict: false
        });
    }
});

// Submit cadastro: enviar dados do form para o PHP
formCadastro.addEventListener("submit", (enviar) => {
    enviar.preventDefault();

    const documento = campoDocumento.value;

    const documentoLimpo = documento.replace(/[^a-zA-Z0-9]/g, "");

    // Validar CPF ou CNPJ
    let documentoValido = false;

    if (documentoLimpo.length === 11) {
        documentoValido = cpf.isValid(documentoLimpo);
    } else if (documentoLimpo.length === 14) {
        documentoValido = cpf.cnpj.isValid(documentoLimpo);
    }

    if (!documentoValido) {
        alert("CPF ou CNPJ inválido.");
        campoDocumento.focus();
        return;
    }

    const dados = new FormData(formCadastro);

    // Enviar o documento sem a máscara
    dados.set("cnpj_usuario", cpf.cnpj.normalize(documento));

    fetch("./php/usuarios/usuario-cadastro.php", {
        method: "POST",
        body: dados,
    })
        .then((resposta) => resposta.text())
        .then((resultado) => {
            if (resultado.trim() === "Sucesso") {
                alert("Cadastrado com sucesso! Realize o login para acessar o sistema.");
                login = true;
                switchForm();
            } else {
                alert(resultado);
            }
        });
});

// Formatar CPF ou CNPJ no campo de login
const campoLogin = formLogin.querySelector('[name="login_email_cnpj"]');

campoLogin.addEventListener("input", () => {
    const valor = campoLogin.value;

    // Se houver letras, não aplicar máscara de documento
    if (/[a-zA-Z]/.test(valor) && !valor.includes(".")) {
        return;
    }

    const documento = valor.replace(/\D/g, "");

    if (documento.length <= 11) {
        campoLogin.value = cpf.format(documento.slice(0, 11));
    } else {
        campoLogin.value = cpf.cnpj.format(documento.slice(0, 14));
    }
});

// submit login: enviar dados do form para o php
formLogin.addEventListener("submit", (enviar) => {
    enviar.preventDefault();

    const dados = new FormData(formLogin);

    const valorLogin = campoLogin.value;

    if (!valorLogin.includes("@")) {
        dados.set(
            "login_email_cnpj",
            cpf.cnpj.normalize(valorLogin)
        );
    }

    fetch("./php/usuarios/usuario-login.php", {
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