<?php
// --- Lógica CRUD ---

// 1. Dados Mockados (simulando uma base de dados)
$all_customers = [
    1 => ['id' => 1, 'name' => 'Ana Souza', 'company' => 'Souza & Filhos', 'email' => 'ana.souza@example.com', 'status' => 'Ativo', 'phone' => '912345678', 'nif' => '212345678', 'website' => 'https://souza.com', 'address' => 'Rua Principal, 123', 'sector' => 'Retalho', 'services' => ['SEO', 'Google Ads'], 'notes' => 'Cliente antigo.'],
    2 => ['id' => 2, 'name' => 'Bruno Lima', 'company' => 'Lima Tech', 'email' => 'bruno.lima@example.com', 'status' => 'Ativo', 'phone' => '912345679', 'nif' => '212345679', 'website' => 'https://limatech.com', 'address' => 'Av. Central, 456', 'sector' => 'Tecnologia', 'services' => ['Gestão de Redes Sociais'], 'notes' => ''],
    3 => ['id' => 3, 'name' => 'Carlos Pereira', 'company' => 'Pereira Construções', 'email' => 'carlos.p@example.com', 'status' => 'Inativo', 'phone' => '912345680', 'nif' => '212345680', 'website' => '', 'address' => 'Praça da Cidade, 789', 'sector' => 'Imobiliário', 'services' => [], 'notes' => 'Contrato terminado.'],
    4 => ['id' => 4, 'name' => 'Daniela Costa', 'company' => 'Costa Advogados', 'email' => 'daniela.costa@example.com', 'status' => 'Ativo', 'phone' => '912345681', 'nif' => '212345681', 'website' => 'https://costaadv.com', 'address' => 'Rua Legal, 101', 'sector' => 'Serviços', 'services' => ['Criação de Conteúdo'], 'notes' => ''],
    5 => ['id' => 5, 'name' => 'Eduardo Martins', 'company' => 'Martins Imóveis', 'email' => 'e.martins@example.com', 'status' => 'Pendente', 'phone' => '912345682', 'nif' => '212345682', 'website' => '', 'address' => 'Alameda dos Jardins, 202', 'sector' => 'Imobiliário', 'services' => ['SEO'], 'notes' => 'Pendente de pagamento.'],
    6 => ['id' => 6, 'name' => 'Fernanda Almeida', 'company' => 'Almeida & Cia', 'email' => 'fernanda.a@example.com', 'status' => 'Ativo', 'phone' => '912345683', 'nif' => '212345683', 'website' => 'https://almeida.pt', 'address' => 'Rua do Comércio, 303', 'sector' => 'Retalho', 'services' => ['Design Gráfico', 'Google Ads'], 'notes' => ''],
];

// 2. Determinar o modo (Criação vs. Edição)
$customerId = $_GET['id'] ?? null;
$customer = null;
if ($customerId && isset($all_customers[$customerId])) {
    $customer = $all_customers[$customerId];
}

$isEditing = isset($customer);
$pageTitle = $isEditing ? 'Editar Cliente' : 'Novo Cliente';
$submitButtonText = $isEditing ? 'Salvar Alterações' : 'Criar Cliente';

// Simulação de POST
$formSubmitted = false;
$submitMessage = '';
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $formSubmitted = true;
    $submitMessage = $isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!';
    // Aqui iria a lógica de salvar no banco de dados
}

?>

<!-- Inner view content -->
<div class="container-fluid p-0" id="viewContent">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><?php echo $pageTitle; ?></h5>
                </div>
                <div class="card-body">
                    <?php if ($formSubmitted): ?>
                        <div class="alert alert-success" role="alert">
                            <?php echo $submitMessage; ?> (Demonstração: sem gravação em BD)
                        </div>
                    <?php endif; ?>
                    <form action="" method="POST">
                        <div class="row g-3">
                            <!-- Informações Básicas -->
                            <div class="col-md-6">
                                <label for="nome_empresa" class="form-label">Nome da Empresa</label>
                                <input type="text" class="form-control" id="nome_empresa" name="nome_empresa" placeholder="Nome completo da empresa" required value="<?php echo htmlspecialchars($customer['company'] ?? ''); ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="pessoa_contacto" class="form-label">Pessoa de Contacto</label>
                                <input type="text" class="form-control" id="pessoa_contacto" name="pessoa_contacto" placeholder="Nome da pessoa de contacto" required value="<?php echo htmlspecialchars($customer['name'] ?? ''); ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="email_contacto" class="form-label">Email de Contacto</label>
                                <input type="email" class="form-control" id="email_contacto" name="email_contacto" placeholder="email@exemplo.com" required value="<?php echo htmlspecialchars($customer['email'] ?? ''); ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="telefone_contacto" class="form-label">Telefone de Contacto</label>
                                <input type="tel" class="form-control" id="telefone_contacto" name="telefone_contacto" placeholder="+351 912 345 678" value="<?php echo htmlspecialchars($customer['phone'] ?? ''); ?>">
                            </div>

                            <!-- Detalhes da Empresa -->
                            <div class="col-md-6">
                                <label for="nif" class="form-label">NIF</label>
                                <input type="text" class="form-control" id="nif" name="nif" placeholder="Número de Identificação Fiscal" value="<?php echo htmlspecialchars($customer['nif'] ?? ''); ?>">
                            </div>
                            <div class="col-md-6">
                                <label for="website_empresa" class="form-label">Website</label>
                                <input type="url" class="form-control" id="website_empresa" name="website_empresa" placeholder="https://www.exemplo.pt" value="<?php echo htmlspecialchars($customer['website'] ?? ''); ?>">
                            </div>
                            <div class="col-12">
                                <label for="morada_empresa" class="form-label">Morada da Empresa</label>
                                <textarea class="form-control" id="morada_empresa" name="morada_empresa" rows="3" placeholder="Rua, Número, Código Postal, Cidade"><?php echo htmlspecialchars($customer['address'] ?? ''); ?></textarea>
                            </div>
                            <div class="col-md-6">
                                <label for="setor_atividade" class="form-label">Setor de Atividade</label>
                                <select id="setor_atividade" name="setor_atividade" class="form-select">
                                    <?php
                                    $sectors = ['Retalho', 'Serviços', 'Tecnologia', 'Saúde', 'Imobiliário', 'Restauração', 'Outro'];
                                    $selectedSector = $customer['sector'] ?? '';
                                    echo "<option value=''>Selecione o Setor</option>";
                                    foreach ($sectors as $sector) {
                                        $selected = ($sector === $selectedSector) ? 'selected' : '';
                                        echo "<option value='{$sector}' {$selected}>{$sector}</option>";
                                    }
                                    ?>
                                </select>
                            </div>

                            <!-- Serviços Contratados -->
                            <div class="col-12">
                                <label class="form-label">Serviços de Interesse</label>
                                <?php
                                $all_services = ['SEO', 'Google Ads', 'Gestão de Redes Sociais', 'Criação de Conteúdo', 'Design Gráfico'];
                                $customer_services = $customer['services'] ?? [];
                                foreach ($all_services as $service) {
                                    $id = 'servico_' . strtolower(str_replace(' ', '_', $service));
                                    $checked = in_array($service, $customer_services) ? 'checked' : '';
                                    echo "<div class='form-check'>
                                            <input class='form-check-input' type='checkbox' value='{$service}' id='{$id}' name='servicos[]' {$checked}>
                                            <label class='form-check-label' for='{$id}'>{$service}</label>
                                          </div>";
                                }
                                ?>
                            </div>

                            <!-- Observações -->
                            <div class="col-12">
                                <label for="observacoes" class="form-label">Observações</label>
                                <textarea class="form-control" id="observacoes" name="observacoes" rows="4" placeholder="Notas adicionais sobre o cliente..."><?php echo htmlspecialchars($customer['notes'] ?? ''); ?></textarea>
                            </div>

                            <!-- Botões de Ação -->
                            <div class="col-12 d-flex align-items-center">
                                <button type="submit" class="btn btn-primary me-3"><?php echo $submitButtonText; ?></button>
                                <?php if ($isEditing): ?>
                                    <button type="button" class="btn btn-danger">Deletar Cliente</button>
                                <?php endif; ?>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>