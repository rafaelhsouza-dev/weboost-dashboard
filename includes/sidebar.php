<?php
// As variáveis $currentView, $menuContext e $clientNames vêm de includes/config.php (incluído no index.php)
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
?>
<!-- Sidebar -->
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="d-flex align-items-center gap-2 text-primary fw-bold fs-4">
            <img id="sidebarLogo" src="imgs/WB-LOGO-WORDMARK@300x-1.webp" alt="Weboost" height="40">
        </div>
    </div>

    <div class="p-3">
        <select id="clientSelector" class="form-select">
            <?php foreach ($clientNames as $value => $name): ?>
                <option value="<?php echo $value; ?>" <?php echo ($menuContext === $value) ? 'selected' : ''; ?>>
                    <?php echo $name; ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="sidebar-menu">
        <?php
        // Usa o contexto de menu efetivo para manter a hierarquia ao entrar em subpáginas
        if ($menuContext === 'admin') {
            include 'menu-admin.php';
        } elseif ($menuContext === 'geral') {
            include 'menu-geral.php';
        } else { // Qualquer outro valor (cliente_a, cliente_b, etc.) usa o menu de cliente
            include 'menu-client.php';
        }
        ?>
    </div>

    <div class="sidebar-footer p-3 border-top border-secondary-subtle">

        <!-- Versão expandida: Visível por padrão -->
        <div class="sidebar-user-expanded">
            <div class="dropup">
                <a href="#" class="d-flex w-100 align-items-center text-decoration-none dropdown-toggle text-body"
                   data-bs-toggle="dropdown">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=00ff85&color=000" alt="User"
                         class="rounded-circle me-2" width="32" height="32">
                    <div class="sidebar-user-info">
                        <span class="d-block">Admin User</span>
                    </div>
                </a>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow" style="width: calc(100% - 1.5rem);">
                    <li><a class="dropdown-item" href="#">
                        <span class="material-symbols-rounded me-2">person</span>
                        Profile
                    </a></li>
                    <li><a class="dropdown-item" href="#">
                        <span class="material-symbols-rounded me-2">settings</span>
                        Settings
                    </a></li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="logout()">
                        <span class="material-symbols-rounded me-2">logout</span>
                        Logout
                    </a></li>
                </ul>
            </div>
        </div>

        <!-- Versão recolhida: Visível apenas quando a classe .collapsed estiver presente -->
        <div class="sidebar-user-collapsed">
            <!-- Este link agora expandirá a sidebar -->
            <a href="#" id="userAvatarCollapsed" class="d-block text-center text-decoration-none text-body">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=00ff85&color=fff" alt="User"
                     class="rounded-circle" width="32" height="32">
            </a>
             <!-- Link de logout rápido -->
             <a href="#" onclick="logout()" class="d-block text-center text-danger mt-3">
                <span class="material-symbols-rounded">logout</span>
            </a>
        </div>
    </div>
</aside>
