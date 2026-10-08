const btnCadastrar = document.querySelectorAll(".cadastrarCliente");
const overlay = document.getElementById("overlay");
const modal = document.querySelector(".modal-add-cliente");
const btnFechar = document.querySelector(".btn-fechar");

// --- Busca de clientes ---

const campoBusca = document.querySelector("#busca");
const listaCliente = document.querySelector("#listaCliente");
let clienteSelecionado = null;

// executa a função sempre que o conteúdo do campo de busca for alterado
campoBusca.addEventListener("input", function () {
    
    const busca = campoBusca.value.trim();
    
    // se estiver vazio apaga a lista e encerra
    if (busca === "") {
        listaCliente.innerHTML = "";
        listaCliente.style.display = "none";
        return;
    }

    fetch(`../php/buscar-cliente.php?busca=${encodeURIComponent(busca)}`)
        .then(resposta => resposta.json()) 
        .then(clientes => {
            listaCliente.innerHTML = "";

            clientes.forEach(cliente => {
                const item = document.createElement("div");
                item.classList.add("item-cliente");
                item.textContent = cliente.Nome;

                item.addEventListener("click", function () {
                    campoBusca.value = cliente.Nome;
                    clienteSelecionado = cliente; // salva o cliente selecionado para vincular ao orçamento
                    veiculoSelecionado = null;
                    campoBuscaVeiculo.value = "";       
                    listaCliente.style.display = "none";
                });

                listaCliente.appendChild(item);
            }) 

            listaCliente.style.display = "block";
        })
        
        .catch(erro => { 
            console.error("Erro ao buscar clientes:", erro); 
        });
    });

// fecha quando clica fora da área de pesquisa
document.addEventListener("click", function (evento) {
    if(!evento.target.closest(".pesquisa")){
        listaCliente.style.display = "none";
    }
});


// --- Busca de veículos ---

const campoBuscaVeiculo = document.querySelector("#buscaVeiculo");
const listaVeiculo = document.querySelector("#listaVeiculo");
let veiculoSelecionado = null;

campoBuscaVeiculo.addEventListener("click", function() {

    if (!clienteSelecionado) {
        return;
    }

    fetch(`../php/buscar-veiculo.php?id_cliente=${clienteSelecionado.ID_cliente}`)
        .then(resposta => {
            return resposta.json();
        })
        .then(veiculos => {
            listaVeiculo.innerHTML = "";

            veiculos.forEach(veiculo => {
                const item = document.createElement("div");
                item.classList.add("item-veiculo");

                item.textContent = `${veiculo.Model_Marca} (${veiculo.Ano}) - ${veiculo.Placa}`;

                // Seleciona o veículo ao clicar nele
                item.addEventListener("click", function() {
                    campoBuscaVeiculo.value = item.textContent;
                    veiculoSelecionado = veiculo;
                    listaVeiculo.style.display = "none";
                });

                listaVeiculo.appendChild(item);
            });

            listaVeiculo.style.display = "block";
        })
        .catch(erro => {
            console.error("Erro ao buscar veículos:", erro);
        });
});


// --- Adicionar e remover peça e serviço ---

// função para exibir mensagem de erro
function exibirErro(seletor, mensagem) {
    const msgErro = document.querySelector(seletor);
    msgErro.textContent = mensagem;
    msgErro.classList.add('visivel');

    setTimeout(() => {
        msgErro.classList.remove('visivel');
    }, 2200);

    setTimeout(() => {
        msgErro.textContent = '';
    }, 2500);
}


// adicionar uma nova peça utilizada
function addPeca() {
    const campoPeca = document.querySelector('.nome-peca').value.trim();
    const campoValor = document.querySelector('.valor-uni-peca').value.trim();
    const campoQtd = document.querySelector('.qtd-peca').value.trim();

    const valorNum = Number(campoValor.replace(',', '.'));
    const qtdNum = Number(campoQtd);

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

    const listaPecas = document.querySelector('.lista-pecas');

    const peca = document.createElement('div');
    peca.classList.add('peca');

    const valorFormatado = valorNum.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    peca.innerHTML = `
        <div>
            <span>${campoPeca}</span>
        </div>

        <div>
            <span>R$ ${valorFormatado}</span>
            <span>${qtdNum}x</span>
            <i class="fa-solid fa-xmark" onclick="remover(this)"></i>
        </div>
    `;

    listaPecas.appendChild(peca);

    document.querySelector('.nome-peca').value = '';
    document.querySelector('.valor-uni-peca').value = '';
    document.querySelector('.qtd-peca').value = '';
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

    const valorFormatado = valorNum.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const listaServico = document.querySelector('.lista-servico');

    const servico = document.createElement('div');
    servico.classList.add('peca');

    servico.innerHTML = `
        <span>${campoServico}</span>

        <div>
            <span>R$ ${valorFormatado}</span>
            <i class="fa-solid fa-xmark" onclick="remover(this)"></i>
        </div>
    `;

    listaServico.appendChild(servico);

    document.querySelector('.tipo-servico').value = '';
    document.querySelector('.valor-uni-servico').value = '';
}

// remover peça ou serviço
function remover(botao) {
    botao.parentElement.parentElement.remove();
}