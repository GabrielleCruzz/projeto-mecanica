<?php
    // Configurações gerais do banco
    $servidor = "localhost:3306"; // mudar os numeros caso precise especificar a porta
    $usuario = "root";
    $senha = "";
    $banco = "bd_mecanica";

    // Fazendo a conexão com o banco de dados
    $conexao = mysqli_connect($servidor, $usuario, $senha, $banco);
?>