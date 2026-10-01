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


/// ===== MODAIS =====

// abrir modal
function abrirModal(modalName) {
    const modal = document.querySelector(modalName);
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    console.log("modal abriu!");
}

// fechar modal
function fecharModal(modal) {
    // adiciona a classe da animação de saída do modal
    modal.querySelector(".modal")
        ?.classList.add("modal-fechando");

    // espera a animação terminar antes de esconder o modal
    setTimeout(() => {
        modal.style.display = "none";

        // remove a classe para permitir que a animação funcione novamente ao abrir
        modal.querySelector(".modal")
            ?.classList.remove("modal-fechando");
    }, 300);

    document.body.style.overflow = "auto";

    console.log("modal fechou!");
}

// evento de clique em um botão pra ele abrir seu modal correspondente
function modalBtnConfig(btnModal, modal) {
    document.addEventListener("click", (event) => {
        const btn = event.target.closest(btnModal);
        if (!btn) return;
        abrirModal(modal)
        
    })
    console.log(`${modal} configurado`);
}

// configura botões e seus modais correspondentes
modalBtnConfig(".ver-detalhes-acao", "#modalDetalhes");
modalBtnConfig(".editar-os-acao", "#modalEditar");
modalBtnConfig(".atualizar", "#modalStatus");
modalBtnConfig(".cadastrarCliente", "#modalAddCliente");
modalBtnConfig(".btn-editar", "#modalEditarCliente");
modalBtnConfig(".editar-veiculos", "#modalEditarVeiculos");
modalBtnConfig(".atualizar-status", "#modalStatus");

// evento de clique pra fechar modais
document.addEventListener("click", (event) => {
    const btnFechar = event.target.closest(".btn-fechar");
    if (!btnFechar) return;

    // pega o overlay em que o botão ta dentro
    const overlay = btnFechar.closest(".overlay");
    if (!overlay) return;
    fecharModal(overlay);
})

// botão de confirmar mudança de status
const confirmarStatus = document.querySelector(".confirmar-status");

if (confirmarStatus) {
    confirmarStatus.addEventListener("click", () => {        
        const overlay = confirmarStatus.closest(".overlay");
        if (!overlay) return;
        fecharModal(overlay);
    })
}



// Mais opções
// controla os cliques dos botões "Mais ações"

document.addEventListener('click', (event) => {

    const btnAcoes = event.target.closest('.btn-acoes');

    console.log("botao existe: ", btnAcoes);

    // abre o menu clicado e fecha os outros
    if (btnAcoes) {

        const acao = btnAcoes.closest('.acoes');

        document.querySelectorAll('.acoes').forEach(outro => {
            if (outro !== acao) {
                outro.classList.remove('aberto');
                outro.classList.remove('abrir-cima');
            }
        });

        acao.classList.toggle('aberto');

        // verifica o espaço disponível
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

    // fecha o menu depois de escolher uma opção
    if (opcao) {
        opcao.closest('.acoes').classList.remove('aberto');
        return;
    }

    // fecha o menu quando clica fora dele
    if (!event.target.closest('.acoes')) {
        document.querySelectorAll('.acoes').forEach(acao => {
            acao.classList.remove('aberto');
            acao.classList.remove('abrir-cima');
        });
    }

});

// opcoes de atualizar status

const opcoesStatus = document.querySelectorAll('.status-opcoes div');

opcoesStatus.forEach(status => {
    status.addEventListener("click", () => {
        trocar(status)
    })    
});

function trocar(statusSelecionado) {
    opcoesStatus.forEach(status => {
        status.classList.remove('status-ativo');
    });
    statusSelecionado.classList.add('status-ativo');
}