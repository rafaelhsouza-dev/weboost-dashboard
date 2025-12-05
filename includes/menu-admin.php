<?php
// Garantir que $currentView esteja definido (vindo de includes/config.php)
if (!isset($currentView)) { $currentView = 'admin'; }
?>
<a href="index.php?view=admin" class="menu-item <?php echo ($currentView === 'admin') ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">shield_person</span>
    <span>Usuários</span>
    </a>
<a href="index.php?view=create-customer" class="menu-item <?php echo ($currentView === 'create-customer') ? 'active' : ''; ?>">
    <span class="material-symbols-rounded">person_add</span>
    <span>Novo Cliente</span>
    </a>
<a href="#" class="menu-item">
    <span class="material-symbols-rounded">settings</span>
    <span>Configurações</span>
    </a>
