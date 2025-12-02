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

    <div class="p-3 border-top border-secondary-subtle">
        <a href="#" onclick="logout()" class="menu-item text-danger">
            <span class="material-symbols-rounded">logout</span>
            <span>Logout</span>
        </a>
    </div>
</aside>
