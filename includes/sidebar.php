<!-- Sidebar -->
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="d-flex align-items-center gap-2 text-primary fw-bold fs-4">
            <img id="sidebarLogo" src="imgs/WB-LOGO-WORDMARK@300x-1.webp" alt="Weboost" height="40">
        </div>
    </div>

    <div class="p-3">
        <select id="clientSelector" class="form-select">
            <option value="admin">Administração</option>
            <option value="cliente_a">Cliente A</option>
            <option value="cliente_b">Cliente B</option>
            <option value="cliente_c">Cliente C</option>
        </select>
    </div>

    <div class="sidebar-menu">
        <a href="#" class="menu-item active">
            <span class="material-symbols-rounded">home</span>
            <span>Dashboard</span>
        </a>
        <a href="#" class="menu-item">
            <span class="material-symbols-rounded">group</span>
            <span>CDP</span>
        </a>
        <a href="#" class="menu-item">
            <span class="material-symbols-rounded">analytics</span>
            <span>Analytics</span>
        </a>
        <a href="#" class="menu-item">
            <span class="material-symbols-rounded">campaign</span>
            <span>Campaigns</span>
        </a>
        <a href="#" class="menu-item">
            <span class="material-symbols-rounded">settings</span>
            <span>Settings</span>
        </a>
    </div>

    <div class="p-3 border-top border-secondary-subtle">
        <a href="#" onclick="logout()" class="menu-item text-danger">
            <span class="material-symbols-rounded">logout</span>
            <span>Logout</span>
        </a>
    </div>
</aside>
