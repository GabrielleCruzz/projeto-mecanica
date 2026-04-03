function initMenuLateral() {
    const menuBtn = document.getElementById("menuBtn");
    const btnFecharMenu = document.getElementById("btnFecharMenu");
    const menu = document.getElementById("menu");

    // abrir menu
    menuBtn.addEventListener("click", () => {
        menu.classList.add("active");
        menuBtn.style.visibility = "hidden"; // esconde o icone do menu quando o menu lateral estiver aberto
    });

    btnFecharMenu.addEventListener("click", () => {
        menu.classList.remove("active");
        menuBtn.style.visibility = "visible"; // mostra o icone do menu quando o menu lateral estiver fechado
    });
}