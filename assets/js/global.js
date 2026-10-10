// função para enviar requisição ao php
function fetchPHP(caminho, metodo, dados) {
    return fetch(caminho, {
        method: metodo,
        body: dados
    }).then((resposta) => resposta.text());
}

// formulário para cadastrar cliente (página clientes e orçamento)
const formAddCliente = document.querySelector(".form-add-cliente");
if (formAddCliente) {
    formAddCliente.addEventListener("submit", (enviar) => {
        enviar.preventDefault();

        const dados = new FormData(formAddCliente);

        fetchPHP("../php/cliente-cadastrar.php", "POST", dados).then((dadosRecebidos) => {
            if (dadosRecebidos == "Sucesso") {
                alert("Cliente cadastrado com sucesso!");
                fecharModal(formAddCliente.closest(".overlay"));
                listarClientes();
                formAddCliente.reset();
            } else {
                alert("Erro ao cadastrar cliente: " + dadosRecebidos);
            }
        });
    });
}

// Filtro de ordem
const ordemFiltros = document.querySelectorAll('.ordem-filtro');

ordemFiltros.forEach((ordemFiltro) => {
    const ordemBtn = ordemFiltro.querySelector(".ordem-btn");
    const ordemTexto = ordemBtn.querySelector("span");
    const ordemOpcoes = ordemFiltro.querySelectorAll(".ordem-opcoes button");

    ordemBtn.addEventListener("click", () => {
        ordemFiltro.classList.toggle("aberto");
    });

    ordemOpcoes.forEach(opcao => {
        opcao.addEventListener('click', () => {
            ordemTexto.textContent = opcao.textContent;
            ordemFiltro.classList.remove('aberto');
        });
    });
});

document.addEventListener('click', (event) => {
    ordemFiltros.forEach(ordemFiltro => {
        if (!ordemFiltro.contains(event.target)) {
            ordemFiltro.classList.remove('aberto');
        }
    });
});

// ===== MODAIS =====

// Abrir modal
function abrirModal(modalName) {
    const modal = document.querySelector(modalName);
    if (!modal) return;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    console.log("modal abriu!");
}

// Fechar modal
function fecharModal(modal) {
    if (!modal) return;

    modal.querySelector(".modal")
        ?.classList.add("modal-fechando");

    setTimeout(() => {
        modal.style.display = "none";

        modal.querySelector(".modal")
            ?.classList.remove("modal-fechando");
    }, 300);

    document.body.style.overflow = "auto";
}

// Evento de clique em um botão para abrir seu modal correspondente
function modalBtnConfig(btnModal, modal) {
    document.addEventListener("click", (event) => {
        const btn = event.target.closest(btnModal);
        if (!btn) return;

        abrirModal(modal);
    });

    console.log(`${modal} configurado`);
}

// Configura botões e seus modais correspondentes
modalBtnConfig(".ver-detalhes-acao", "#modalDetalhes");
modalBtnConfig(".editar-os-acao", "#modalEditar");
modalBtnConfig(".atualizar", "#modalStatus");
modalBtnConfig(".cadastrarCliente", "#modalAddCliente");
modalBtnConfig(".btn-editar", "#modalEditarCliente");
modalBtnConfig(".editar-veiculos", "#modalEditarVeiculos");
modalBtnConfig(".atualizar-status", "#modalStatus");

// Evento de clique para fechar modais
document.addEventListener("click", (event) => {
    const btnFechar = event.target.closest(".btn-fechar");
    if (!btnFechar) return;

    const overlay = btnFechar.closest(".overlay");
    if (!overlay) return;

    fecharModal(overlay);
});

// Botão de confirmar mudança de status
const confirmarStatus = document.querySelector(".confirmar-status");

if (confirmarStatus) {
    confirmarStatus.addEventListener("click", () => {
        const overlay = confirmarStatus.closest(".overlay");
        if (!overlay) return;

        fecharModal(overlay);
    });
}

// Mais opções: controla os cliques dos botões "Mais ações"
document.addEventListener('click', (event) => {
    const btnAcoes = event.target.closest('.btn-acoes');

    console.log("botao existe: ", btnAcoes);

    // Abre o menu clicado e fecha os outros
    if (btnAcoes) {
        const acao = btnAcoes.closest('.acoes');

        document.querySelectorAll('.acoes').forEach(outro => {
            if (outro !== acao) {
                outro.classList.remove('aberto');
                outro.classList.remove('abrir-cima');
            }
        });

        acao.classList.toggle('aberto');

        // Verifica o espaço disponível
        if (acao.classList.contains('aberto')) {
            const opcoes = acao.querySelector('.opcoes-acoes');
            const rect = opcoes.getBoundingClientRect();
            const espacoEmbaixo = window.innerHeight - rect.top;

            if (espacoEmbaixo < rect.height) {
                acao.classList.add('abrir-cima');
            }
        }

        return;
    }

    const opcao = event.target.closest('.opcoes-acoes button');

    // Fecha o menu depois de escolher uma opção
    if (opcao) {
        opcao.closest('.acoes').classList.remove('aberto');
        return;
    }

    // Fecha o menu quando clica fora dele
    if (!event.target.closest('.acoes')) {
        document.querySelectorAll('.acoes').forEach(acao => {
            acao.classList.remove('aberto');
            acao.classList.remove('abrir-cima');
        });
    }
});

// Opções de atualizar status
const opcoesStatus = document.querySelectorAll('.status-opcoes div');

opcoesStatus.forEach(status => {
    status.addEventListener("click", () => {
        trocar(status);
    });
});

function trocar(statusSelecionado) {
    opcoesStatus.forEach(status => {
        status.classList.remove('status-ativo');
    });

    statusSelecionado.classList.add('status-ativo');
}

// Listar clientes
function listarClientes() {
    const containerPai = document.querySelector(".cards-clientes");
    if (!containerPai) return;

    fetch("../php/cliente-listar.php", {
        method: "GET",
    })
        .then((resposta_lista) => resposta_lista.text())
        .then((resulta_lista) => {
            const infoCliente = JSON.parse(resulta_lista);
            const cardModelo = containerPai.querySelector(".cliente-card-modelo");

            if (!cardModelo) return;

            containerPai
                .querySelectorAll(".cliente-card:not(.cliente-card-modelo)")
                .forEach(card => card.remove());

            infoCliente.forEach((cliente) => {
                const card = cardModelo.cloneNode(true);
                card.classList.remove("cliente-card-modelo");

                card.querySelector(".info-destaque").textContent = cliente.nome;
                card.querySelector(".telefone").textContent = cliente.telefone;

                card.querySelector(".qt_veiculo").textContent =
                    cliente.quantidade_veiculo + " Veículos cadastrados";

                card.setAttribute("data-cliente-id", cliente.id);
                containerPai.appendChild(card);
            });

            pega();
        });
}

// Preenche os campos do modal com os dados atuais do cliente
document.addEventListener("click", (event) => {
    const btn = event.target.closest(".btn-editar");
    if (!btn) return;

    fetchPHP("../php/cliente-detalhes.php", "GET").then((dadosRecebidos) => {
        const cliente = JSON.parse(dadosRecebidos);

        if (cliente.erro) {
            console.error(cliente.erro);
            return;
        }

        const form = document.querySelector(".form-editar-cliente");
        if (!form) return;

        form.querySelector('[name="editar-nome"]').value = cliente.nome;
        form.querySelector('[name="editar-tel"]').value = cliente.telefone;
    });
});

// Executa a listagem apenas nas páginas que possuem os cards
if (document.querySelector(".cards-clientes")) {
    listarClientes();
}

// Ativar clique nos cards dos clientes
function pega() {
    const clientesCards = document.querySelectorAll(
        ".cliente-card:not(.cliente-card-modelo)"
    );

    console.log("Quantidade de cards encontrados pelo JS:", clientesCards.length);

    clientesCards.forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-cliente-id");

            if (!id) {
                console.log("Alerta: Este card não possui um ID definido!");
                return;
            }

            console.log(id);

            fetch("../php/cliente-seleciona.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cliente_id: id })
            })
                .then((resposta) => resposta.text())
                .then((resultado) => {
                    alert(resultado);
                    window.location.href = "../dashboard/detalhes-cliente.html";
                });
        });
    });
}

// Buscar dados do cliente selecionado
function pegaCliente() {
    fetch("../php/cliente-detalhes.php", {
        method: "GET",
    })
        .then((resposta) => resposta.json())
        .then((cliente) => {     

            if (cliente.erro) {
                console.error(cliente.erro);
                return;
            }

            const containerPai = document.querySelector(".cliente-detalhes");

            if (containerPai) {
                const nomeSpan = containerPai.querySelector(".info-destaque");
                if (nomeSpan) nomeSpan.textContent = cliente.nome;

                const telefoneSpan = containerPai.querySelector(".info-secundaria");
                const iconTelefone = telefoneSpan?.querySelector("i");

                if (iconTelefone) {
                    iconTelefone.classList.add("fa-solid", "fa-phone");
                }

                if (telefoneSpan) {
                    telefoneSpan.querySelector(".telefone-texto")?.remove();

                    const textoTelefone = document.createElement("span");
                    textoTelefone.classList.add("telefone-texto");
                    textoTelefone.textContent = cliente.telefone;
                    telefoneSpan.appendChild(textoTelefone);
                }
            }

            // Exibir veículos do cliente
            const containerVeiculos = document.getElementById("listaVeiculosCliente");

            if (containerVeiculos) {
                containerVeiculos.innerHTML = "";

                (cliente.veiculos || []).forEach((veiculo) => {

                    containerVeiculos.innerHTML += `
                        <div class="card-veiculos">
                            <span class="info-destaque">${veiculo.Placa}</span>
                            <span class="info-secundaria">${veiculo.Model_Marca} • ${veiculo.Ano}</span>
                            <span class="info-historico">Último serviço em 00/00/0000</span>
                        </div>
                    `;
                });
            }
        })
        .catch((erro) => console.error("Erro ao buscar dados do cliente:", erro));
}

// Verifica se a página de detalhes do cliente existe antes de buscar os dados
if (document.querySelector(".cliente-detalhes")) {
    pegaCliente();
}
