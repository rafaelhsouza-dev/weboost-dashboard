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

// Mock data for selects
$gestores = ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Pereira', 'Tiago Mendes', 'Rita Oliveira', 'Outros...'];
$setores = ['E-commerce', 'Serviços', 'Saúde e Bem-Estar', 'Imobiliário', 'Restauração', 'Moda', 'Formação', 'Tecnologia', 'Outro'];
$status_options = ['Ativo', 'Inativo', 'Lead', 'Em Negociação', 'Suspenso'];
$origem_options = [
    'google_ads' => 'Google Ads',
    'meta_ads' => 'Meta Ads (Facebook/Instagram)',
    'tiktok_ads' => 'TikTok Ads',
    'linkedin' => 'LinkedIn',
    'site_agencia' => 'Site da Agência',
    'email_marketing' => 'Email Marketing',
    'feira_evento' => 'Feira / Evento',
    'parceria' => 'Parceria',
    'indicacao' => 'Indicação',
    'outro' => 'Outro'
];
$servicos = ["Gestão Meta Ads", "Gestão Google Ads", "Gestão TikTok Ads", "Produção Vídeo/Foto", "Design Gráfico", "Email Marketing", "SEO", "Gestão Orgânica Redes Sociais", "Criação/Manutenção Website"];
$departamentos = ["Marketing", "TI / Desenvolvimento", "Design", "Vídeo / Foto", "Gestão / Atendimento", "Performance"];
$contrato_status_options = ['Ativo', 'Pendente', 'Concluído', 'Cancelado', 'Suspenso'];


// 2. Determinar o modo (Criação vs. Edição)
$customerId = $_GET['id'] ?? null;
$customer = null;
if ($customerId && isset($all_customers[$customerId])) {
    $customer = $all_customers[$customerId];
}

$isEditing = isset($customer);
$pageTitle = $isEditing ? "Editar Cliente: " . htmlspecialchars($customer['company']) : 'Criar Novo Cliente';
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
                        <!-- Card Informações Gerais -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">Informações Gerais</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <label for="status" class="form-label">Estado do Cliente</label>
                                        <select id="status" name="status" class="form-select" required>
                                            <option value="">-- Selecionar --</option>
                                            <?php foreach ($status_options as $option): ?>
                                                <option value="<?php echo $option; ?>" <?php echo (isset($customer['status']) && $customer['status'] === $option) ? 'selected' : ''; ?>><?php echo $option; ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                    <div class="col-md-4">
                                        <label for="data_entrada" class="form-label">Data de Entrada</label>
                                        <input type="date" class="form-control" id="data_entrada" name="data_entrada" required value="<?php echo htmlspecialchars($customer['data_entrada'] ?? date('Y-m-d')); ?>">
                                    </div>
                                    <div class="col-md-4">
                                        <label for="gestor_principal" class="form-label">Gestor Principal</label>
                                        <select id="gestor_principal" name="gestor_principal" class="form-select" required>
                                            <option value="">-- Selecionar Gestor --</option>
                                            <?php foreach ($gestores as $gestor): ?>
                                                <option value="<?php echo $gestor; ?>" <?php echo (isset($customer['gestor']) && $customer['gestor'] === $gestor) ? 'selected' : ''; ?>><?php echo $gestor; ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card Dados da Empresa -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">Dados da Empresa</h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6"><label for="nome_empresa" class="form-label">Nome da Marca / Empresa</label><input type="text" class="form-control" id="nome_empresa" name="nome_empresa" required value="<?php echo htmlspecialchars($customer['company'] ?? ''); ?>"></div>
                                    <div class="col-md-6"><label for="nome_fiscal" class="form-label">Nome Fiscal</label><input type="text" class="form-control" id="nome_fiscal" name="nome_fiscal" required value="<?php echo htmlspecialchars($customer['nome_fiscal'] ?? ''); ?>"></div>
                                    <div class="col-md-6"><label for="nif" class="form-label">NIF</label><input type="text" class="form-control" id="nif" name="nif" maxlength="9" required value="<?php echo htmlspecialchars($customer['nif'] ?? ''); ?>"></div>
                                    <div class="col-md-6"><label for="setor" class="form-label">Setor de Atividade</label><select id="setor" name="setor" class="form-select"><option value="">-- Selecionar --</option><?php foreach ($setores as $setor) { $selected = (isset($customer['sector']) && $customer['sector'] === $setor) ? 'selected' : ''; echo "<option value='{$setor}' {$selected}>{$setor}</option>"; } ?></select></div>
                                    <div class="col-md-4"><label for="nome_dono" class="form-label">Nome do Dono</label><input type="text" class="form-control" id="nome_dono" name="nome_dono" value="<?php echo htmlspecialchars($customer['nome_dono'] ?? ''); ?>"></div>
                                    <div class="col-md-4"><label for="email_dono" class="form-label">Email do Dono</label><input type="email" class="form-control" id="email_dono" name="email_dono" value="<?php echo htmlspecialchars($customer['email_dono'] ?? ''); ?>"></div>
                                    <div class="col-md-4"><label for="telefone_dono" class="form-label">Telemóvel do Dono</label><input type="tel" class="form-control" id="telefone_dono" name="telefone_dono" value="<?php echo htmlspecialchars($customer['telefone_dono'] ?? ''); ?>"></div>
                                    <div class="col-md-4"><label for="pessoa_contacto" class="form-label">Pessoa de Contacto</label><input type="text" class="form-control" id="pessoa_contacto" name="pessoa_contacto" required value="<?php echo htmlspecialchars($customer['name'] ?? ''); ?>"></div>
                                    <div class="col-md-4"><label for="telefone_principal" class="form-label">Telemóvel Principal</label><input type="tel" class="form-control" id="telefone_principal" name="telefone_principal" required value="<?php echo htmlspecialchars($customer['phone'] ?? ''); ?>"></div>
                                    <div class="col-md-4"><label for="email_principal" class="form-label">Email Principal</label><input type="email" class="form-control" id="email_principal" name="email_principal" required value="<?php echo htmlspecialchars($customer['email'] ?? ''); ?>"></div>
                                    <div class="col-md-6"><label for="website" class="form-label">URL do Website</label><input type="url" class="form-control" id="website" name="website" value="<?php echo htmlspecialchars($customer['website'] ?? ''); ?>"></div>
                                    <div class="col-md-6"><label for="shop" class="form-label">URL da Loja Online</label><input type="url" class="form-control" id="shop" name="shop" value="<?php echo htmlspecialchars($customer['shop'] ?? ''); ?>"></div>
                                    <div class="col-12"><label for="morada" class="form-label">Morada Completa</label><input type="text" class="form-control" id="morada" name="morada" value="<?php echo htmlspecialchars($customer['address'] ?? ''); ?>"></div>
                                </div>
                                
                                <h6 class="mt-4">Contactos Adicionais</h6>
                                <div id="contactos-gestao">
                                    <!-- Dynamic contacts here -->
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-primary mt-2" onclick="adicionarContacto()">+ Adicionar Contacto</button>
                            </div>
                        </div>
                        
                        <!-- Card Origem do Cliente -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">Origem do Cliente</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="origem" class="form-label">Origem do Lead</label>
                                        <select id="origem" name="origem" class="form-select" onchange="atualizarDetalhesOrigem()" required>
                                            <option value="">-- Selecionar Origem --</option>
                                            <?php foreach ($origem_options as $key => $label): ?>
                                                <option value="<?php echo $key; ?>" <?php echo (isset($customer['origem']) && $customer['origem'] === $key) ? 'selected' : ''; ?>><?php echo $label; ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                    <div class="col-md-6" id="detalhes-origem-container">
                                        <!-- Dynamic origin details here -->
                                        <div id="detalhes-origem"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Card Contratos -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">Contratos</h6>
                            </div>
                            <div class="card-body">
                                <div id="contratos-container">
                                     <!-- Dynamic contracts here -->
                                </div>
                                <button type="button" class="btn btn-primary mt-3" onclick="adicionarContrato()">+ Adicionar Novo Contrato</button>
                            </div>
                        </div>

                        <!-- Card Observações -->
                        <div class="card mb-4">
                            <div class="card-header">
                                <h6 class="mb-0">Observações e Notas Internas</h6>
                            </div>
                            <div class="card-body">
                                <textarea name="observacoes" class="form-control" rows="5" placeholder="Objetivos do cliente, concorrência, informações importantes, histórico..."><?php echo htmlspecialchars($customer['notes'] ?? ''); ?></textarea>
                            </div>
                        </div>

                        <!-- Botões de Ação -->
                        <div class="d-flex align-items-center">
                            <button type="submit" class="btn btn-primary me-3"><?php echo $submitButtonText; ?></button>
                            <a href="index.php?view=list-customers" class="btn btn-secondary">Cancelar</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    let contratoIndex = 0;
    const servicos = <?php echo json_encode($servicos); ?>;
    const departamentos = <?php echo json_encode($departamentos); ?>;
    const gestores = <?php echo json_encode($gestores); ?>;
    const contrato_status_options = <?php echo json_encode($contrato_status_options); ?>;

    function adicionarContacto() {
        const container = document.getElementById('contactos-gestao');
        const novo = document.createElement('div');
        novo.className = 'row g-3 mb-2 align-items-center';
        novo.innerHTML = `
            <div class="col"><input type="text" name="contacto_nome[]" class="form-control" placeholder="Nome"></div>
            <div class="col"><input type="text" name="contacto_cargo[]" class="form-control" placeholder="Cargo"></div>
            <div class="col"><input type="tel" name="contacto_telefone[]" class="form-control" placeholder="Telemóvel"></div>
            <div class="col"><input type="email" name="contacto_email[]" class="form-control" placeholder="Email"></div>
            <div class="col-auto"><button type="button" class="btn btn-danger btn-sm" onclick="this.closest('.row').remove()">×</button></div>
        `;
        container.appendChild(novo);
    }

    function adicionarContrato() {
        const container = document.getElementById('contratos-container');
        const novo = document.createElement('div');
        novo.className = 'border rounded p-3 mb-3 position-relative';
        
        let servicosHtml = servicos.map(s => `<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="contrato_servicos[${contratoIndex}][]" value="${s}"><label class="form-check-label">${s}</label></div>`).join('');
        let departamentosHtml = departamentos.map(d => `<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" name="contrato_departamentos[${contratoIndex}][]" value="${d}"><label class="form-check-label">${d}</label></div>`).join('');
        let contratoStatusOptionsHtml = contrato_status_options.map(s => `<option value="${s}">${s}</option>`).join('');

        novo.innerHTML = `
            <button type="button" class="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onclick="this.closest('.border').remove()"></button>
            <div class="row g-3">
                <div class="col-md-4"><label class="form-label">Início do Contrato</label><input type="date" name="contrato_inicio[]" class="form-control" required></div>
                <div class="col-md-4"><label class="form-label">Fim do Contrato</label><input type="date" name="contrato_fim[]" class="form-control"></div>
                <div class="col-md-4"><label class="form-label">Tipo de Cobrança</label><select name="contrato_cobranca[]" class="form-select" required><option value="mensal">Mensal</option><option value="trimestral">Trimestral</option><option value="semestral">Semestral</option><option value="anual">Anual</option><option value="unico">Pagamento Único</option></select></div>
                <div class="col-md-6"><label class="form-label">Valor do Contrato (€)</label><input type="number" step="0.01" name="contrato_valor[]" class="form-control" required></div>
                <div class="col-md-6">
                    <label class="form-label">Status do Contrato</label>
                    <select name="contrato_status[]" class="form-select">
                        ${contratoStatusOptionsHtml}
                    </select>
                </div>
                <div class="col-12"><label class="form-label mb-2">Serviços Incluídos</label><div>${servicosHtml}</div></div>
                <div class="col-12"><label class="form-label mb-2">Departamentos Envolvidos</label><div>${departamentosHtml}</div></div>
                <div class="col-12">
                    <label class="form-label">Observações Internas do Contrato</label>
                    <textarea name="contrato_observacoes[]" class="form-control" rows="3" placeholder="Notas internas sobre este contrato..."></textarea>
                </div>
            </div>
        `;
        container.appendChild(novo);
        contratoIndex++;
    }

    function atualizarDetalhesOrigem() {
        const origem = document.getElementById('origem').value;
        const container = document.getElementById('detalhes-origem');
        container.innerHTML = '';
        let html = '';

        if (origem === 'indicacao') {
            let gestoresOptions = gestores.map(g => `<option value="${g}">${g}</option>`).join('');
            html = `
                <div class="mb-3">
                    <label class="form-label">Indicação Interna (funcionário da agência)</label>
                    <select name="origem_indicacao_interna" class="form-select">
                        <option value="">-- Nenhum --</option>
                        ${gestoresOptions}
                    </select>
                </div>
                <div>
                    <label class="form-label">Indicação Externa (pessoa/empresa)</label>
                    <input type="text" name="origem_indicacao_externa" class="form-control" placeholder="Ex: amigo do cliente, antigo fornecedor...">
                </div>
            `;
        } else if (origem === 'parceria') {
            html = `
                <div>
                    <label class="form-label">Nome do Parceiro</label>
                    <input type="text" name="origem_parceiro_externo" class="form-control" placeholder="Ex: empresa que passou o contacto">
                </div>
            `;
        } else if (origem === 'feira_evento') {
            html = `
                <div>
                    <label class="form-label">Nome do Evento / Detalhe</label>
                    <input type="text" name="origem_evento_externo" class="form-control" placeholder="Ex: stand na feira X, palestra no ISEG...">
                </div>
            `;
        } else if (origem && origem !== '') {
            html = `
                <div>
                    <label class="form-label">Detalhe da Origem</label>
                    <input type="text" name="origem_detalhe" class="form-control" placeholder="Ex: campanha Verão 2025, formulário do site...">
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // Initial calls
    document.addEventListener('DOMContentLoaded', function() {
        // If editing, you would populate existing contacts and contracts here from PHP data
        // For now, let's just add one of each for demonstration if it's a new client
        if (!<?php echo $isEditing ? 'true' : 'false'; ?>) {
             adicionarContrato();
        }
        atualizarDetalhesOrigem();
    });

</script>
