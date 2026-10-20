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

$id_cliente = filter_var($dados->cliente ?? null, FILTER_VALIDATE_INT);
$id_veiculo = filter_var($dados->veiculo ?? null, FILTER_VALIDATE_INT);
$diagnostico = trim($dados->diagnostico ?? "");
$pecas = $dados->pecas ?? [];
$servicos = $dados->servicos ?? [];

if (!$id_cliente || $id_cliente <= 0 || !$id_veiculo || $id_veiculo <= 0) {
    http_response_code(400);
    echo json_encode(["erro" => "Cliente e veículo inválidos"]);
    exit;
}
// Verifica se peças e serviços estão no formato de array
if (!is_array($pecas) || !is_array($servicos)) {
    http_response_code(400);
    echo json_encode(["erro" => "Peças ou serviços inválidos"]);
    exit;
}

// Verifica se o diagnóstico foi preenchido
if ($diagnostico === "") {
    http_response_code(400);
    echo json_encode(["erro" => "Preencha o diagnóstico do veículo"]);
    exit;
}

// Verifica se foi adicionado pelo menos um serviço
if (count($servicos) === 0) {
    http_response_code(400);
    echo json_encode(["erro" => "Adicione pelo menos um serviço"]);
    exit;
}

try {
    // Confirma se o cliente pertence ao usuário
    $sql = "SELECT ID_cliente FROM cliente WHERE ID_cliente = ? AND ID_usuario = ?";

    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $id_cliente, $id_usuario);
    mysqli_stmt_execute($stmt);
    $cliente = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
    mysqli_stmt_close($stmt);

    if (!$cliente) {
        http_response_code(403);
        echo json_encode(["erro" => "Cliente não autorizado"]);
        exit;
    }

    // Confirma se o veículo pertence ao cliente
    $sql = "SELECT ID_veiculo FROM veiculo WHERE ID_veiculo = ? AND ID_cliente = ?";

    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "ii", $id_veiculo, $id_cliente);
    mysqli_stmt_execute($stmt);
    $veiculo = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));
    mysqli_stmt_close($stmt);

    if (!$veiculo) {
        http_response_code(403);
        echo json_encode(["erro" => "Veículo não pertence a este cliente"]);
        exit;
    }

    mysqli_begin_transaction($conexao);

    // Cadastra a ordem de serviço
    $sql = "INSERT INTO ordemservico (ID_cliente, ID_veiculo, ID_usuario, Diagnostico, status_os) VALUES (?, ?, ?, ?, ?)";

    $status = "Pendente";
    $stmt = mysqli_prepare($conexao, $sql);
    mysqli_stmt_bind_param($stmt, "iiiss", $id_cliente, $id_veiculo, $id_usuario, $diagnostico, $status);
    mysqli_stmt_execute($stmt);

    $id_ordem = mysqli_insert_id($conexao);
    mysqli_stmt_close($stmt);

    // Cadastra as peças
    foreach ($pecas as $peca) {
        $nome = trim($peca->nome ?? "");
        $valor = filter_var($peca->valorUnitario ?? null, FILTER_VALIDATE_FLOAT);
        $quantidade = filter_var($peca->quantidade ?? null, FILTER_VALIDATE_INT);

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

        $sql = "INSERT INTO os_peca
                (ID_peca, ID_OrdemServico, Quantidade)
                VALUES (?, ?, ?)";

        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, "iis", $id_peca, $id_ordem, $quantidade);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    // Cadastra os serviços
    foreach ($servicos as $servico) {
        $nome = trim($servico->nome ?? "");
        $valor = filter_var($servico->valor ?? null, FILTER_VALIDATE_FLOAT);

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

        $sql = "INSERT INTO os_servico
                (ID_tipoServico, ID_OrdemServico, Valor_unit)
                VALUES (?, ?, ?)";

        $stmt = mysqli_prepare($conexao, $sql);
        mysqli_stmt_bind_param($stmt, "iid", $id_servico, $id_ordem, $valor);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    mysqli_commit($conexao);

    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Orçamento salvo com sucesso!",
        "id_ordem_servico" => $id_ordem
    ]);

} catch (Throwable $erro) {
    mysqli_rollback($conexao);
    error_log("Erro ao salvar orçamento: " . $erro->getMessage());

    http_response_code(500);
    echo json_encode([
        "erro" => "Não foi possível salvar o orçamento."
    ]);
}

?>