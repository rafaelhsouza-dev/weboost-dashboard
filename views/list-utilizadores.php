<!-- views/list-users.php -->
<?php
// Dados Mockados para Usuários
$users = [
    ['id' => 1, 'name' => 'Rafael Souza', 'email' => 'rafael.souza@weboost.pt', 'role' => 'Admin', 'status' => 'Ativo'],
    ['id' => 2, 'name' => 'Carla Mendes', 'email' => 'carla.mendes@weboost.pt', 'role' => 'Gestor de Projetos', 'status' => 'Ativo'],
    ['id' => 3, 'name' => 'Pedro Alves', 'email' => 'pedro.alves@weboost.pt', 'role' => 'Analista de SEO', 'status' => 'Inativo'],
];
?>

<div class="container-fluid p-0" id="viewContent">

    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <h3 class="mb-0">Utilizadores</h3>
            <a href="index.php?view=edit-user" class="btn btn-primary">
                <span class="material-symbols-rounded align-middle me-1">add</span>
                Novo Utilizador
            </a>
        </div>
    </div>

    <!-- User List Card -->
    <div class="card">
        <div class="card-header">
            <div class="input-group" style="max-width: 400px;">
                <span class="input-group-text"><span class="material-symbols-rounded">search</span></span>
                <input type="text" class="form-control" placeholder="Buscar por nome ou email...">
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">Cargo</th>
                            <th scope="col">Status</th>
                            <th scope="col" class="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): 
                            $status_class = '';
                            switch ($user['status']) {
                                case 'Ativo': $status_class = 'text-success'; break;
                                case 'Inativo': $status_class = 'text-danger'; break;
                            }
                        ?>
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-placeholder bg-success rounded-circle me-3" style="width: 40px; height: 40px; text-align:center; line-height:40px; color:white;">
                                        <?php echo strtoupper(substr($user['name'], 0, 1)); ?>
                                    </div>
                                    <span class="fw-bold"><?php echo htmlspecialchars($user['name']); ?></span>
                                </div>
                            </td>
                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                            <td><?php echo htmlspecialchars($user['role']); ?></td>
                            <td><span class="fw-bold <?php echo $status_class; ?>"><?php echo htmlspecialchars($user['status']); ?></span></td>
                            <td class="text-end">
                                <a href="index.php?view=edit-user&id=<?php echo $user['id']; ?>" class="action-icon p-2" title="Editar"><span class="material-symbols-rounded">edit</span></a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer d-flex justify-content-center">
            <!-- Paginação pode ser adicionada aqui se necessário -->
        </div>
    </div>

</div>
