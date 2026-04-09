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

    // fechar o menu clicando fora
    document.addEventListener("click", (event) => {
        const foraDoMenu = !menu.contains(event.target); // !menu -> tudo que não for o menu
        const btn = menuBtn.contains(event.target);

        if (menu.classList.contains("active") && foraDoMenu && !btn) { // && !btn impede que o clique no botão de abrir o menu tbm feche ele
            menu.classList.remove("active"); // Fecha o menu
            menuBtn.style.visibility = "visible"; // Botão de abrir o menu aparece de novo
        }
    });
}