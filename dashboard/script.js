const menuBtn = document.getElementById("menuBtn");
const btnFechar = document.getElementById("btnFechar");
const menu = document.getElementById("menu");

// abrir menu
menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    menuBtn.style.display = "none"; // esconde o botão de menu quando o menu lateral estiver aberto
});

btnFechar.addEventListener("click", () => {
    menu.classList.remove("active");
    menuBtn.style.display = "block"; // mostra o botão de menu quando o menu lateral estiver fechado
});