<?php

    // PHP PRA PEGAR O ID DO CLIENTE E MANDAR PRA PAGINA DE DETALHES

    require_once 'conexao.php';

    session_start();

    $conteudo = file_get_contents("php://input");
    $dados = json_decode($conteudo, true);

    // Pega a variável enviada
    $id_cliente_selecionado = $dados['cliente_id'] ?? null;
    
    $_SESSION["id_cliente_selecionado"] = $id_cliente_selecionado;

    echo "O PHP recebeu: " . $id_cliente_selecionado;    

?>