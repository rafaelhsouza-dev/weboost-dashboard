<?php
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
    'create-customer' => 'admin',
];

// Contexto efetivo para menu/seleção de cliente e título
$menuContext = $viewContextMap[$currentView] ?? $currentView;

// Títulos específicos por subview (opcional)
$viewTitles = [
    'create-customer' => 'Administração / Novo Cliente',
];
?>