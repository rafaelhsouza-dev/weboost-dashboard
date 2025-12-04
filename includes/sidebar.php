<?php
// As variáveis $currentView e $clientNames agora vêm de includes/config.php (incluído no index.php)
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
                <option value="<?php echo $value; ?>" <?php echo ($currentView === $value) ? 'selected' : ''; ?>>
                    <?php echo $name; ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="sidebar-menu">
        <?php
        if ($currentView === 'admin') {
            include 'menu-admin.php';
        } elseif ($currentView === 'geral') {
            include 'menu-geral.php';
        } else { // Qualquer outro valor (cliente_a, cliente_b, etc.) usa o menu de cliente
            include 'menu-client.php';
        }
        ?>
    </div>

    <div class="sidebar-footer p-3 border-top border-secondary-subtle">
        <div class="dropup">
            <a href="#" class="d-flex w-100 align-items-center text-decoration-none dropdown-toggle text-body"
               data-bs-toggle="dropdown">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=00ff85&color=fff" alt="User"
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
</aside>
