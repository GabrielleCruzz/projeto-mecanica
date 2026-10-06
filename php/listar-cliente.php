<?php

require_once 'conexao.php';

$sql = "SELECT cliente.*, COUNT(veiculo.ID_veiculo) AS quantidade_veiculo FROM cliente INNER JOIN veiculo ON cliente.ID_cliente = veiculo.ID_cliente GROUP BY cliente.ID_cliente ";

$result = $conexao->query($sql);

$clientes = [];

if ($result->num_rows > 0){
    while ($dados = $result->fetch_assoc()) {

        $clientes[] = [
            "nome" => $dados["Nome"],
            "telefone" => $dados["Telefone"],
            "quantidade_veiculo" => $dados["quantidade_veiculo"]
        ];
    }
}
        echo json_encode($clientes);
?>