
<?php

require_once __DIR__ . '/../conexao.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION["id_logado"])) {
    http_response_code(401);
    echo json_encode(["erro" => "Usuário não autenticado"]);
    exit;
}

$id_usuario_logado = (int) $_SESSION["id_logado"];

// Busca todas as ordens de serviço, clientes e veículos do usuário
$sql = "SELECT
            os.ID_OrdemServico,
            os.Diagnostico,
            os.status_os AS status,
            os.data_criacao,
            c.ID_cliente,
            c.Nome AS Nome_cliente,
            c.Telefone,
            c.Observacao AS observacao_cliente,
            v.ID_veiculo,
            v.Placa,
            v.Model_Marca,
            v.Ano
        FROM ordemservico os
        LEFT JOIN cliente c ON os.ID_cliente = c.ID_cliente
        LEFT JOIN veiculo v ON os.ID_veiculo = v.ID_veiculo
        WHERE os.ID_usuario = ?
        ORDER BY os.ID_OrdemServico DESC";

$stmt = $conexao->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha ao preparar consulta"]);
    exit;
}

$stmt->bind_param("i", $id_usuario_logado);
$stmt->execute();

$result = $stmt->get_result();

$ordens = [];

while ($dados = $result->fetch_assoc()) {

    $id_os = (int) $dados["ID_OrdemServico"];

    // Busca as peças da OS
    $sql_pecas = "SELECT p.ID_peca, p.Nome, op.Quantidade, p.valor_unit
                  FROM os_peca op
                  INNER JOIN peca p ON op.ID_peca = p.ID_peca
                  INNER JOIN ordemservico os ON os.ID_OrdemServico = op.ID_OrdemServico
                  WHERE op.ID_OrdemServico = ? AND os.ID_usuario = ?";

    $stmt_pecas = $conexao->prepare($sql_pecas);
    $stmt_pecas->bind_param("ii", $id_os, $id_usuario_logado);
    $stmt_pecas->execute();

    $result_pecas = $stmt_pecas->get_result();
    $pecas = [];
    $total_pecas = 0;

    while ($p = $result_pecas->fetch_assoc()) {

        $quantidade = (int) $p["Quantidade"];
        $valor_unitario = (float) $p["valor_unit"];

        $p["subtotal"] = $quantidade * $valor_unitario;

        $total_pecas += $p["subtotal"];

        $pecas[] = $p;
    }

    $stmt_pecas->close();

    // Busca os serviços da OS
    $sql_servicos = "SELECT ts.ID_tipoServico, ts.tipoServico, os_s.Valor_unit
                     FROM os_servico os_s
                     INNER JOIN tiposervico ts ON os_s.ID_tipoServico = ts.ID_tipoServico
                     INNER JOIN ordemservico os ON os.ID_OrdemServico = os_s.ID_OrdemServico
                     WHERE os_s.ID_OrdemServico = ? AND os.ID_usuario = ?";

    $stmt_servicos = $conexao->prepare($sql_servicos);
    $stmt_servicos->bind_param("ii", $id_os, $id_usuario_logado);
    $stmt_servicos->execute();

    $result_servicos = $stmt_servicos->get_result();
    $servicos = [];
    $total_servicos = 0;

    while ($s = $result_servicos->fetch_assoc()) {

        $valor_servico = (float) $s["Valor_unit"];

        $total_servicos += $valor_servico;

        $servicos[] = $s;
    }

    $stmt_servicos->close();

    // Calcula o valor total da OS
    $valor_total = $total_pecas + $total_servicos;

    // Monta o objeto final da OS
    $ordens[] = [
        "id" => $id_os,
        "diagnostico" => $dados["Diagnostico"],
        "status" => $dados["status"],
        "data_criacao" => $dados["data_criacao"],

        "cliente" => [
            "id" => $dados["ID_cliente"],
            "nome" => $dados["Nome_cliente"] ?? "(Excluído)",
            "telefone" => $dados["Telefone"] ?? "(Excluído)",
            "observacao" => $dados["observacao_cliente"] ?? "(Excluído)"
        ],

        "veiculo" => [
            "id" => $dados["ID_veiculo"],
            "placa" => $dados["Placa"] ?? "(Excluído)",
            "modelo_marca" => $dados["Model_Marca"] ?? "(Excluído)",
            "ano" => $dados["Ano"] ?? "(Excluído)",
        ],

        "pecas" => $pecas,
        "servicos" => $servicos,

        "total_pecas" => round($total_pecas, 2),
        "total_servicos" => round($total_servicos, 2),
        "valor_total" => round($valor_total, 2)
    ];
}

$stmt->close();

echo json_encode(
    $ordens,
    JSON_UNESCAPED_UNICODE
);

?>
