<?php
// request_pdf_token.php

// Inicia a sessão para poder armazenar o token
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 1. Gera um token criptograficamente seguro
$token = bin2hex(random_bytes(32));

// 2. Armazena o token na sessão para validação posterior
// Em um sistema real, você poderia associar este token a um ID de usuário ou URL específica
// e definir um tempo de expiração.
$_SESSION['pdf_access_token'] = $token;

// 3. Define o cabeçalho da resposta para JSON
header('Content-Type: application/json');

// 4. Retorna o token para o cliente
echo json_encode(['token' => $token]);

exit;
