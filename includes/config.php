<?php
// Parâmetros da URL com valores padrão
$currentView = $_GET['view'] ?? 'geral';
$currentPeriod = $_GET['period'] ?? 'today';

// Mapeamento de nomes para o seletor de cliente
$clientNames = [
    'geral' => 'Geral',
    'admin' => 'Administração',
    'cliente_a' => 'Cliente A',
    'cliente_b' => 'Cliente B',
    'cliente_c' => 'Cliente C',
];

// Mapeamento de nomes para o seletor de data
$periodNames = [
    'today' => 'Hoje',
    '7d' => 'Últimos 7 dias',
    '15d' => 'Últimos 15 dias',
    '30d' => 'Últimos 30 dias',
    'bimester' => 'Bimestre',
    'trimester' => 'Trimestre',
    'semester' => 'Semestre',
    'year' => 'Ano',
];
?>