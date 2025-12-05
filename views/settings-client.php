<!-- views/settings-client.php -->
<div class="container-fluid p-0" id="viewContent">

    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12">
            <h3 class="mb-0">Configurações do Cliente</h3>
        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Configurações deste Cliente</h5>
        </div>
        <div class="card-body">
            <p class="text-muted">As configurações específicas para este cliente estarão aqui (ex: metas, relatórios).</p>
            <p>Por enquanto, a única configuração disponível é a de Aparência, que é global.</p>
            <hr>
            <h5 class="card-title mt-4">Aparência</h5>
            <p>Escolha entre o modo claro e escuro.</p>
            <div class="d-flex align-items-center">
                <span class="text-muted me-2">Modo Claro</span>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="themeSwitch">
                    <label class="form-check-label" for="themeSwitch"></label>
                </div>
                <span class="text-muted ms-2">Modo Escuro</span>
            </div>
        </div>
    </div>
</div>

<script>
// A lógica do tema é controlada globalmente pelo main.js e header.php
// Este switch é apenas uma interface visual.
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('themeSwitch');
    const mainToggle = document.getElementById('themeToggle'); // O toggle no header

    // Seta o estado inicial do switch
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
     if(themeSwitch) {
      themeSwitch.checked = currentTheme === 'dark';
    }

    // Adiciona evento para mudar o tema
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            // Simula um clique no toggle principal para manter tudo sincronizado
            if(mainToggle) {
                mainToggle.click();
            }
        });
    }
});
</script>
