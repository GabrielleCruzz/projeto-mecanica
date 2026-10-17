<?php
// Importando as configurações para poder usar o banco
require_once __DIR__ . '/../conexao.php';

session_start();
$id_logado = $_SESSION["id_logado"];

// Quando o servidor receber os dados do envio
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = trim($_POST['cliente_nome']);
    $telefone = $_POST['cliente_tel'];
    $veiculos = json_decode($_POST['veiculos'], true);
    $observacao = $_POST['cliente_obs'];

    // Caso os campos estejam vazios, ele dará erro
    if (empty($nome) || empty($telefone) || empty($veiculos)) {
        echo "Existem campos vazios!";
        exit;
    }

    foreach ($veiculos as $veiculo) {
        if (
            empty($veiculo['placa']) ||
            empty($veiculo['marca_modelo']) ||
            empty($veiculo['ano'])
        ) {
            echo "Existem campos vazios!";
            exit;
        }
    }

    // Quando der certo, ele faz a inserção dos dados
    $stmt_cli = $conexao->prepare(
        "INSERT INTO cliente (Nome, Telefone, ID_usuario, Observacao) VALUES (?, ?, ?, ?)"
    );

    // Define os tipos dos dados que serão enviados para o banco
    $stmt_cli->bind_param("ssss", $nome, $telefone, $id_logado, $observacao);

    // Mandando ele executar
    if ($stmt_cli->execute()) {

        // Pega o ID que o banco criou para o cliente
        $id_cliente = $conexao->insert_id;

        $stmt_veiculo = $conexao->prepare(
            "INSERT INTO veiculo (ID_cliente, Placa, Model_Marca, Ano) VALUES (?, ?, ?, ?)"
        );

        // Executa a parte do cadastro de cada veículo
        foreach ($veiculos as $veiculo) {
            $placa = $veiculo['placa'];
            $marca_modelo = $veiculo['marca_modelo'];
            $ano = $veiculo['ano'];

            $stmt_veiculo->bind_param(
                "issi",
                $id_cliente,
                $placa,
                $marca_modelo,
                $ano,
            );

            if (!$stmt_veiculo->execute()) {
                echo "Erro no cadastro do veículo: " . $stmt_veiculo->error;
                $stmt_veiculo->close();
                $stmt_cli->close();
                exit;
            }
        }

        echo 'Sucesso';
        $stmt_veiculo->close();

    } else {
        echo "Erro no cadastro do cliente: " . $stmt_cli->error;
    }

    $stmt_cli->close();
}
?>