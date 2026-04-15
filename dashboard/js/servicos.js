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
    else {
        random = Math.random() < 0.5;
        classe = random ? "pendente" : "concluido";
        texto = random ? "Pendente" : "Concluído";
    }

    // pega a quantidade de cards pra definir o numero do novo card
    const todos = document.querySelectorAll(".card-servicos");
    let num = todos.length + 1;

    // adiciona mais um card de serviços
    const cards = document.getElementById("cards");
    const novo = document.createElement("div");

    novo.className = "card-servicos";
    novo.innerHTML = `
        <span class="info-servico">Serviço #${num}</span>          
        <span class="info-destaque">Tipo de serviço</span>
        <span class="info-secundaria">Nome do cliente</span>
        <span class="info-secundaria">Carro - Placa</span>
        <span class="ver-detalhes">Ver detalhes</span>
        <span class="status ${classe}">${texto}</span>
        <span class="preco">R$900</span>
    `;

    cards.appendChild(novo);

    botoesFuncionar();
}

const overlay = document.getElementById("overlay");
const btnFechar = document.getElementById("btnFechar");

// Abre o modal e trava o scroll da página
function abrirModal() {
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";
}

// Fecha o modal e libera o scroll da página
function fecharModal() {
    overlay.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", function () {
    botoesFuncionar();
})

function botoesFuncionar() {
    const btnDetalhes = document.querySelectorAll(".ver-detalhes");
    
    btnDetalhes.forEach(btn => {
        btn.onclick = abrirModal;
    });

    btnFechar.onclick = fecharModal;
}