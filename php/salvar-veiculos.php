<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (empty($_SESSION["id_logado"])) {
    http_response_code(401);
    echo json_encode(["erro" => "Usuário não autenticado"]);
    exit;
}

require_once "conexao.php";

$id_usuario_logado = $_SESSION["id_logado"];

// Recebe os dados enviados pelo JavaScript
$dados = json_decode(file_get_contents("php://input"));

if (
    !$dados ||
    !isset($dados->id_cliente, $dados->veiculos) ||
    !is_array($dados->veiculos)
) {
    http_response_code(400);
    echo json_encode(["erro" => "Dados inválidos"]);
    exit;
}

$id_cliente = filter_var($dados->id_cliente, FILTER_VALIDATE_INT);

if (!$id_cliente || $id_cliente <= 0) {
    http_response_code(400);
    echo json_encode(["erro" => "Cliente inválido"]);
    exit;
}

// Confirma que o cliente pertence ao usuário logado
$sql = "SELECT ID_cliente FROM cliente WHERE ID_cliente = ? AND ID_usuario = ?";

$stmt = mysqli_prepare($conexao, $sql);
mysqli_stmt_bind_param($stmt, "ii", $id_cliente, $id_usuario_logado);
mysqli_stmt_execute($stmt);

$resultado = mysqli_stmt_get_result($stmt);
$cliente = mysqli_fetch_assoc($resultado);

mysqli_stmt_close($stmt);

if (!$cliente) {
    http_response_code(403);
    echo json_encode(["erro" => "Cliente não autorizado"]);
    exit;
}

try {
    mysqli_begin_transaction($conexao);

    foreach ($dados->veiculos as $veiculo) {
        $placa = trim($veiculo->placa ?? "");
        $marca = trim($veiculo->marca ?? "");
        $ano = trim((string) ($veiculo->ano ?? ""));

        if ($placa === "" || $marca === "" || $ano === "" || !ctype_digit($ano)) {
            throw new Exception("Preencha corretamente os dados do veículo.");
        }

        $ano = (int) $ano;

        if (!empty($veiculo->id)) {
            // Atualiza um veículo existente
            $id_veiculo = filter_var($veiculo->id, FILTER_VALIDATE_INT);

            if (!$id_veiculo || $id_veiculo <= 0) {
                throw new Exception("Veículo inválido.");
            }

            $sql = "UPDATE veiculo SET Placa = ?, Model_Marca = ?, Ano = ? WHERE ID_veiculo = ? AND ID_cliente = ?";

            $stmt = mysqli_prepare($conexao, $sql);
            mysqli_stmt_bind_param($stmt, "ssiii", $placa, $marca, $ano, $id_veiculo, $id_cliente);
            mysqli_stmt_execute($stmt);

            mysqli_stmt_close($stmt);

            // Confirma que o veículo pertence ao cliente
            $sql = "SELECT ID_veiculo FROM veiculo WHERE ID_veiculo = ? AND ID_cliente = ?";

            $stmt = mysqli_prepare($conexao, $sql);
            mysqli_stmt_bind_param($stmt, "ii", $id_veiculo, $id_cliente);
            mysqli_stmt_execute($stmt);

            $resultado = mysqli_stmt_get_result($stmt);
            $existe = mysqli_fetch_assoc($resultado);

            mysqli_stmt_close($stmt);

            if (!$existe) {
                throw new Exception("Veículo não encontrado para este cliente.");
            }
        } else {
            // Cadastra um veículo novo
            $sql = "INSERT INTO veiculo (ID_cliente, Placa, Model_Marca, Ano) VALUES (?, ?, ?, ?)";

            $stmt = mysqli_prepare($conexao, $sql);
            mysqli_stmt_bind_param($stmt, "issi", $id_cliente, $placa, $marca, $ano);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
        }
    }

    mysqli_commit($conexao);

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Veículos salvos com sucesso"
    ]);

} catch (Throwable $erro) {
    mysqli_rollback($conexao);
    error_log($erro->getMessage());

    http_response_code(400);
    echo json_encode([
        "erro" => "Não foi possível salvar os veículos. Confira os dados e tente novamente."
    ]);
}