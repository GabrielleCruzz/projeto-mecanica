document.addEventListener("DOMContentLoaded", () => {
    const listaVeiculos = document.getElementById("listaVeiculosCliente");
    const modalVeiculos = document.getElementById("modalEditarVeiculos");

    if (!listaVeiculos || !modalVeiculos) return;

    const camposVeiculo = modalVeiculos.querySelector(".campos-veiculo");
    const formulario = modalVeiculos.querySelector(".form-cliente");

    let idClienteSelecionado;

    // Busca os dados do cliente e seus veículos
    async function carregarVeiculos() {
        try {
            const respostaCliente = await fetch("../php/cliente-detalhes.php");
            const cliente = await respostaCliente.json();

            if (!respostaCliente.ok || cliente.erro) {
                throw new Error(cliente.erro || "Erro ao buscar cliente.");
            }

            idClienteSelecionado = cliente.id;

            const respostaVeiculos = await fetch(
                `../php/buscar-veiculo.php?id_cliente=${encodeURIComponent(idClienteSelecionado)}`
            );

            const veiculos = await respostaVeiculos.json();

            if (!respostaVeiculos.ok || veiculos.erro) {
                throw new Error(veiculos.erro || "Erro ao buscar veículos.");
            }

            exibirCards(veiculos);
            criarCamposVeiculos(veiculos);

        } catch (erro) {
            console.error("Erro ao carregar dados:", erro);
        }
    }

    // Exibe os cards dos veículos
    function exibirCards(veiculos) {
        listaVeiculos.replaceChildren();

        if (veiculos.length === 0) {
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

    // Cria um grupo de campos para um veículo
    function criarCampoVeiculo(veiculo = null) {
        const grupo = document.createElement("div");
        grupo.className = "infos-veiculo";

        if (veiculo) {
            grupo.dataset.idVeiculo = veiculo.ID_veiculo;
        }

        const campos = [
            { classe: "campo-placa", texto: "Placa", valor: veiculo?.Placa ?? "" },
            { classe: "campo-marca", texto: "Marca/Modelo", valor: veiculo?.Model_Marca ?? "" },
            { classe: "campo-ano", texto: "Ano", valor: veiculo?.Ano ?? "" }
        ];

        campos.forEach(campo => {
            const container = document.createElement("div");
            container.className = campo.classe;

            const label = document.createElement("label");
            label.textContent = campo.texto;

            const input = document.createElement("input");
            input.type = "text";
            input.value = campo.valor;
            input.required = true;

            container.append(label, input);
            grupo.appendChild(container);
        });

        camposVeiculo.appendChild(grupo);
    }

    // Preenche o modal com os veículos existentes
    function criarCamposVeiculos(veiculos) {
        camposVeiculo.replaceChildren();

        veiculos.forEach(veiculo => criarCampoVeiculo(veiculo));

        const btnAdicionar = document.createElement("button");
        btnAdicionar.type = "button";
        btnAdicionar.className = "btn-adicionar-veiculo";
        btnAdicionar.textContent = "Adicionar veículo";

        camposVeiculo.appendChild(btnAdicionar);
    }

    // Adiciona campos vazios ao clicar no botão
    camposVeiculo.addEventListener("click", event => {
    if (!event.target.closest(".btn-adicionar-veiculo")) return;
        const btnAdicionar = camposVeiculo.querySelector(".btn-adicionar-veiculo");

        criarCampoVeiculo();
        camposVeiculo.appendChild(btnAdicionar);
    });

    // Salva os veículos existentes e os novos
    formulario.addEventListener("submit", async event => {
        event.preventDefault();

        const grupos = camposVeiculo.querySelectorAll(".infos-veiculo");
        const veiculos = [];

        grupos.forEach(grupo => {
            veiculos.push({
                id: grupo.dataset.idVeiculo,
                placa: grupo.querySelector(".campo-placa input").value.trim(),
                marca: grupo.querySelector(".campo-marca input").value.trim(),
                ano: grupo.querySelector(".campo-ano input").value.trim()
            });
        });

        try {
            const resposta = await fetch("../php/salvar-veiculos.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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