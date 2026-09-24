function initSidebar() {
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

    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {
        const href = link.getAttribute("href");

        if (href === paginaAtual) {
            link.classList.add("atual");
        }
    });
}

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

        initSidebar();
        marcarPaginaAtual();
        marcarSidebarOpen();
    });