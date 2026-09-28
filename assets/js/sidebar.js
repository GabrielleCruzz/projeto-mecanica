function initSidebar() {
    // sidebar mobile
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

    // sidebar desktop
    const sidebarBtn = document.getElementById("sidebarBtn");
    const sidebar = document.querySelector(".sidebar");

    sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");

        // salvar no localStorage se a sidebar está aberta ou não
        if (sidebar.classList.contains("open")) {
            localStorage.setItem("sidebar", "open");
        }
        else {
            localStorage.setItem("sidebar", "closed");
        }

    });
}

function marcarPaginaAtual() {
    const paginaAtual = window.location.pathname.split("/").pop();

    const links = document.querySelectorAll(".sidebar a, .link-menu");

    links.forEach(link => {
        const href = link.getAttribute("href");
        console.log("oi")

        if (href === paginaAtual) {
            link.classList.add("sidebar-atual", "pg-atual");
        }
    });
}

// manter a sidebar aberta (desktop)
function marcarSidebarOpen() {
    const sidebarElement = document.querySelector('.sidebar');

    if (localStorage.getItem("sidebar") === "open") {
        sidebarElement.classList.add("open");        
    }
}

fetch("components/sidebar-desktop.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("sidebarContainer").innerHTML = html;

        marcarPaginaAtual();
        marcarSidebarOpen();
        initSidebar();
});

fetch("components/menu-lateral.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("menuContainer").innerHTML = html;

        marcarPaginaAtual();
        initSidebar();
    });

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}