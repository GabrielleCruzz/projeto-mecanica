<?php

require_once __DIR__ . '/../conexao.php';

session_start();

$id_logado = $_SESSION["id_logado"];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_os = trim($_POST['id_os']);
    $status = $_POST['status'];

    $stmt_cli = $conexao->prepare("UPDATE ordemservico SET status_os = (?) WHERE ID_OrdemServico = (?)");

    $stmt_cli->bind_param("ss", $status, $id_os);

    if ($stmt_cli->execute()) {
        echo 'Sucesso';
    } else {
        echo ("Erro ao alterar status da OS: " . $stmt_cli->error);
    }
    
    $stmt_cli->close();
}
?>