<?php
require_once 'conexao.php';

session_start();

$id = $_SESSION["id_cliente_selecionado"] ?? null;
$id_logado = $_SESSION["id_logado"] ?? null;

header('Content-Type: application/json; charset=utf-8');

if (!$id || !$id_logado) {
    echo json_encode(["erro" => "Nenhum cliente selecionado ou usuário não autenticado."]);
    exit;
}

// Busca os dados do cliente
$sql = "SELECT ID_cliente, Nome, Telefone
        FROM cliente
        WHERE ID_cliente = ? AND ID_usuario = ?";

$stmt = $conexao->prepare($sql);
$stmt->bind_param("ii", $id, $id_logado);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["erro" => "Cliente não encontrado."]);
    exit;
}

$dados = $result->fetch_assoc();

// Busca os veículos do cliente
$sqlVeiculos = "SELECT ID_veiculo, Model_Marca, Ano, Placa
                FROM veiculo
                WHERE ID_cliente = ?";

$stmtVeiculos = $conexao->prepare($sqlVeiculos);
$stmtVeiculos->bind_param("i", $id);
$stmtVeiculos->execute();

$resultadoVeiculos = $stmtVeiculos->get_result();

$veiculos = [];

while ($veiculo = $resultadoVeiculos->fetch_assoc()) {
    $veiculos[] = $veiculo;
}

// Retorna os dados do cliente e seus veículos
$cliente = [
    "nome" => $dados["Nome"],
    "telefone" => $dados["Telefone"],
    "id" => $dados["ID_cliente"],
    "veiculos" => $veiculos
];

echo json_encode($cliente);

$stmt->close();
$stmtVeiculos->close();
$conexao->close();
?>