function initMenuLateral() {
    const menuBtn = document.getElementById("menuBtn");
    const btnFecharMenu = document.getElementById("btnFecharMenu");
    const menu = document.getElementById("menu");
    const body = document.body

    // abrir menu
    menuBtn.addEventListener("click", () => {
        menu.classList.add("active"); // ativa o menu
        body.classList.add("no-click"); // bloqueia cliques na página
        body.classList.add("no-scroll"); // impede scroll
    });

    // fechar menu pelo botão X
    btnFecharMenu.addEventListener("click", () => {
        menu.classList.remove("active"); // esconde o menu
        body.classList.remove("no-click"); // libera cliques
        body.classList.remove("no-scroll"); // libera rolagem
    });

    // fechar o menu clicando fora
    document.addEventListener("click", (event) => {
        const foraDoMenu = !menu.contains(event.target); // verifica se clicou fora do menu (!menu) -> fora do menu
        const btn = menuBtn.contains(event.target); // verifica se clicou no botão de abrir

        // faz a página voltar ao normal mesmo fechando clicando fora
        if (menu.classList.contains("active") && foraDoMenu && !btn) {
            menu.classList.remove("active"); // fecha o menu
            body.classList.remove("no-click"); // libera cliques
            body.classList.remove("no-scroll"); // libera rolagem
        }
    });
}