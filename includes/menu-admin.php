<?php
// Garantir que $menuContext esteja definido (vindo de includes/config.php)
if (!isset($menuContext)) { $menuContext = 'admin'; }
?>
<a href="index.php?view=list-users" class="menu-item <?php echo ($menuContext === 'admin' && !in_array($currentView, ['list-customers', 'crud-customer'])) ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">shield_person</span>
    <span>Usuários</span>
</a>
<a href="index.php?view=list-customers" class="menu-item <?php echo (in_array($currentView, ['list-customers', 'crud-customer'])) ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">person</span>
    <span>Clientes</span>
</a>
<a href="index.php?view=settings-admin" class="menu-item <?php echo ($currentView === 'settings-admin') ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">settings</span>
    <span>Configurações</span>
</a>
