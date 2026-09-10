const btnEscuro = document.getElementById("switch");
const body = document.body;

// aplica tema salvo ao carregar a página
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    btnEscuro.classList.add("dark");
}

btnEscuro.addEventListener("click", () => {
    btnEscuro.classList.toggle("dark");
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});


// Permite editar os inputs

const botao = document.getElementById("btnEditar");
const campos = document.querySelectorAll(".campo");

let editando = false;

botao.addEventListener("click", () => {

    editando = !editando;

    campos.forEach(campo => {
        campo.disabled = !editando;

        campo.classList.toggle("editando", editando);
    });

    botao.textContent = editando ? "Salvar" : "Editar";
});