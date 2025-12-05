<!-- views/cliente.php -->
<!-- Este é o Dashboard de um cliente específico. -->
<div class="container-fluid p-0" id="viewContent">

    <!-- Stats Cards -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="cicle-wb bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                        <span class="material-symbols-rounded">show_chart</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Cliques na Campanha</h6>
                        <h4 class="mb-0">1,890</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="cicle-wb bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                        <span class="material-symbols-rounded">group</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Novos Leads</h6>
                        <h4 class="mb-0">215</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="cicle-wb bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                        <span class="material-symbols-rounded">conversion_path</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Taxa de Conversão</h6>
                        <h4 class="mb-0">11.38%</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="cicle-wb bg-info bg-opacity-10 p-3 rounded-circle me-3 text-info">
                        <span class="material-symbols-rounded">monitoring</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Posição Média (SEO)</h6>
                        <h4 class="mb-0">#3</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="row mb-4">
        <div class="col-12">
            <div class="card h-100">
                <div class="card-header">
                    <h5 class="mb-0">Analytics da Campanha do Cliente</h5>
                </div>
                <div class="card-body">
                    <p class="text-muted">Gráficos e dados específicos para este cliente seriam carregados aqui.</p>
                    <div id="salesChart" style="min-height: 350px;"></div>
                </div>
            </div>
        </div>
    </div>

</div>