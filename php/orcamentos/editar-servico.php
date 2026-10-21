<?php

header("Content-Type: application/json; charset=UTF-8");

session_start();

if (empty($_SESSION["id_logado"])) {
    http_response_code(401);
    echo json_encode(["erro" => "Usuário não autenticado"]);
    exit;
}

require_once __DIR__ . '/../conexao.php';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$id_usuario = (int) $_SESSION["id_logado"];

$dados = json_decode(file_get_contents("php://input"));

if (!is_object($dados)) {
    http_response_code(400);
    echo json_encode(["erro" => "Dados inválidos"]);
    exit;
}

$id_os = filter_var($dados->id_os ?? $dados->id_os ?? null, FILTER_VALIDATE_INT);
$diagnostico = trim($dados->diagnostico ?? "");
$pecas = $dados->pecas ?? [];
$servicos = $dados->servicos ?? [];

if (!$id_os || $id_os <= 0) {
    http_response_code(400);
    echo json_encode(["erro" => "ID da Ordem de Serviço inválido"]);
    exit;
}

if (!is_array($pecas) || !is_array($servicos)) {
    http_response_code(400);
    echo json_encode(["erro" => "Peças ou serviços inválidos"]);
    exit;
}

if ($diagnostico === "") {
    http_response_code(400);
    echo json_encode(["erro" => "Preencha o diagnóstico do veículo"]);
    exit;
}

if (count($servicos) === 0) {
    http_response_code(400);
    echo json_encode(["erro" => "Adicione pelo menos um serviço"]);
    exit;
}

try {
    mysqli_begin_transaction($conexao);

    // Confirma se a OS existe e pertence ao usuário logado
    $sql = "SELECT ID_OrdemServico FROM ordemservico WHERE ID_OrdemServico = ? AND ID_usuario = ?";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $id_os, $id_usuario);
    mysqli_stmt_execute($stmt);
    $os_existe = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
    mysqli_stmt_close($stmt);

    if (!$os_existe) {
        http_response_code(403);
        echo json_encode(["erro" => "Ordem de serviço não encontrada ou não autorizada"]);
        exit;
    }

    // Atualiza diagnóstico
    $sql = "UPDATE ordemservico SET Diagnostico = ? WHERE ID_OrdemServico = ?";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "si", $diagnostico, $id_os);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Remove peças e serviços antigos
    $sql = "DELETE FROM os_peca WHERE ID_OrdemServico = ?";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id_os);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    $sql = "DELETE FROM os_servico WHERE ID_OrdemServico = ?";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id_os);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    // Cadastra as novas peças
    foreach ($pecas as $peca) {
        $nome = trim($peca->Nome ?? "");
        $valor = filter_var($peca->valor_unit ?? null, FILTER_VALIDATE_FLOAT);
        $quantidade = filter_var($peca->Quantidade ?? null, FILTER_VALIDATE_INT);

        if ($nome === "" || mb_strlen($nome, "UTF-8") > 40 ||
            $valor === false || $valor <= 0 ||
            !$quantidade || $quantidade <= 0 || $quantidade > 99) {
            throw new Exception("Verifique o nome, valor e quantidade das peças.");
        }

        $sql = "INSERT INTO peca (Nome, valor_unit) VALUES (?, ?)";
        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, "sd", $nome, $valor);
        mysqli_stmt_execute($stmt);

        $id_peca = mysqli_insert_id($conexao);
        mysqli_stmt_close($stmt);
        
        $sql = "INSERT INTO os_peca (ID_peca, ID_OrdemServico, Quantidade) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, "iis", $id_peca, $id_os, $quantidade);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    // Cadastra os novos serviços
    foreach ($servicos as $servico) {
        $nome = trim($servico->tipoServico ?? "");
        $valor = filter_var($servico->Valor_unit ?? null, FILTER_VALIDATE_FLOAT);

        if ($nome === "" || mb_strlen($nome, "UTF-8") > 20 ||
            $valor === false || $valor <= 0) {
            throw new Exception("Verifique o nome e o valor dos serviços.");
        }

        $sql = "INSERT INTO tiposervico (tipoServico) VALUES (?)";
        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, "s", $nome);
        mysqli_stmt_execute($stmt);

        $id_servico = mysqli_insert_id($conexao);
        mysqli_stmt_close($stmt);

        $sql = "INSERT INTO os_servico (ID_tipoServico, ID_OrdemServico, Valor_unit) VALUES (?, ?, ?)";
        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, "iid", $id_servico, $id_os, $valor);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    mysqli_commit($conexao);

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Ordem de serviço atualizada com sucesso!",
        "id_ordem_servico" => $id_os
    ]);

} catch (Throwable $erro) {
    mysqli_rollback($conexao);
    error_log("Erro ao atualizar orçamento: " . $erro->getMessage());

    http_response_code(500);
    echo json_encode([
        "erro" => "Não foi possível atualizar o orçamento."
    ]);
}

?>