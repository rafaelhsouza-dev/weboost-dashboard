<!-- views/list-customers.php -->

<div class="container-fluid p-0" id="viewContent">

    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
            <h3 class="mb-0">Clientes</h3>
            <a href="index.php?view=crud-customer" class="btn btn-primary">
                <span class="material-symbols-rounded align-middle me-1">add</span>
                Novo Cliente
            </a>
        </div>
    </div>

    <!-- Customer List Card -->
    <div class="card">
        <div class="card-header">
            <div class="row justify-content-between align-items-center">
                <div class="col-md-5 mb-3 mb-md-0">
                    <div class="input-group">
                        <span class="input-group-text"><span class="material-symbols-rounded">search</span></span>
                        <input type="text" class="form-control" placeholder="Buscar por nome, email ou empresa...">
                    </div>
                </div>
                <div class="col-md-4 text-md-end">
                    <!-- Placeholder para filtros futuros -->
                </div>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover table-striped mb-0">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Empresa</th>
                            <th scope="col">Email</th>
                            <th scope="col">Status</th>
                            <th scope="col" class="text-end">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Dados Mockados
                        $customers = [
                            ['id' => 1, 'name' => 'Ana Souza', 'company' => 'Souza & Filhos', 'email' => 'ana.souza@example.com', 'status' => 'Ativo'],
                            ['id' => 2, 'name' => 'Bruno Lima', 'company' => 'Lima Tech', 'email' => 'bruno.lima@example.com', 'status' => 'Ativo'],
                            ['id' => 3, 'name' => 'Carlos Pereira', 'company' => 'Pereira Construções', 'email' => 'carlos.p@example.com', 'status' => 'Inativo'],
                            ['id' => 4, 'name' => 'Daniela Costa', 'company' => 'Costa Advogados', 'email' => 'daniela.costa@example.com', 'status' => 'Ativo'],
                            ['id' => 5, 'name' => 'Eduardo Martins', 'company' => 'Martins Imóveis', 'email' => 'e.martins@example.com', 'status' => 'Pendente'],
                            ['id' => 6, 'name' => 'Fernanda Almeida', 'company' => 'Almeida & Cia', 'email' => 'fernanda.a@example.com', 'status' => 'Ativo'],
                        ];

                        foreach ($customers as $customer):
                            $status_class = '';
                            switch ($customer['status']) {
                                case 'Ativo':
                                    $status_class = 'text-success';
                                    break;
                                case 'Inativo':
                                    $status_class = 'text-danger';
                                    break;
                                case 'Pendente':
                                    $status_class = 'text-warning';
                                    break;
                            }
                        ?>
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-placeholder bg-secondary rounded-circle me-3" style="width: 40px; height: 40px; text-align:center; line-height:40px; color:white;">
                                        <?php echo strtoupper(substr($customer['name'], 0, 1)); ?>
                                    </div>
                                    <span class="fw-bold"><?php echo htmlspecialchars($customer['name']); ?></span>
                                </div>
                            </td>
                            <td><?php echo htmlspecialchars($customer['company']); ?></td>
                            <td><?php echo htmlspecialchars($customer['email']); ?></td>
                            <td><span class="fw-bold <?php echo $status_class; ?>"><?php echo htmlspecialchars($customer['status']); ?></span></td>
                            <td class="text-end">
                                <a href="index.php?view=view-customer&id=<?php echo $customer['id']; ?>" class="action-icon p-2" title="Visualizar"><span class="material-symbols-rounded">visibility</span></a>
                                <a href="index.php?view=crud-customer&id=<?php echo $customer['id']; ?>" class="action-icon p-2" title="Editar"><span class="material-symbols-rounded">edit</span></a>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
            <span class="text-muted">Mostrando 1 de 6 de 25 clientes</span>
            <nav>
                <ul class="pagination mb-0">
                    <li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>
                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item"><a class="page-link" href="#">Próximo</a></li>
                </ul>
            </nav>
        </div>
    </div>

</div>