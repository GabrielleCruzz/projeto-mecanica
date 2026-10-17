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
            <div class="acoes servico">
                <button type="button" class="btn-acoes servico">
                    Mais ações
                </button>
                <div class="opcoes-acoes servico">
                    <button type="button" class="ver-detalhes-acao">Ver detalhes</button>
                    <button type="button" class="editar-os-acao">Editar OS</button>
                    <button type="button">Compartilhar</button>
                </div>
            </div>
        </div>
    `;

    cards.appendChild(novo);
    atualizarContador();
    botoesFuncionar();
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

// contador dos filtros por status

function atualizarContador() {

    const cards = document.querySelectorAll(".card-servicos");
    let pendente = 0;
    let andamento = 0;
    let concluido = 0;

    cards.forEach(card => {

        if (card.querySelector(".pendente")) {
            pendente++;
        };

        if (card.querySelector(".andamento")) {
            andamento++;
        };

        if (card.querySelector(".concluido")) {
            concluido++;
        };

    });

    document.querySelector(".contador-todos").textContent = cards.length;
    document.querySelector(".contador-pendente").textContent = pendente;
    document.querySelector(".contador-andamento").textContent = andamento;
    document.querySelector(".contador-concluido").textContent = concluido;

}

// roda a função quando a página carrega
document.addEventListener("DOMContentLoaded", () => {    
    listarOS();
});

// função pra formatar valores em reais
function formatarValor(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// função pra formatar data
function formatarData(data) {
    const dataFormatada = new Date(data.replace(" ", "T"));
    return dataFormatada.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    });  
}


// guarda todas as ordens de serviço
let ordensServico;


// receber e exibir todas as ordens de serviço
function listarOS() {
    fetchPHP("../php/orcamentos/exibir-servicos.php", "GET").then((dadosRecebidos) => {
        ordensServico = JSON.parse(dadosRecebidos);

        const containerOrdens = document.querySelector(".cards");

        let cardsOS = ``;

        for (const OS of ordensServico) {            
            const servicos = OS.servicos.map(servico => servico.tipoServico).join(", ");
    
            cardsOS += `
                <div class="card-servicos">
                    <span class="info-servico">Ordem de serviço #${OS.id}</span>
                    <span class="info-destaque">${servicos}</span>
                    <span class="info-secundaria">Cliente: <span class="destaque">${OS.cliente.nome}</span></span>
                    <span class="info-secundaria">Veículo: <span class="destaque">${OS.veiculo.placa} - ${OS.veiculo.modelo_marca} (${OS.veiculo.ano})</span></span>
                    <span class="info-terciaria">Criado em: <span class="destaque">${formatarData(OS.data_criacao)} - ${formatarValor(OS.valor_total)}</span></span>                    
                    <span class="status ${OS.status.toLowerCase()}">${OS.status}</span>
                    <div class="btns">
                        <button class="atualizar" data-cliente-id="${OS.id}">Atualizar status</button>
                        <div class="acoes servico">
                            <button type="button" class="btn-acoes servico">
                                Mais ações
                            </button>
                            <div class="opcoes-acoes servico">
                                <button type="button" class="ver-detalhes-acao" data-cliente-id="${OS.id}">Ver detalhes</button>
                                <button type="button" class="editar-os-acao" data-cliente-id="${OS.id}">Editar OS</button>
                                <button type="button">Compartilhar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }

        // coloca todos os cards das OS no container
        containerOrdens.innerHTML = cardsOS;

        atualizarContador();        
    });
}

// adicionar os dados da ordem de serviço escolhida no modal de detalhes
function detalhesOS(id) {
    // encontra os dados da ordem de serviço selecionada
    const OS = ordensServico.find(ordem => ordem.id == id);

    // container do conteúdo do modal
    const containerDetalhes = document.querySelector(".modal-detalhes")

    containerDetalhes.innerHTML = `
        <button type="button" class="btn-fechar">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <h1>Ordem de serviço #${OS.id}</h1>
            <div class="informacoes">
                <p>Cliente: <span>${OS.cliente.nome}</span></p>
                <p>Veículo: <span>${OS.veiculo.placa} - ${OS.veiculo.modelo_marca} (${OS.veiculo.ano})</span></p>
                <p>Diagnóstico: <span>${OS.diagnostico}</span></p>                
            </div>

            <div class="detalhes">
                <div class="detales-servico">
                    <h2>Serviços</h2>
                    ${OS.servicos.map((servico) => (
                        `<p> ${servico.tipoServico} &#8226; ${formatarValor(servico.Valor_unit)} </p>`
                    )).join("")}
                </div>

                <div class="detalhes-pecas">
                    <h2>Peças</h2>
                    ${OS.pecas.length > 0 ?
                        OS.pecas.map((pecas) => (
                            `<p> ${pecas.Quantidade}x &#8226; ${pecas.Nome} &#8226; ${formatarValor(pecas.valor_unit)} </p>`
                        )).join("") :
                        "<p>Sem peças adicionadas</p>"
                    }
                </div>
                <hr>
            </div>
            <div class="detalhes-valor">
                <p>Mão de obra: ${formatarValor(OS.total_servicos)}</p>
                <p>Peças: ${formatarValor(OS.total_pecas)}</p>
                <div class="valor-orcamento">
                    <h2>Valor total do orçamento</h2>
                    <p>${formatarValor(OS.valor_total)}</p>
                </div>
            </div>
            <p class="baixar-pdf">Baixar PDF</p>
    `;
}