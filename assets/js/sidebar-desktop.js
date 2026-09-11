function initSidebar() {
    const sidebarBtn = document.getElementById("sidebarBtn");
    const sidebar = document.querySelector(".sidebar");

    sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
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

fetch("components/sidebar-desktop.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("sidebarContainer").innerHTML = html;

        initSidebar();
        marcarPaginaAtual();
    });