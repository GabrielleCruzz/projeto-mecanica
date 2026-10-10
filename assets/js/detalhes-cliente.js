document.addEventListener("DOMContentLoaded", () => {
    const listaVeiculos = document.getElementById("listaVeiculosCliente");
    const modalVeiculos = document.getElementById("modalEditarVeiculos");
    const modalConfirmacao = document.getElementById("modalConfirmarExcluirVeiculo");

    if (!listaVeiculos || !modalVeiculos || !modalConfirmacao) return;

    const camposVeiculo = modalVeiculos.querySelector(".campos-veiculo");
    const formulario = modalVeiculos.querySelector(".form-veiculos");
    const btnConfirmarExclusao = document.getElementById("confirmarExcluirVeiculo");
    const btnCancelarExclusao = document.getElementById("cancelarExcluirVeiculo");

    let idClienteSelecionado;
    let grupoParaExcluir;

    // Busca os veículos do cliente
    async function carregarVeiculos() {
        try {
            if (!idClienteSelecionado) {
                const resposta = await fetch("../php/cliente-detalhes.php");
                const cliente = await resposta.json();

                if (!resposta.ok || cliente.erro) {
                    throw new Error(cliente.erro || "Erro ao buscar cliente.");
                }

                idClienteSelecionado = cliente.id;
            }

            const resposta = await fetch(
                `../php/buscar-veiculo.php?id_cliente=${encodeURIComponent(idClienteSelecionado)}`
            );
            const veiculos = await resposta.json();

            if (!resposta.ok || veiculos.erro) {
                throw new Error(veiculos.erro || "Erro ao buscar veículos.");
            }

            exibirCards(veiculos);
            criarCamposVeiculos(veiculos);
        } catch (erro) {
            console.error("Erro ao carregar veículos:", erro);
            listaVeiculos.textContent = "Não foi possível carregar os veículos.";
        }
    }

    // Exibe os cards
    function exibirCards(veiculos) {
        listaVeiculos.replaceChildren();

        if (!veiculos.length) {
            listaVeiculos.textContent = "Nenhum veículo cadastrado.";
            return;
        }

        veiculos.forEach(veiculo => {
            const card = document.createElement("div");
            card.className = "card-veiculos";

            const placa = document.createElement("span");
            placa.className = "info-destaque";
            placa.textContent = veiculo.Placa;

            const modeloAno = document.createElement("span");
            modeloAno.className = "info-secundaria";
            modeloAno.textContent = `${veiculo.Model_Marca} • ${veiculo.Ano}`;

            const ultimoServico = document.createElement("span");
            ultimoServico.className = "info-historico";
            ultimoServico.textContent = "Último serviço: 00/00/0000";

            card.append(placa, modeloAno, ultimoServico);
            listaVeiculos.appendChild(card);
        });
    }

    // Cria os campos de um veículo
    function criarCampoVeiculo(veiculo = null) {
        const grupo = document.createElement("div");
        grupo.className = "infos-veiculo";

        if (veiculo) {
            grupo.dataset.idVeiculo = veiculo.ID_veiculo;
        }

        [
            ["campo-placa", "Placa", veiculo?.Placa ?? ""],
            ["campo-marca", "Marca/Modelo", veiculo?.Model_Marca ?? ""],
            ["campo-ano", "Ano", veiculo?.Ano ?? ""]
        ].forEach(([classe, texto, valor]) => {
            const container = document.createElement("div");
            container.className = classe;

            const label = document.createElement("label");
            label.textContent = texto;

            const input = document.createElement("input");
            input.type = "text";
            input.value = valor;
            input.required = true;

            container.append(label, input);
            grupo.appendChild(container);
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "btn-excluir-veiculo";
        btnExcluir.setAttribute("aria-label", "Excluir veículo");
        btnExcluir.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        grupo.appendChild(btnExcluir);
        return grupo;
    }

    // Monta os campos e mantém Adicionar no final
    function criarCamposVeiculos(veiculos) {
        camposVeiculo.replaceChildren();

        veiculos.forEach(veiculo => {
            camposVeiculo.appendChild(criarCampoVeiculo(veiculo));
        });

        const btnAdicionar = document.createElement("button");
        btnAdicionar.type = "button";
        btnAdicionar.className = "btn-adicionar-veiculo";
        btnAdicionar.textContent = "Adicionar veículo";

        camposVeiculo.appendChild(btnAdicionar);
    }

    // Adiciona veículos ou abre a confirmação de exclusão
    camposVeiculo.addEventListener("click", event => {
        if (event.target.closest(".btn-adicionar-veiculo")) {
            const btnAdicionar = camposVeiculo.querySelector(".btn-adicionar-veiculo");
            camposVeiculo.insertBefore(criarCampoVeiculo(), btnAdicionar);
            return;
        }

        const btnExcluir = event.target.closest(".btn-excluir-veiculo");
        if (!btnExcluir) return;

        grupoParaExcluir = btnExcluir.closest(".infos-veiculo");
        abrirModal("#modalConfirmarExcluirVeiculo");
    });

    // Cancela a exclusão
    btnCancelarExclusao.addEventListener("click", () => {
        fecharModal(modalConfirmacao);
        grupoParaExcluir = null;
    });

    // Confirma a exclusão
    btnConfirmarExclusao.addEventListener("click", async () => {
        if (!grupoParaExcluir) return;

        const idVeiculo = grupoParaExcluir.dataset.idVeiculo;

        // Se ainda não foi salvo, remove apenas os campos
        if (!idVeiculo) {
            grupoParaExcluir.remove();
            fecharModal(modalConfirmacao);
            grupoParaExcluir = null;
            return;
        }

        try {
            const resposta = await fetch("../php/excluir-veiculo.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cliente: idClienteSelecionado,
                    id_veiculo: idVeiculo
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                throw new Error(dados.erro || "Não foi possível excluir o veículo.");
            }

            fecharModal(modalConfirmacao);
            grupoParaExcluir = null;
            await carregarVeiculos();
        } catch (erro) {
            console.error("Erro ao excluir veículo:", erro);
            alert(erro.message || "Erro na comunicação com o servidor.");
        }
    });

    // Salva veículos novos e alterações
    formulario.addEventListener("submit", async event => {
        event.preventDefault();

        const veiculos = [...camposVeiculo.querySelectorAll(".infos-veiculo")].map(grupo => ({
            id: grupo.dataset.idVeiculo,
            placa: grupo.querySelector(".campo-placa input").value.trim(),
            marca: grupo.querySelector(".campo-marca input").value.trim(),
            ano: grupo.querySelector(".campo-ano input").value.trim()
        }));

        try {
            const resposta = await fetch("../php/salvar-veiculos.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_cliente: idClienteSelecionado,
                    veiculos
                })
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.sucesso) {
                throw new Error(dados.erro || "Não foi possível salvar os veículos.");
            }

            await carregarVeiculos();
            fecharModal(modalVeiculos);
        } catch (erro) {
            console.error("Erro ao salvar veículos:", erro);
            alert(erro.message || "Erro na comunicação com o servidor.");
        }
    });

    carregarVeiculos();
});