<?php

header("Content-Type: application/json; charset=UTF-8");
session_start();

if (empty($_SESSION["id_logado"])) {
    http_response_code(401);
    echo json_encode(["erro" => "Usuário não autenticado"]);
    exit;
}

require_once "conexao.php";

$dados = json_decode(file_get_contents("php://input"));

$id_cliente = filter_var($dados->id_cliente ?? null, FILTER_VALIDATE_INT);
$id_veiculo = filter_var($dados->id_veiculo ?? null, FILTER_VALIDATE_INT);

if (!$id_cliente || !$id_veiculo) {
    http_response_code(400);
    echo json_encode(["erro" => "Dados inválidos"]);
    exit;
}

$sql = "DELETE veiculo FROM veiculo
        INNER JOIN cliente ON cliente.ID_cliente = veiculo.ID_cliente
        WHERE veiculo.ID_veiculo = ?
          AND veiculo.ID_cliente = ?
          AND cliente.ID_usuario = ?";

$stmt = mysqli_prepare($conexao, $sql);
mysqli_stmt_bind_param(
    $stmt,
    "iii",
    $id_veiculo,
    $id_cliente,
    $_SESSION["id_logado"]
);

mysqli_stmt_execute($stmt);
$excluido = mysqli_stmt_affected_rows($stmt);
mysqli_stmt_close($stmt);

if ($excluido !== 1) {
    http_response_code(404);
    echo json_encode(["erro" => "Veículo não encontrado ou não autorizado"]);
    exit;
}

echo json_encode(["sucesso" => true]);