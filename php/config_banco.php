<?php
//Configurações gerais do banco
$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "mecanica";

//Fazendo a conexão com o banco de dados

$conexao = mysqli_connect($servidor, $usuario, $senha, $banco);
?>