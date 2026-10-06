<?php
    // Importando as configurações do banco
    require_once 'conexao.php';

    // Inicia a sessão para logar o usuário no navegador
    session_start();

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $emailCnpj = trim($_POST['login_email_cnpj']);
        $senha = $_POST['login_senha'];

        if (empty($emailCnpj) || empty($senha)) {
            echo "Preencha todos os campos!";
            exit;
        }

        // Busca o usuário pelo e-mail no banco de dados
        $stmt = $conexao->prepare("SELECT ID_Usuario, Nome, Senha FROM usuario WHERE Email = ? OR Cnpj = ?");
        $stmt->bind_param("ss", $emailCnpj, $emailCnpj);
        $stmt->execute();
        $resultado = $stmt->get_result();

        // Se encontrou o e-mail
        if ($resultado->num_rows === 1) {
            $usuario = $resultado->fetch_assoc();

            // Verifica se a senha está correta         
            if (password_verify($senha, $usuario['Senha'])) {
                
                // Salva os dados do usuário na sessão do navegador
                $_SESSION['usuario_id'] = $usuario['ID_Usuario'];
                $_SESSION['usuario_nome'] = $usuario['Nome'];

                echo "Sucesso";
            } else {
                echo "Senha incorreta!";
            }
        } else {
            echo "E-mail ou CNPJ não cadastrados!";
        }
        $stmt->close();
    }
?>
