// filtro definido por padrão
let filtro = "todos";

function filtrar(tipo, elemento) {
    // atualiza o filtro
    filtro = tipo;

    // adiciona a classe 'selected' pra opcao de filtro selecionada
    const botoes = document.querySelectorAll(".opcao");
    botoes.forEach(btn => btn.className = "opcao");
    elemento.classList.add("selected");

    // verifica se os cards se encaixam no filtro pra serem exibidos na tela
    const cards = document.querySelectorAll(".card-servicos");
    cards.forEach(card => {
        if (tipo == "pendentes") {
            card.querySelector(".pendente") ? card.style.display = "flex" : card.style.display = "none";
        }
        else if (tipo == "concluidos") {
            card.querySelector(".concluido") ? card.style.display = "flex" : card.style.display = "none";
        }
        else if (tipo == "andamento") {
            card.querySelector(".andamento") ? card.style.display = "flex" : card.style.display = "none";
        }
        else {
            card.style.display = "flex";
        }
    });
}

function mais() {
    // verifica qual tipo de status vai ser adiconado
    let classe, texto, random;
    if (filtro == "concluidos") {
        classe = "concluido";
        texto = "Concluído"
    }
    else if (filtro == "pendentes") {
        classe = "pendente";
        texto = "Pendente";
    }
    else if (filtro == "andamento") {
        classe = "andamento";
        texto = "Em andamento";
    }
    else {
        const random = Math.floor(Math.random() * 3);
        if (random == 0) {
            classe = "pendente";
            texto = "Pendente";
        } else if (random == 1) {
            classe = "andamento";
            texto = "Em andamento";
        } else {
            classe = "concluido";
            texto = "Concluído";
        }
    }

    // pega a quantidade de cards pra definir o numero do novo card
    const todos = document.querySelectorAll(".card-servicos");
    let num = todos.length + 1;

    // adiciona mais um card de serviços
    const cards = document.getElementById("cards");
    const novo = document.createElement("div");

    // veriafica se o status é "em andamento"
    let dataTxt = classe === "andamento" ? "Atualizado em" : "Criado em";

    novo.className = "card-servicos";
    novo.innerHTML = `
        <span class="info-servico">Ordem de serviço #${num}</span>
        <span class="info-destaque">Tipo de serviço</span>
        <span class="info-secundaria">Cliente: <span class="destaque">Nome do Cliente</span></span>
        <span class="info-secundaria">Veículo: <span class="destaque">Nome - Placa</span></span>
        <span class="info-terciaria">${dataTxt}: <span class="destaque">25/08/2026 - R$300,00</span></span>
        <span class="ver-detalhes">Ver detalhes</span>
        <span class="status ${classe}">${texto}</span>
        <span class="preco">R$300</span>
        <div class="btns">
            <button class="atualizar">Atualizar status</button>
            <div class="acoes">
                <button type="button" class="btn-acoes">
                    Mais ações
                </button>
                <div class="opcoes-acoes">
                    <button type="button">Ver detalhes</button>
                    <button type="button">Editar OS</button>
                    <button type="button">Compartilhar</button>
                </div>
            </div>
        </div>
    `;

    cards.appendChild(novo);

    botoesFuncionar();
}

// Abre o modal e trava o scroll da página
function abrirModal() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Fecha o modal e libera o scroll da página
function fecharModal() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", function () {
    botoesFuncionar();
})

function botoesFuncionar() {
    const btnFechar = document.getElementById("btnFechar");
    const btnDetalhes = document.querySelectorAll(".ver-detalhes");

    btnDetalhes.forEach(btn => {
        btn.onclick = abrirModal;
    });

    btnFechar.onclick = fecharModal;
}


// Filtro de ordem 

const ordemFiltro = document.querySelector('.ordem-filtro');
const ordemBtn = ordemFiltro.querySelector('.ordem-btn');
const ordemTexto = ordemBtn.querySelector('span');
const ordemOpcoes = ordemFiltro.querySelectorAll('.ordem-opcoes button');

ordemBtn.addEventListener('click', () => {
    ordemFiltro.classList.toggle('aberto');
});

ordemOpcoes.forEach(opcao => {
    opcao.addEventListener('click', () => {
        ordemTexto.textContent = opcao.textContent;
        ordemFiltro.classList.remove('aberto');
    });
});

document.addEventListener('click', (event) => {
    if (!ordemFiltro.contains(event.target)) {
        ordemFiltro.classList.remove('aberto');
    }
});


// Mais opções

// controla os cliques dos botões "Mais ações"
document.addEventListener('click', (event) => {
    const btnAcoes = event.target.closest('.btn-acoes');

    // abre o menu clicado e fecha os outros
    if (btnAcoes) {
        const acao = btnAcoes.closest('.acoes');
        document.querySelectorAll('.acoes').forEach(outro => {

            if (outro !== acao) {
                outro.classList.remove('aberto');
            }
        });

        acao.classList.toggle('aberto');
        return;
    }

    const opcao = event.target.closest('.opcoes-acoes button');

    // fecha o menu depois de escolher uma opção
    if (opcao) {
        opcao.closest('.acoes').classList.remove('aberto');
        return;
    }

    // fecha o menu quando clica fora dele
    if (!event.target.closest('.acoes')) {
        document.querySelectorAll('.acoes').forEach(acao => {
            acao.classList.remove('aberto');
        });
    }
});