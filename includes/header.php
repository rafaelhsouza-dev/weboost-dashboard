<?php
// O mesmo código da sidebar para garantir que as variáveis estejam disponíveis
$currentView = $_GET['view'] ?? 'admin';
$clientNames = [
    'admin' => 'Administração',
    'cliente_a' => 'Cliente A',
    'cliente_b' => 'Cliente B',
    'cliente_c' => 'Cliente C',
];

// Define o título baseado no view atual
$headerTitle = 'Dashboard | ' . ($clientNames[$currentView] ?? 'Visão Geral');
?>
<!-- Top Header -->
<header class="top-header">
    <div class="d-flex align-items-center">
        <button id="sidebarToggle" class="btn btn-link text-body p-0 me-3">
            <span class="material-symbols-rounded">menu</span>
        </button>
        <h4 class="m-0"><?php echo $headerTitle; ?></h4>
    </div>

    <div class="d-flex align-items-center gap-3">
        <div class="theme-toggle" id="themeToggle">
            <span class="material-symbols-rounded">dark_mode</span>
        </div>

        <div class="dropdown">
            <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle text-body"
                data-bs-toggle="dropdown">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=4361ee&color=fff" alt="User"
                    class="rounded-circle me-2" width="32" height="32">
                <span class="d-none d-md-block">Admin User</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                <li><a class="dropdown-item" href="#">Profile</a></li>
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Logout</a></li>
            </ul>
        </div>
    </div>
</header>