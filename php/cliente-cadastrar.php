<?php
// Importando as configurações para poder usar o banco
require_once 'conexao.php';

session_start();
$id_logado = $_SESSION["id_logado"];

// Quando o servidor receber os dados do envio
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = trim($_POST['cliente_nome']);
    $telefone = $_POST['cliente_tel'];
    $placa = $_POST['veiculo_placa'];
    $marca_modelo = $_POST['veiculo_marca_modelo'];
    $ano = $_POST['veiculo_ano'];
    $observacao = $_POST['veiculo_obs'];

    // Caso os campos estejam vazios, ele dará erro
    if (
        empty($nome) ||
        empty($telefone) ||
        empty($placa) ||
        empty($marca_modelo) ||
        empty($ano)
    ) {
        echo ("Existem campos vazios!");
        exit;

        // Quando der certo, ele faz a inserção dos dados
    } else {
        $stmt_cli = $conexao->prepare("INSERT INTO cliente (Nome, Telefone, ID_usuario) VALUES (?, ?, ?)");

        // Define os tipos dos dados que serão enviados para o banco
        $stmt_cli->bind_param("sss", $nome, $telefone, $id_logado);

        // Mandando ele executar
        if ($stmt_cli->execute()) {

            // Pega o ID que o banco criou para o cliente
            $id_cliente = $conexao->insert_id;

            $stmt_veiculo = $conexao->prepare("INSERT INTO veiculo (ID_cliente, Placa, Model_Marca, Ano, Observacao) VALUES (?,?,?,?,?)");

            $stmt_veiculo->bind_param("issis", $id_cliente, $placa, $marca_modelo, $ano, $observacao);

            // Executa a parte do cadastro do veículo
            if ($stmt_veiculo->execute()) {
                echo 'Sucesso';
                $stmt_veiculo->close();
                exit;

            } else {
                echo ("Erro no cadastro do veículo: " . $stmt_veiculo->error);
            }
        } else {
            echo ("Erro no cadastro do cliente: " . $stmt_cli->error);
        }
    }
    $stmt_cli->close();
}
?>