<?php

session_start();

// __DIR__ retorna o caminho da pasta onde este arquivo PHP está localizado
require_once __DIR__ . '/../conexao.php';

// ID do usuário que está logado
$id_logado = $_SESSION["id_logado"];

?>