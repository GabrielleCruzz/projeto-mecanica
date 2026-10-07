<?php
    require_once 'conexao.php';

    session_start();

    // pega o id do cliente selecionado
    $id = $_SESSION["id_cliente_selecionado"] ?? null; 
    
    

    if (!$id) {
        header('Content-Type: application/json');
        echo json_encode(["erro" => "Nenhum cliente selecionado na sessão."]);
        exit;
    }

    $stmt = $conexao->prepare("SELECT * FROM cliente WHERE ID_cliente = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $dados = $result->fetch_assoc();

        $cliente = [
            "nome" => $dados["Nome"],
            "telefone" => $dados["Telefone"],                
            "id" => $dados["ID_cliente"]
        ];

        header('Content-Type: application/json');
        echo json_encode($cliente);
    } else {
        header('Content-Type: application/json');
        echo json_encode(["erro" => "Cliente não encontrado no banco."]);
    }
    exit;
?>
