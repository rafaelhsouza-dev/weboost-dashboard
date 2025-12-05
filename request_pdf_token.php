<?php
// request_pdf_token.php

// 1. Define o diretório de tokens e garante que ele exista
$tokenDir = __DIR__ . '/pdf_tokens/';
if (!is_dir($tokenDir)) {
    mkdir($tokenDir, 0755, true);
}

// 2. Gera um token criptograficamente seguro
$token = bin2hex(random_bytes(32));

// 3. Cria um arquivo temporário com o nome do token.
// O conteúdo pode ser o timestamp para validação de expiração futura.
$tokenFilePath = $tokenDir . $token;
file_put_contents($tokenFilePath, time());

// Limpa tokens com mais de 5 minutos (manutenção simples)
foreach (glob($tokenDir . '*') as $file) {
    if (filemtime($file) < time() - 300) {
        unlink($file);
    }
}

// 4. Define o cabeçalho da resposta para JSON
header('Content-Type: application/json');

// 5. Retorna o token para o cliente
echo json_encode(['token' => $token]);

exit;
