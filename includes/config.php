<?php
// --- Configurações de Segurança e Ambiente ---
define('PDF_ACCESS_TOKEN', 'weboost-secret-token-for-pdf-generation-12345');

// Flag para verificar se a visualização é para PDF
$is_pdf_view = isset($_GET['pdf']) && $_GET['pdf'] == '1';

// Flag para verificar se a requisição é autenticada para gerar PDF (via token)
$is_authenticated_for_pdf = $is_pdf_view && isset($_GET['token']) && $_GET['token'] === PDF_ACCESS_TOKEN;

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
];
?>