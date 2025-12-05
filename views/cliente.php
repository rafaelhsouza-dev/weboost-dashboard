<?php
// --- Lógica de Visualização de Cliente ---

// 1. Dados Mockados (simulando uma base de dados)
$all_customers = [
    1 => ['id' => 1, 'name' => 'Ana Souza', 'company' => 'Souza & Filhos', 'email' => 'ana.souza@example.com', 'status' => 'Ativo', 'phone' => '912345678', 'nif' => '212345678', 'website' => 'https://souza.com', 'address' => 'Rua Principal, 123, Lisboa', 'sector' => 'Retalho', 'services' => ['SEO', 'Google Ads'], 'notes' => 'Cliente antigo, focar em relatórios mensais.'],
    2 => ['id' => 2, 'name' => 'Bruno Lima', 'company' => 'Lima Tech', 'email' => 'bruno.lima@example.com', 'status' => 'Ativo', 'phone' => '912345679', 'nif' => '212345679', 'website' => 'https://limatech.com', 'address' => 'Av. Central, 456, Porto', 'sector' => 'Tecnologia', 'services' => ['Gestão de Redes Sociais'], 'notes' => 'Aumentar engajamento no Instagram.'],
    3 => ['id' => 3, 'name' => 'Carlos Pereira', 'company' => 'Pereira Construções', 'email' => 'carlos.p@example.com', 'status' => 'Inativo', 'phone' => '912345680', 'nif' => '212345680', 'website' => '', 'address' => 'Praça da Cidade, 789, Braga', 'sector' => 'Imobiliário', 'services' => [], 'notes' => 'Contrato terminado em 10/2023.'],
    4 => ['id' => 4, 'name' => 'Daniela Costa', 'company' => 'Costa Advogados', 'email' => 'daniela.costa@example.com', 'status' => 'Ativo', 'phone' => '912345681', 'nif' => '212345681', 'website' => 'https://costaadv.com', 'address' => 'Rua Legal, 101, Coimbra', 'sector' => 'Serviços', 'services' => ['Criação de Conteúdo'], 'notes' => 'Foco em artigos para blog.'],
    5 => ['id' => 5, 'name' => 'Eduardo Martins', 'company' => 'Martins Imóveis', 'email' => 'e.martins@example.com', 'status' => 'Pendente', 'phone' => '912345682', 'nif' => '212345682', 'website' => '', 'address' => 'Alameda dos Jardins, 202, Faro', 'sector' => 'Imobiliário', 'services' => ['SEO'], 'notes' => 'Aguardando pagamento inicial para começar o projeto.'],
    6 => ['id' => 6, 'name' => 'Fernanda Almeida', 'company' => 'Almeida & Cia', 'email' => 'fernanda.a@example.com', 'status' => 'Ativo', 'phone' => '912345683', 'nif' => '212345683', 'website' => 'https://almeida.pt', 'address' => 'Rua do Comércio, 303, Aveiro', 'sector' => 'Retalho', 'services' => ['Design Gráfico', 'Google Ads'], 'notes' => 'Campanha de Natal pendente.'],
];

// 2. Obter o ID do cliente da 'view'
$customerId = null;
if (isset($currentView) && strpos($currentView, 'cliente_') === 0) {
    $customerId = (int)str_replace('cliente_', '', $currentView);
}

$customer = null;
if ($customerId && isset($all_customers[$customerId])) {
    $customer = $all_customers[$customerId];
}

?>

<div class="container-fluid p-0" id="viewContent">
    <?php if ($customer): ?>
        <!-- Page Header -->
        <div class="row mb-4">
            <div class="col-12 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <h3 class="mb-0 me-3"><?php echo htmlspecialchars($customer['company']); ?></h3>
                    <?php
                        $status_class = '';
                        $status_text = $customer['status'];
                        switch ($status_text) {
                            case 'Ativo': $status_class = 'bg-success'; break;
                            case 'Inativo': $status_class = 'bg-danger'; break;
                            case 'Pendente': $status_class = 'bg-warning text-dark'; break;
                            default: $status_class = 'bg-secondary'; break;
                        }
                    ?>
                    <span class="badge <?php echo $status_class; ?> fs-6"><?php echo $status_text; ?></span>
                </div>
                <a href="index.php?view=crud-customer&id=<?php echo $customer['id']; ?>" class="btn btn-primary">
                    <span class="material-symbols-rounded align-middle me-1">edit</span>
                    Editar Cliente
                </a>
            </div>
        </div>

        <!-- Customer Details -->
        <div class="row">
            <!-- Left Column -->
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-header"><h5>Serviços Contratados</h5></div>
                    <div class="card-body">
                        <?php if (!empty($customer['services'])): ?>
                            <ul class="list-group list-group-flush">
                            <?php foreach ($customer['services'] as $service): ?>
                                <li class="list-group-item"><?php echo htmlspecialchars($service); ?></li>
                            <?php endforeach; ?>
                            </ul>
                        <?php else: ?>
                            <p class="text-muted">Nenhum serviço contratado.</p>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header"><h5>Observações</h5></div>
                    <div class="card-body">
                        <p><?php echo !empty($customer['notes']) ? nl2br(htmlspecialchars($customer['notes'])) : '<span class="text-muted">Nenhuma observação.</span>'; ?></p>
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-header"><h5>Detalhes de Contato</h5></div>
                    <div class="card-body">
                        <p class="mb-2"><strong>Pessoa de Contato:</strong><br><?php echo htmlspecialchars($customer['name']); ?></p>
                        <p class="mb-2"><strong>Email:</strong><br><a href="mailto:<?php echo htmlspecialchars($customer['email']); ?>"><?php echo htmlspecialchars($customer['email']); ?></a></p>
                        <p class="mb-0"><strong>Telefone:</strong><br><?php echo htmlspecialchars($customer['phone']); ?></p>
                    </div>
                </div>

                <div class="card mt-4">
                    <div class="card-header"><h5>Informações da Empresa</h5></div>
                    <div class="card-body">
                        <p class="mb-2"><strong>NIF:</strong><br><?php echo htmlspecialchars($customer['nif']); ?></p>
                        <p class="mb-2"><strong>Website:</strong><br><a href="<?php echo htmlspecialchars($customer['website']); ?>" target="_blank"><?php echo htmlspecialchars($customer['website']); ?></a></p>
                        <p class="mb-2"><strong>Setor:</strong><br><?php echo htmlspecialchars($customer['sector']); ?></p>
                        <p class="mb-0"><strong>Morada:</strong><br><?php echo htmlspecialchars($customer['address']); ?></p>
                    </div>
                </div>
            </div>
        </div>

    <?php else: ?>
        <!-- Customer Not Found -->
        <div class="card">
            <div class="card-body text-center">
                <h5 class="card-title">Cliente não encontrado</h5>
                <p class="card-text">O cliente que você está tentando visualizar não existe ou o ID é inválido.</p>
                <a href="index.php?view=list-customers" class="btn btn-primary">Voltar para a Lista de Clientes</a>
            </div>
        </div>
    <?php endif; ?>
</div>
