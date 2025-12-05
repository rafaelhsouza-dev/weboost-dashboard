<?php
// Inicia a sessão para armazenar tokens de PDF
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Flag para verificar se a visualização é para PDF
$is_pdf_view = isset($_GET['pdf']) && $_GET['pdf'] == '1';

// Flag para verificar se a requisição é autenticada para gerar PDF (via token de arquivo de uso único)
$is_authenticated_for_pdf = false;
if ($is_pdf_view && isset($_GET['token'])) {
    $tokenDir = __DIR__ . '/../pdf_tokens/';
    $tokenFile = $tokenDir . basename($_GET['token']); // basename() para segurança

    // Verifica se o arquivo de token existe
    if (file_exists($tokenFile)) {
        // (Opcional) Verifica se o token não expirou (ex: 5 minutos)
        if (filemtime($tokenFile) >= time() - 300) {
            $is_authenticated_for_pdf = true;
        }
        
        // Deleta o arquivo para que o token não possa ser reutilizado
        unlink($tokenFile);
    }
}

// Parâmetros da URL com valores padrão
$currentView = $_GET['view'] ?? 'geral';
// Define o fuso horário para evitar problemas com as funções de data
date_default_timezone_set('America/Sao_Paulo');

// Lida com o intervalo de datas
// Sanitiza para garantir que são strings seguras
$startDate = isset($_GET['startDate']) ? htmlspecialchars($_GET['startDate']) : date('Y-m-d\T00:00');
$endDate = isset($_GET['endDate']) ? htmlspecialchars($_GET['endDate']) : date('Y-m-d\TH:i');

// Mapeamento de nomes para o seletor de cliente
$clientNames = [
    'geral' => 'Geral',
    'admin' => 'Administração',
    'cliente_a' => 'Cliente A',
    'cliente_b' => 'Cliente B',
    'cliente_c' => 'Cliente C',
];

// Define o contexto do menu para subviews que pertencem a uma seção específica
// Assim, quando estivermos em "create-customer", continuamos com o menu de "admin" ativo
$viewContextMap = [
    'crud-customer' => 'admin',
    'list-customers' => 'admin',
    'view-customer' => 'admin',
    'list-users' => 'admin',
    'crud-user' => 'admin',
    'settings-admin' => 'admin',
    'settings-geral' => 'geral',
    'settings-client' => 'cliente', // Associa a um contexto de cliente genérico
];

// Contexto efetivo para menu/seleção de cliente e título
$menuContext = $viewContextMap[$currentView] ?? $currentView;

// Títulos específicos por subview (opcional)
$viewTitles = [
    'crud-customer' => 'Administração / Manutenção de Cliente',
    'list-customers' => 'Administração / Clientes',
    'view-customer' => 'Administração / Visualizar Cliente',
    'list-users' => 'Administração / Usuários',
    'crud-user' => 'Administração / Manutenção de Usuário',
    'settings-admin' => 'Configurações de Administração',
    'settings-geral' => 'Configurações Gerais',
    'settings-client' => 'Configurações do Cliente',
];
?>