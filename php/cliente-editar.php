<?php
// Importando as configurações para poder usar o banco
require_once 'conexao.php';

session_start();
$id_logado = $_SESSION["id_logado"];
$id = $_SESSION["id_cliente_selecionado"] ?? null;   

// Quando o servidor receber os dados do envio
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome = trim($_POST['editar-nome']);
    $telefone = $_POST['editar-tel'];

    // Caso os campos estejam vazios, ele dará erro
    if (
        empty($nome) ||
        empty($telefone)
    ) {
        echo ("Existem campos vazios!");
        exit;

        // Quando der certo, ele faz a inserção dos dados
    } else {
        $stmt_cli = $conexao->prepare("UPDATE cliente SET Nome = (?), Telefone = (?) WHERE ID_cliente = (?)");

        // Define os tipos dos dados que serão enviados para o banco
        $stmt_cli->bind_param("sss", $nome, $telefone, $id);

        // Mandando ele executar
        if ($stmt_cli->execute()) {
            echo 'Sucesso';
        } else {
            echo ("Erro ao alterar dados do cliente: " . $stmt_cli->error);
        }
    }
    $stmt_cli->close();
}
?>