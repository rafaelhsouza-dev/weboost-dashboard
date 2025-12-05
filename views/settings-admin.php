<!-- views/settings.php -->
<div class="container-fluid p-0" id="viewContent">

    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <h3 class="mb-0">Configurações</h3>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs" id="settingsTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="appearance-tab" data-bs-toggle="tab" data-bs-target="#appearance" type="button" role="tab" aria-controls="appearance" aria-selected="true">Aparência</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Perfil</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="notifications-tab" data-bs-toggle="tab" data-bs-target="#notifications" type="button" role="tab" aria-controls="notifications" aria-selected="false">Notificações</button>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <div class="tab-content" id="settingsTabsContent">
                <!-- Painel de Aparência -->
                <div class="tab-pane fade show active" id="appearance" role="tabpanel" aria-labelledby="appearance-tab">
                    <h5 class="card-title">Tema do Dashboard</h5>
                    <p>Escolha entre o modo claro e escuro.</p>
                    <div class="d-flex align-items-center">
                        <span class="text-muted me-2">Modo Claro</span>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="themeSwitch" <?php echo (($_COOKIE['theme'] ?? 'light') === 'dark') ? 'checked' : ''; ?>>
                            <label class="form-check-label" for="themeSwitch"></label>
                        </div>
                        <span class="text-muted ms-2">Modo Escuro</span>
                    </div>
                    <hr>
                    <p class="text-muted mt-4">Mais opções de aparência estarão disponíveis aqui no futuro.</p>
                </div>

                <!-- Painel de Perfil -->
                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <h5 class="card-title">Informações do Perfil</h5>
                    <p class="text-muted">Esta seção permitirá editar as informações básicas do seu perfil, como nome e senha. (Funcionalidade em desenvolvimento)</p>
                     <form>
                        <div class="mb-3">
                            <label for="name" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="name" value="Rafael Souza (Mock)" disabled>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" value="rafael.souza@weboost.pt (Mock)" disabled>
                        </div>
                        <button type="submit" class="btn btn-primary" disabled>Salvar Alterações</button>
                    </form>
                </div>

                <!-- Painel de Notificações -->
                <div class="tab-pane fade" id="notifications" role="tabpanel" aria-labelledby="notifications-tab">
                     <h5 class="card-title">Preferências de Notificação</h5>
                    <p class="text-muted">Escolha como você deseja ser notificado. (Funcionalidade em desenvolvimento)</p>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="emailNotifications" checked disabled>
                        <label class="form-check-label" for="emailNotifications">
                            Receber notificações por email
                        </label>
                    </div>
                     <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="pushNotifications" disabled>
                        <label class="form-check-label" for="pushNotifications">
                            Receber notificações push no navegador
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
// Adiciona a lógica para o switch de tema nesta página
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            const isChecked = this.checked;
            const theme = isChecked ? 'dark' : 'light';
            document.body.setAttribute('data-theme', theme);
            // Salva a preferência no cookie ou localStorage, se necessário
            // Nota: O seletor de tema no header principal já faz isso.
            // Esta é uma implementação visual para a página de configurações.
            // Para sincronizar, precisaríamos de uma função global.
        });
    }
});
</script>
