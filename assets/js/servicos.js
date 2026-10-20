// filtro definido por padrão
let filtro = "todos";

function filtrar(tipo, elemento) {
    // atualiza o filtro
    filtro = tipo;

    // adiciona a classe 'selected' pra opcao de filtro selecionada
    const botoes = document.querySelectorAll(".opcao");

    if (botoes.length === 0) return

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

// contador dos filtros por status

function atualizarContador() {

    const cards = document.querySelectorAll(".card-servicos");

    // se estiver na página de detalhes, essa função não vai rodar
    const paginaDetalhes = document.querySelector(".cards-cliente")
    if (paginaDetalhes) return

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
    const painelOS = document.querySelector(".lista-servicos");
    if (painelOS) painelListar()
    // impedindo que a função para listar OS rode ao abrir a página de detalhes cliente
    const paginaDetalhes = document.querySelector(".cards-cliente"); 
    if (!paginaDetalhes) listarOS();
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

function painelListar() {
    const containerOrdens = document.querySelector(".lista-servicos");
    const contadorPainel = document.querySelector("#contador-servicos-painel")

    if (!containerOrdens) return

    fetchPHP("../php/orcamentos/exibir-servicos.php", "GET").then((dadosRecebidos) => {
        ordensServico = JSON.parse(dadosRecebidos);


        let cardsOS = ``;
        let contador = 0;

        for (const OS of ordensServico) {   
            
            if (OS.status != "Em andamento") {
                continue;
            }
            
            contador++;            
            
            const servicos = OS.servicos.map(servico => servico.tipoServico).join(", ");
    
            cardsOS += `
                <div class="single-servico">
                    <div class="resumo-info-servico">
                    <div class="ordem-servico">
                        <p>#${OS.id}</p>
                    </div>
                    <div class="servico-resumo">
                        <span>${OS.veiculo.placa}</span>
                        <p>${servicos} &bull; ${formatarValor(OS.valor_total)}</p>
                    </div>
                    </div>
                    <div class="acoes painel">
                    <button type="button" class="btn-acoes painel">
                        <span class="icone-opcoes">&#8942;</>
                    </button>
                    <div class="opcoes-acoes painel">
                        <button type="button" class="ver-detalhes-acao" data-os-id="${OS.id}">Ver detalhes</button>
                        <button type="button" class="atualizar-status" data-os-id="${OS.id}">Atualizar status</button>
                        <button type="button" class="editar-os-acao" data-os-id="${OS.id}">Editar OS</button>
                        <button type="button">Compartilhar</button>
                    </div>
                    </div>
                </div>
            `
        }

        // coloca todos os cards das OS no container
        containerOrdens.innerHTML = cardsOS;
        contadorPainel.innerHTML = contador;
    });
}

// receber e exibir todas as ordens de serviço
function listarOS() {
    const painel = document.querySelector(".lista-servicos")
    if (painel) return
    filtrar("todos", document.querySelector(".btn-filtro > .opcao"))

    fetchPHP("../php/orcamentos/exibir-servicos.php", "GET").then((dadosRecebidos) => {
        ordensServico = JSON.parse(dadosRecebidos);

        const containerOrdens = document.querySelector(".cards");

        let cardsOS = ``;

        for (const OS of ordensServico) {   
            
            // se estiver na página detalhes cliente, pula as OS que não pertencem ao cliente
            if (containerOrdens.classList.contains("cards-cliente")) {
                const id = Number(containerOrdens.getAttribute("cliente-id"))
                if (id !== Number(OS.cliente.id)) continue
            }
            
            const servicos = OS.servicos.map(servico => servico.tipoServico).join(", ");
    
            cardsOS += `
                <div class="card-servicos">
                    <span class="info-servico">Ordem de serviço #${OS.id}</span>
                    <span class="info-destaque">${servicos}</span>
                    <span class="info-secundaria">Cliente: <span class="destaque">${OS.cliente.nome}</span></span>
                    <span class="info-secundaria">Veículo: <span class="destaque">${OS.veiculo.placa} - ${OS.veiculo.modelo_marca} (${OS.veiculo.ano})</span></span>
                    <span class="info-terciaria">Criado em: <span class="destaque">${formatarData(OS.data_criacao)} - ${formatarValor(OS.valor_total)}</span></span>                    
                    <span class="status ${OS.status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}">${OS.status}</span>
                    <div class="btns">
                        <button class="${OS.status === "Concluído" ?"atualizar disabled" : "atualizar"}" data-os-id="${OS.id}">Atualizar status</button>
                        <div class="acoes servico">
                            <button type="button" class="btn-acoes servico">
                                Mais ações
                            </button>
                            <div class="opcoes-acoes servico">
                                <button type="button" class="ver-detalhes-acao" data-os-id="${OS.id}">Ver detalhes</button>
                                ${OS.status == "Concluído" ? "" : `<button type="button" class="editar-os-acao" data-os-id="${OS.id}">Editar OS</button>`}
                                <button type="button">Compartilhar</button>
                                ${OS.status === "Pendente" ? `
                                    <button type="button" class="cancelar-os" style="color: red;" data-os-id="${OS.id}">Cancelar orçamento</button>
                                ` : ``}
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

// adicionar os dados da ordem de serviço escolhida no modal de status
function statusOS(id) {
    // encontra os dados da ordem de serviço selecionada
    const OS = ordensServico.find(ordem => ordem.id == id);

    console.log("a")
    console.log(OS)

    // container do conteúdo do modal
    const containerStatus = document.querySelector(".modal-status")

    containerStatus.innerHTML = `
        <button type="button" class="btn-fechar">
            <i class="fa-solid fa-xmark"></i>
        </button>

        <h1>Status da OS #${OS.id}</h1>
        <h2>Selecione o estado atual da ordem de serviço</h2>

        <div class="status-opcoes" data-status-selecionado="${OS.status}" data-id_os="${OS.id}">
            ${verificaStatus(OS.status)}        
        </div>

        <button class="confirmar-status">Atualizar Status</button>
    `;

    ativarTrocaStatus()
}

// ao abrir modal de status, verificar qual o status da OS selecionada
function verificaStatus(statusAtual) {
    if (statusAtual === "Pendente") {
        return statusAtual = `
            <div data-status="Pendente" class="status-pendente status-ativo">Pendente</div>
            <div data-status="Em andamento" class="status-andamento">Em andamento</div>
            <div data-status="Concluído" class="status-concluido">Concluído</div>
        `        
    }
    else if (statusAtual === "Em andamento") {
        return statusAtual = `
            <div data-status="Pendente" class="status-pendente">Pendente</div>
            <div data-status="Em andamento" class="status-andamento status-ativo">Em andamento</div>
            <div data-status="Concluído" class="status-concluido">Concluído</div>
        `
    }
    else {
        return statusAtual = `
            <div data-status="Pendente" class="status-pendente">Pendente</div>
            <div data-status="Em andamento" class="status-andamento">Em andamento</div>
            <div data-status="Concluído" class="status-concluido status-ativo">Concluído</div>
        `
    }    
}

const manterOS = document.querySelector("#cancelarExcluirOS")
const cancelarOS = document.querySelector("#confirmarExcluirOS")

if (manterOS) {
    manterOS.addEventListener("click", () => {
        const overlay = manterOS.closest(".overlay");
        fecharModal(overlay)
    })
}

function cancelarOrcamento(id) {
    cancelarOS.addEventListener("click", () => {
        const dados = new FormData();
    
        dados.append("id_os", id);        

        fetchPHP("../php/orcamentos/cancelar-orcamento.php", "POST", dados).then((dadosRecebidos) => {
            if (dadosRecebidos == "Sucesso") {
                alert("Orçamento cancelado com sucesso.");
                const overlay = cancelarOS.closest(".overlay");
                if (!overlay) return;
                listarOS()
                fecharModal(overlay);
            } else {
                alert("Erro ao excluir orçamento: " + dadosRecebidos);
            }
        });
    })
}
    