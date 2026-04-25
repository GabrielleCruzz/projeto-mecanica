const botao = document.getElementById("btnEditar");
const campos = document.querySelectorAll(".campo");

let editando = false;

botao.addEventListener("click", () => {

    if (editando === false) {
        editando = true;

        campos.forEach(campo => {
            campo.disabled = false;
            campo.style.backgroundColor = "white";
        });

        botao.textContent = "Salvar";

    } else {
        editando = false;

        campos.forEach(campo => {
            campo.disabled = true;
            campo.style.backgroundColor = "var(--cor6)";
        });

        botao.textContent = "Editar";
    }
});