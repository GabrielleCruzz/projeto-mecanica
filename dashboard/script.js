const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

// abrir menu
menuBtn.addEventListener("click", () => {
    menu.classList.add("active");
    menuBtn.style.display = "none"; // esconde o botão de menu quando o menu lateral estiver aberto
});