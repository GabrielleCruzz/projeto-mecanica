// Filtro de ordem 

const ordemFiltros = document.querySelectorAll('.ordem-filtro'); // div inteira

ordemFiltros.forEach((ordemFiltro) => {
    const ordemBtn = ordemFiltro.querySelector(".ordem-btn"); // o filtro selecionado (atual)
    const ordemTexto = ordemBtn.querySelector("span"); // texto do atual
    const ordemOpcoes = ordemFiltro.querySelectorAll(".ordem-opcoes button"); // opções que aparecem ao abrir o filtro

    ordemBtn.addEventListener("click", () => {
        ordemFiltro.classList.toggle("aberto");
    });

    ordemOpcoes.forEach(opcao => {
        opcao.addEventListener('click', () => {
            ordemTexto.textContent = opcao.textContent;
            ordemFiltros.classList.remove('aberto');
        });
    });
});

document.addEventListener('click', (event) => {
    if (!ordemFiltros.contains(event.target)) {
        ordemFiltros.classList.remove('aberto');
    }
});