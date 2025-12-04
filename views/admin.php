<!-- Dashboard Content for Admin -->
<div class="container-fluid p-0">

    <!-- Admin Stats Cards -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="cicle-wb bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                        <span class="material-symbols-rounded">group</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Total de Clientes</h6>
                        <h4 class="mb-0">125</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                        <span class="material-symbols-rounded">person_add</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Novos Clientes (Mês)</h6>
                        <h4 class="mb-0">12</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                        <span class="material-symbols-rounded">paid</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Receita Global (Mês)</h6>
                        <h4 class="mb-0">R$ 45.231</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="bg-danger bg-opacity-10 p-3 rounded-circle me-3 text-danger">
                        <span class="material-symbols-rounded">support_agent</span>
                    </div>
                    <div>
                        <h6 class="text-muted mb-1">Tickets de Suporte</h6>
                        <h4 class="mb-0">8</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- User Management Table -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Gerenciamento de Usuários</h5>
                    <button class="btn btn-primary btn-sm">Adicionar Usuário</button>
                </div>
                <div class="card-body">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Email</th>
                                <th scope="col">Perfil</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Admin User</td>
                                <td>admin@dash.com</td>
                                <td>Administrador</td>
                                <td><a href="#">Editar</a></td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Rafael Souza</td>
                                <td>rafael.souza@cliente-a.com</td>
                                <td>Cliente A</td>
                                <td><a href="#">Editar</a></td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>John Doe</td>
                                <td>john.doe@cliente-b.com</td>
                                <td>Cliente B</td>
                                <td><a href="#">Editar</a></td>
                            </tr>
                             <tr>
                                <th scope="row">4</th>
                                <td>Jane Smith</td>
                                <td>jane.smith@cliente-c.com</td>
                                <td>Cliente C</td>
                                <td><a href="#">Editar</a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>