<?php
// Garantir que $menuContext esteja definido (vindo de includes/config.php)
if (!isset($menuContext)) { $menuContext = 'admin'; }
?>
<a href="index.php?view=list-utilizadores" class="menu-item <?php echo ($menuContext === 'admin' && !in_array($currentView, ['list-customers', 'edit-customer', 'edit-user'])) ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">shield_person</span>
    <span>Utilizadores</span>
</a>
<a href="index.php?view=list-customers" class="menu-item <?php echo (in_array($currentView, ['list-customers', 'edit-customer'])) ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">person</span>
    <span>Clientes</span>
</a>
<a href="index.php?view=settings-admin" class="menu-item <?php echo ($currentView === 'settings-admin') ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">settings</span>
    <span>Configurações</span>
</a>
