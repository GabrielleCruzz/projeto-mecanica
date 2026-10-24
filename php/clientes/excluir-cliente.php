
<?php

require_once __DIR__ . '/../conexao.php';

session_start();

$id_logado = $_SESSION["id_logado"];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id_cliente = filter_input(INPUT_POST, 'id_cliente', FILTER_VALIDATE_INT);

    if (!$id_cliente || $id_cliente <= 0) {
        http_response_code(400);
        echo 'ID do cliente inválido';
        exit;
    }

    mysqli_begin_transaction($conexao);

    try {
        $stmt_os = $conexao->prepare(
            "UPDATE ordemservico SET ID_cliente = NULL, ID_veiculo = NULL WHERE ID_cliente = ?"
        );
        $stmt_os->bind_param("i", $id_cliente);
        $stmt_os->execute();
        $stmt_os->close();

        $stmt_peca = $conexao->prepare(
            "DELETE FROM veiculo WHERE ID_cliente = ?"
        );
        $stmt_peca->bind_param("i", $id_cliente);
        $stmt_peca->execute();
        $stmt_peca->close();

        $stmt_os = $conexao->prepare(
            "DELETE FROM cliente WHERE ID_cliente = ?"
        );
        $stmt_os->bind_param("i", $id_cliente);
        $stmt_os->execute();

        if ($stmt_os->affected_rows > 0) {
            $stmt_os->close();
            mysqli_commit($conexao);
            echo 'Sucesso';
        } else {
            $stmt_os->close();
            throw new Exception('Cliente não encontrado');
        }

    } catch (Throwable $e) {
        mysqli_rollback($conexao);
        http_response_code(500);
        echo 'Erro ao excluir cliente';
    }
}
?>
