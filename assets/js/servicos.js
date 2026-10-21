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
    const infoPendentes = document.querySelector("#info-pendentes")

    if (!containerOrdens) return

    fetchPHP("../php/orcamentos/exibir-servicos.php", "GET").then((dadosRecebidos) => {
        ordensServico = JSON.parse(dadosRecebidos);


        let cardsOS = ``;
        let contador = 0;
        let contadorPendentes = 0;

        for (const OS of ordensServico) {   
            
            if (OS.status != "Em andamento") {
                if (OS.status === "Pendente") {
                    contadorPendentes++
                }
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
        infoPendentes.innerHTML = contadorPendentes
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
   

function buscarServicos(){
    const campoBusca = document.querySelector(".input-pesquisa");

    campoBusca.addEventListener("input", () => {
        const busca = campoBusca.value.toLowerCase().trim();

        const container = document.querySelector(".cards");
        const cardsServico = [...container.querySelectorAll(".card-servicos")];

        cardsServico.forEach(card => container.appendChild(card));
        
        document.querySelectorAll(".card-servicos")
        .forEach(card => {
            const nomeServico = card.querySelector(".info-destaque").textContent.toLowerCase();

            card.style.display = nomeServico.includes(busca) ? "" : "none";
        });
    });
}

if (document.querySelector(".input-pesquisa")) buscarServicos();

function exibirEditarOS(id) {
    const OS = ordensServico.find(ordem => ordem.id == id);

    const containerEditar = document.querySelector(".modal-editar")

    let servicos = ``
    let pecas = ``

    for (const servico of OS.servicos) {        
        servicos += `
            <div class="input-servico" data-tipo-servico="${servico.tipoServico}" data-valor-servico="${servico.Valor_unit}">
                <input value="${servico.tipoServico}" type="text" disabled>
                <div class="direita-input">
                    <p class="valor">${formatarValor(servico.Valor_unit)}</p>
                    <i class="fa-solid fa-xmark" onclick="remover(this)"></i>
                </div>
            </div>
        `
    }

    for (const peca of OS.pecas) {        
        pecas += `
            <div class="input-peca" data-nome-peca="${peca.Nome}" data-valor-peca="${peca.valor_unit}" data-qtd-peca="${peca.Quantidade}">
                <input value="${peca.Nome}" type="text" disabled>
                <div class="direita-input">
                    <p class="valor">${formatarValor(peca.valor_unit)}</p>
                    <p class="valor">${peca.Quantidade}x</p>
                    <i class="fa-solid fa-xmark" onclick="remover(this)"></i>
                </div>
            </div>
        `
    }

    containerEditar.innerHTML = `
        <button type="button" class="btn-fechar">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <h1>Editar Ordem de Serviço #${OS.id}</h1>

        <form class="form-edt-os">
            <div class="campos-form">
                <div class="campo-form">
                    <label>Cliente</label>
                    <input value="${OS.cliente.nome}" type="text" class="campo-cliente" id="cliente" disabled>
                </div>
                <div class="campo-form">
                    <label>Veículo</label>
                    <input value="${OS.veiculo.placa}" type="text" class="campo-veiculo" id="veiculo" disabled>
                </div>
                <div class="campo-textarea">
                    <label>Diagnóstico do veículo</label>
                    <textarea class="campo-diag" id="diagnostico">${OS.diagnostico}</textarea>
                </div>

                <div class="campo-form selecionar" id="select-servico">
                    <label>Serviço</label>
                    <div id="div-servicos-editar">                        
                        ${servicos}
                    </div>
                    <button type="button" class="adicionar add-novo-servico">Adicionar serviço</button>
                </div>
                <div class="campo-form selecionar" id="select-peca">
                    <label>Peças</label>
                    <div id="div-pecas-editar">
                        ${pecas}
                    </div>
                    <button type="button" class="adicionar add-nova-peca">Adicionar peça</button>
                </div>
                <div class="campo-resumo">
                    <label>Resumo</label>

                    <div class="resumo-infos">
                        <div class="resumo-servicos">
                            <p>Serviços:</p>
                            <p class="total-servicos">${formatarValor(OS.total_servicos)}</p>
                        </div>
                        <div class="resumo-pecas">
                            <p>Peças:</p>
                            <p class="total-pecas">${formatarValor(OS.total_pecas)}</p>
                        </div>

                        <hr class="linha-resumo">

                        <div class="resumo-total">
                            <p>VALOR TOTAL</p>
                            <p class="total-valor">${formatarValor(OS.valor_total)}</p>
                        </div>
                    </div>
                </div>
                <div class="resumo-btns">
                    <button class="resumo-cancelar">Cancelar alterações</button>
                    <button type="button" class="resumo-confirmar">Confirmar alterações</button>
                </div>
            </div>
        </form>
    `

    console.log(OS)    
    const confirmarEditar = document.querySelector(".resumo-confirmar")
    confirmarEditar.addEventListener("click", () => {
        editarOS(OS.id)
    })

    const addPeca = document.querySelector(".add-nova-peca")
    const addServico = document.querySelector(".add-novo-servico")
    addPeca.addEventListener("click", () => {
        adicionarCampoOS(addPeca)
    })
    addServico.addEventListener("click", () => {
        adicionarCampoOS(addServico)
    })

    atualizaResumoEditar()
}

function editarOS(id) {
    const diagnostico = document.querySelector("#diagnostico").value.trim();

    if (diagnostico === "") {
        alert("Preencha o diagnóstico do veículo!");
        return;
    }

    if (dadosServicosEditar.length === 0) {
        alert("Adicione pelo menos um serviço ao orçamento!");
        return;
    }
    
    const dados = {
        id_os: id, 
        diagnostico: diagnostico,
        pecas: dadosPecasEditar,
        servicos: dadosServicosEditar
    };

    fetch("../php/orcamentos/editar-servico.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.sucesso) {
            alert("Ordem de serviço atualizada com sucesso!");
            window.location.reload();
        } else {
            const mensagemErro = dados.erro || dados.mensagem || "Não foi possível atualizar a ordem de serviço.";
            alert("Erro: " + mensagemErro);
        }
    })
    .catch(erro => {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível atualizar a ordem de serviço. Verifique a conexão com o servidor.");
    });
}

let dadosServicosEditar, dadosPecasEditar

function atualizaResumoEditar() {
    const servicos = document.querySelectorAll(".input-servico")
    const pecas = document.querySelectorAll(".input-peca")

    let totalServicos = 0;
    let totalPecas = 0;
    let totalValor = 0;
    
    dadosServicosEditar = Array.from(servicos).map(servico => {
        const tipoServico = servico.dataset.tipoServico
        const valor = parseFloat(servico.dataset.valorServico)
        
        totalServicos += valor

        return {
            tipoServico: tipoServico,
            Valor_unit: valor,            
        };
    });

    dadosPecasEditar = Array.from(pecas).map(peca => {
        const nome = peca.dataset.nomePeca
        const valor = parseFloat(peca.dataset.valorPeca)
        const qtd = parseInt(peca.dataset.qtdPeca)
        
        totalPecas += valor * qtd

        return {
            Nome: nome,
            valor_unit: valor,
            Quantidade: qtd          
        };
    });
    
    totalValor = (totalPecas) + totalServicos

    const total = document.querySelector(".total-valor")
    const totalP = document.querySelector(".total-pecas")
    const totalS = document.querySelector(".total-servicos")

    total.textContent = formatarValor(totalValor)
    totalS.textContent = formatarValor(totalServicos)
    totalP.textContent = formatarValor(totalPecas)    
}

function adicionarCampoOS(btn) {
    if (btn.classList.contains("add-nova-peca")) {
        if (document.querySelector(".editar-peca-modal")) {
            document.querySelector(".editar-peca-modal").style.display = "flex";
            btn.style.display = "none";
            return
        }
        const pecas = document.querySelector("#select-peca")
        let campoPeca = document.createElement("div")
        campoPeca.className = "campo-peca editar-peca-modal"
        campoPeca.innerHTML = `            
                <input class="nome-peca" type="text" placeholder="Nome da peça">
                <input class="valor-uni-peca" type="text" placeholder="Valor Uni.">
                <input class="qtd-peca" type="number" min="1" placeholder="Qtd">
                <button type="button" onclick="addPeca()" class="add-peca">+</button>            
        `
        pecas.appendChild(campoPeca)
        btn.style.display = "none"
    }
    else {
        if (document.querySelector(".editar-servico-modal")) {
            document.querySelector(".editar-servico-modal").style.display = "flex";
            btn.style.display = "none";
            return
        }
        const servicos = document.querySelector("#select-servico")
        let campoServico = document.createElement("div")
        campoServico.className = "campo-servico editar-servico-modal"
        campoServico.innerHTML = `            
            <input class="tipo-servico" type="text" placeholder="Tipo de serviço">
            <input class="valor-uni-servico" type="text" placeholder="Valor Uni.">
            <button type="button" class="add-servico" onclick="addServico()">+</button>          
        `
        servicos.appendChild(campoServico)
        btn.style.display = "none"
    }
}

// adicionar uma nova peça utilizada
function addPeca() {
    const campoPeca = document.querySelector('.nome-peca').value.trim();
    const campoValor = document.querySelector('.valor-uni-peca').value.trim();
    const campoQtd = document.querySelector('.qtd-peca').value.trim();

    const valorNum = parseFloat(campoValor);
    const qtdNum = parseInt(campoQtd, 10);

    if (campoPeca === '') {
        exibirErro(
            '.msgErroPeca',
            'Por favor, preencha o nome da peça.'
        );
        return;
    }

    if (isNaN(valorNum) || valorNum <= 0) {
        exibirErro(
            '.msgErroPeca',
            'Valor unitário inválido.'
        );
        return;
    }

    if (isNaN(qtdNum) || qtdNum <= 0 || !Number.isInteger(qtdNum)) {
        exibirErro(
            '.msgErroPeca',
            'Quantidade inválida.'
        );
        return;
    }

    const listaPecas = document.querySelector('#div-pecas-editar');

    const peca = document.createElement('div');
    peca.classList.add('input-peca');

    peca.setAttribute('data-nome-peca', campoPeca)
    peca.setAttribute('data-valor-peca', campoValor)
    peca.setAttribute('data-qtd-peca', campoQtd)

    peca.innerHTML = `
        <input value="${campoPeca}" type="text" disabled>
        <div class="direita-input">
            <p class="valor">${formatarValor(valorNum)}</p>
            <p class="valor">${campoQtd}x</p>
            <i class="fa-solid fa-xmark" onclick="remover(this)"></i>
        </div>
    `;

    listaPecas.appendChild(peca);

    document.querySelector('.nome-peca').value = '';
    document.querySelector('.valor-uni-peca').value = '';
    document.querySelector('.qtd-peca').value = '';

    document.querySelector(".editar-peca-modal").style.display = "none";

    document.querySelector(".add-nova-peca").style.display = "flex";
    atualizaResumoEditar()
}

// adicionar um novo serviço
function addServico() {
    const campoServico = document.querySelector('.tipo-servico').value.trim();
    const campoValorServico = document.querySelector('.valor-uni-servico').value.trim();

    const valorNum = Number(campoValorServico.replace(',', '.'));

    if (campoServico === '') {
        exibirErro(
            '.msgErroServico',
            'Por favor, preencha o serviço.'
        );
        return;
    }

    if (isNaN(valorNum) || valorNum <= 0) {
        exibirErro(
            '.msgErroServico',
            'Valor do serviço inválido.'
        );
        return;
    }

    const listaServico = document.querySelector('#div-servicos-editar');

    const servico = document.createElement('div');
    servico.classList.add('input-servico');

    servico.setAttribute('data-tipo-servico', campoServico)
    servico.setAttribute('data-valor-servico', campoValorServico)

    servico.innerHTML = `
        <input value="${campoServico}" type="text" disabled>
        <div class="direita-input">
            <p class="valor">${formatarValor(campoValorServico)}</p>
            <i class="fa-solid fa-xmark" onclick="remover(this)"></i>
        </div>
    `;

    listaServico.appendChild(servico);

    document.querySelector('.tipo-servico').value = '';
    document.querySelector('.valor-uni-servico').value = '';

    document.querySelector(".editar-servico-modal").style.display = "none";

    document.querySelector(".add-novo-servico").style.display = "flex";

    atualizaResumoEditar()
}

function remover(botao) {
    botao.parentElement.parentElement.remove();
    atualizaResumoEditar()
}