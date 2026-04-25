// Faz o switch funcionar

const btnEscuro = document.getElementById("switch")
const body = document.querySelector('body')

btnEscuro.addEventListener('click', () => {
    btnEscuro.classList.toggle('dark')
    body.classList.toggle('dark')
})


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