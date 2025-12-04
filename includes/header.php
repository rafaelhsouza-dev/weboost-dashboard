<?php
// As variáveis de configuração ($currentView, $clientNames, etc.) agora vêm de includes/config.php

// Define o título baseado no view atual
$headerTitle = ($clientNames[$currentView] ?? 'Visão Geral');
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

        <div class="theme-toggle" id="themeToggle">
            <span class="material-symbols-rounded">dark_mode</span>
        </div>


    </div>
</header>