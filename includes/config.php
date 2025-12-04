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
?>