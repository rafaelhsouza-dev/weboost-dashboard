<?php
// As variáveis de configuração ($currentView, $menuContext, $clientNames, $viewTitles) vêm de includes/config.php
// Define defaults para evitar avisos caso este arquivo seja usado fora do index.php
if (!isset($currentView)) { $currentView = 'geral'; }
if (!isset($menuContext)) { $menuContext = $currentView; }
if (!isset($clientNames) || !is_array($clientNames)) {
    $clientNames = [
        'geral' => 'Geral',
        'admin' => 'Administração',
        'cliente_a' => 'Cliente A',
        'cliente_b' => 'Cliente B',
        'cliente_c' => 'Cliente C',
    ];
}
if (!isset($viewTitles) || !is_array($viewTitles)) { $viewTitles = []; }

// Define o título baseado no view atual, com fallback para o contexto do menu
$headerTitle = $viewTitles[$currentView] ?? ($clientNames[$menuContext] ?? 'Visão Geral');
?>
<!-- Top Header -->
<header class="top-header">
    <div class="d-flex align-items-center">
        <button id="sidebarToggle" class="btn btn-link text-body p-0 me-3">
            <span class="material-symbols-rounded">menu</span>
        </button>
        <h5 class="m-0"><?php echo $headerTitle; ?></h5>
    </div>

    <div class="d-flex align-items-center gap-3">
        <!-- Date Range Filters -->
        <div class="d-flex align-items-center gap-2">
            <!-- Start Date -->
            <div class="form-group">
                <label for="startDate" class="form-label visually-hidden">Data Início</label>
                <input type="datetime-local" class="form-control form-control-sm" id="startDate" name="startDate">
            </div>
            <!-- End Date -->
            <div class="form-group">
                <label for="endDate" class="form-label visually-hidden">Data Fim</label>
                <input type="datetime-local" class="form-control form-control-sm" id="endDate" name="endDate">
            </div>

            <!-- Presets Dropdown -->
            <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" id="datePresetPicker" data-bs-toggle="dropdown" aria-expanded="false">
                    Predefinições
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="datePresetPicker">
                    <li><a class="dropdown-item" href="#" data-period="today">Hoje</a></li>
                    <li><a class="dropdown-item" href="#" data-period="7d">Últimos 7 dias</a></li>
                    <li><a class="dropdown-item" href="#" data-period="15d">Últimos 15 dias</a></li>
                    <li><a class="dropdown-item" href="#" data-period="30d">Últimos 30 dias</a></li>
                </ul>
            </div>

            <button class="btn btn-primary btn-sm" id="applyDateRange">Aplicar</button>
        </div>

        <a href="#" id="exportPdfBtn" class="text-body p-2" title="Exportar para PDF">
            <span class="material-symbols-rounded">picture_as_pdf</span>
        </a>
        <div class="theme-toggle" id="themeToggle">
            <span class="material-symbols-rounded">dark_mode</span>
        </div>


    </div>
</header>