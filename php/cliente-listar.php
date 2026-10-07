<?php

require_once 'conexao.php';

session_start();

// Exemplo da variável do usuário logado (pegue da sua sessão, ex: $_SESSION['id_usuario'])
$id_usuario_logado = $_SESSION["id_logado"];

// Query SQL com o filtro WHERE e o uso de ? (placeholder) para segurança
$sql = "SELECT cliente.*, COUNT(veiculo.ID_veiculo) AS quantidade_veiculo 
        FROM cliente 
        INNER JOIN veiculo ON cliente.ID_cliente = veiculo.ID_cliente 
        WHERE cliente.ID_usuario = ? 
        GROUP BY cliente.ID_cliente";

// Prepara a consulta
$stmt = $conexao->prepare($sql);

if ($stmt) {
    // Associa a variável ao placeholder (?) -> 'i' indica que é um número inteiro (integer)
    $stmt->bind_param("i", $id_usuario_logado);
    
    // Executa a consulta
    $stmt->execute();
    
    // Pega o resultado
    $result = $stmt->get_result();

    $clientes = [];

    if ($result->num_rows > 0) {
        while ($dados = $result->fetch_assoc()) {
            $clientes[] = [
                "nome" => $dados["Nome"],
                "telefone" => $dados["Telefone"],
                "quantidade_veiculo" => $dados["quantidade_veiculo"]
            ];
        }
    }

    // Fecha o statement
    $stmt->close();

    // Retorna o JSON
        header('Content-Type: application/json');
        echo json_encode($clientes);
    } else {
        // Caso ocorra algum erro na preparação da query
        echo json_encode(["erro" => "Falha ao preparar a consulta: " . $conexao->error]);
    }

?>