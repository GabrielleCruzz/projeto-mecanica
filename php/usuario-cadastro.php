<?php
    // Importando as configurações para poder usar o banco
    require_once 'conexao.php';

    // Quando o servidor receber os dados do envio
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nome = trim($_POST['nome_oficina']);
        $email = $_POST['email_usuario'];
        $cnpj = $_POST['cnpj_usuario'];
        $senha = $_POST['senha_usuario'];
        $confirmaSenha = $_POST['confirma_senha'];

        // Caso os campos estejam vazios, ele dará erro
        if (
            empty($nome) ||
            empty($email) ||
            empty($cnpj) ||
            empty($senha) ||
            empty($confirmaSenha)
        ) {
            echo ("Erro: há campos vazios!");
            exit;
        } else {
            // verifica se e-mail ou cpnj já existe
            $stmt_jaExiste = $conexao->prepare("SELECT Email, Cnpj FROM usuario WHERE Email = ? OR Cnpj = ?");
            $stmt_jaExiste->bind_param("ss", $email, $cnpj);
            $stmt_jaExiste->execute();
            $resultadoExiste = $stmt_jaExiste->get_result();

            if ($resultadoExiste->num_rows > 0) {                
                echo ("Já existe Email ou CNPJ.");
                $stmt_jaExiste->close();
                exit;
            }

            $stmt_jaExiste->close();

            // verifica se as senhas correspondem
            if ($senha !== $confirmaSenha) {
                echo ("As senhas não correspondem.");
                exit;
            }
            
            // criptografa a senha
            $senhaCriptografada = password_hash($senha, PASSWORD_DEFAULT);            

            // prepara o comando
            $stmt_user = $conexao->prepare("INSERT INTO usuario (Nome, Email, Cnpj, Senha) VALUES (?, ?, ?, ?)");

            // Define os tipos dos dados que serão enviados para o banco
            $stmt_user->bind_param("ssss", $nome, $email, $cnpj, $senhaCriptografada);

            // Mandando ele executar
            if ($stmt_user->execute()) {
                echo ("Sucesso");
            } else {
                echo ("erro:" . $stmt_user->error);
            }
            $stmt_user->close();        
        }
    }
?>