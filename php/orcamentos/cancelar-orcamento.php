<?php

require_once __DIR__ . '/../conexao.php';

session_start();

$id_logado = $_SESSION["id_logado"];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_os = filter_input(INPUT_POST, 'id_os', FILTER_VALIDATE_INT);

    if (!$id_os || $id_os <= 0) {
        http_response_code(400);
        echo 'ID da ordem de serviço inválido';
        exit;
    }

    mysqli_begin_transaction($conexao);

    try {        
        $stmt_peca = $conexao->prepare(
            "DELETE FROM os_peca WHERE ID_OrdemServico = ?"
        );
        $stmt_peca->bind_param("i", $id_os);
        $stmt_peca->execute();
        $stmt_peca->close();
        
        $stmt_servico = $conexao->prepare(
            "DELETE FROM os_servico WHERE ID_OrdemServico = ?"
        );
        $stmt_servico->bind_param("i", $id_os);
        $stmt_servico->execute();
        $stmt_servico->close();
        
        $stmt_os = $conexao->prepare(
            "DELETE FROM ordemservico WHERE ID_OrdemServico = ?"
        );
        $stmt_os->bind_param("i", $id_os);
        $stmt_os->execute();

        if ($stmt_os->affected_rows > 0) {
            $stmt_os->close();
            mysqli_commit($conexao);
            echo 'Sucesso';
        } else {
            $stmt_os->close();
            throw new Exception('Ordem de serviço não encontrada');
        }

    } catch (Throwable $e) {
        mysqli_rollback($conexao);
        http_response_code(500);
        echo 'Erro ao excluir a ordem de serviço';
    }
}
?>