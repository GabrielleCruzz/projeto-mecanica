<?php

session_start();

require_once "conexao.php";

// ID do usuário que está logado
$id_logado = $_SESSION["id_logado"];

// Texto digitado no campo de busca
$busca = $_GET["busca"] ?? "";

// Prepara a busca
$busca = trim($busca);

// Consulta somente os clientes do usuário logado
$sql = "SELECT ID_cliente, Nome
        FROM cliente
        WHERE ID_usuario = ?
        AND Nome LIKE ?
        ORDER BY
            CASE
                WHEN Nome LIKE ? THEN 0
                ELSE 1
            END,
            Nome ASC";

$stmt = mysqli_prepare($conexao, $sql);

$buscaLike = "%" . $busca . "%";
$buscaInicio = $busca . "%";

mysqli_stmt_bind_param(
    $stmt,
    "iss",
    $id_logado,
    $buscaLike,
    $buscaInicio
);

mysqli_stmt_execute($stmt);

$resultado = mysqli_stmt_get_result($stmt);

$clientes = mysqli_fetch_all($resultado, MYSQLI_ASSOC); 
header("Content-Type: application/json; charset=utf-8"); 
echo json_encode($clientes, JSON_UNESCAPED_UNICODE);

?>