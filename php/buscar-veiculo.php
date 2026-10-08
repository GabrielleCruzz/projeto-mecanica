<?php

session_start();

require_once "conexao.php";

// ID do usuário que está logado
$id_logado = $_SESSION["id_logado"];

// ID do cliente selecionado
$id_cliente = filter_input(INPUT_GET, "id_cliente", FILTER_VALIDATE_INT);

// valida se o id do cliente foi enviado corretamente (↑ número inteiro válido)
if (!$id_cliente) {
    http_response_code(400);
    echo json_encode(["erro" => "Cliente inválido"]);
    exit;
}

// Busca os veículos do cliente selecionado, verificando se ele pertence ao usuário logado
$sql = "SELECT v.ID_veiculo, v.Model_Marca, v.Ano, v.Placa
        FROM veiculo v
        INNER JOIN cliente c ON c.ID_cliente = v.ID_cliente
        WHERE v.ID_cliente = ?
        AND c.ID_usuario = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("ii", $id_cliente, $id_logado);
$stmt->execute();
$resultado = $stmt->get_result();

// Armazena os veículos encontrados
$veiculos = [];

while ($veiculo = $resultado->fetch_assoc()) {
    $veiculos[] = $veiculo;
}

// Retorna os veículos em formato JSON
header("Content-Type: application/json; charset=utf-8");
echo json_encode($veiculos);

// Fecha a consulta
$stmt->close();

?>