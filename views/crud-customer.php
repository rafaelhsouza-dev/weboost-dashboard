<?php
// Mock-only: handle POST and show a confirmation alert on the page (no persistence)
$formSubmitted = false;
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Basic sanitization (demonstrative)
    $nome_empresa = filter_input(INPUT_POST, 'nome_empresa', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $pessoa_contacto = filter_input(INPUT_POST, 'pessoa_contacto', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email_contacto = filter_input(INPUT_POST, 'email_contacto', FILTER_SANITIZE_EMAIL);
    $telefone_contacto = filter_input(INPUT_POST, 'telefone_contacto', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $nif = filter_input(INPUT_POST, 'nif', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $morada_empresa = filter_input(INPUT_POST, 'morada_empresa', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $website_empresa = filter_input(INPUT_POST, 'website_empresa', FILTER_SANITIZE_URL);
    $setor_atividade = filter_input(INPUT_POST, 'setor_atividade', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $servicos = filter_input(INPUT_POST, 'servicos', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY) ?: [];
    $observacoes = filter_input(INPUT_POST, 'observacoes', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $formSubmitted = true;
}
?>

<!-- Inner view content -->
<div class="container-fluid p-0" id="viewContent">
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Criar Novo Cliente</h5>
                </div>
                <div class="card-body">
                    <?php if (!empty($formSubmitted)): ?>
                        <div class="alert alert-success" role="alert">
                            Cliente mockado registado com sucesso! (Sem gravação em base de dados)
                        </div>
                    <?php endif; ?>
                    <form action="" method="POST">
                        <div class="row g-3">
                            <!-- Informações Básicas -->
                            <div class="col-md-6">
                                <label for="nome_empresa" class="form-label">Nome da Empresa</label>
                                <input type="text" class="form-control" id="nome_empresa" name="nome_empresa" placeholder="Nome completo da empresa" required>
                            </div>
                        <div class="col-md-6">
                            <label for="pessoa_contacto" class="form-label">Pessoa de Contacto</label>
                            <input type="text" class="form-control" id="pessoa_contacto" name="pessoa_contacto" placeholder="Nome da pessoa de contacto" required>
                        </div>
                        <div class="col-md-6">
                            <label for="email_contacto" class="form-label">Email de Contacto</label>
                            <input type="email" class="form-control" id="email_contacto" name="email_contacto" placeholder="email@exemplo.com" required>
                        </div>
                        <div class="col-md-6">
                            <label for="telefone_contacto" class="form-label">Telefone de Contacto</label>
                            <input type="tel" class="form-control" id="telefone_contacto" name="telefone_contacto" placeholder="+351 912 345 678">
                        </div>

                        <!-- Detalhes da Empresa -->
                        <div class="col-md-6">
                            <label for="nif" class="form-label">NIF</label>
                            <input type="text" class="form-control" id="nif" name="nif" placeholder="Número de Identificação Fiscal">
                        </div>
                        <div class="col-md-6">
                            <label for="website_empresa" class="form-label">Website</label>
                            <input type="url" class="form-control" id="website_empresa" name="website_empresa" placeholder="https://www.exemplo.pt">
                        </div>
                        <div class="col-12">
                            <label for="morada_empresa" class="form-label">Morada da Empresa</label>
                            <textarea class="form-control" id="morada_empresa" name="morada_empresa" rows="3" placeholder="Rua, Número, Código Postal, Cidade"></textarea>
                        </div>
                        <div class="col-md-6">
                            <label for="setor_atividade" class="form-label">Setor de Atividade</label>
                            <select id="setor_atividade" name="setor_atividade" class="form-select">
                                <option value="">Selecione o Setor</option>
                                <option value="Retalho">Retalho</option>
                                <option value="Serviços">Serviços</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Saúde">Saúde</option>
                                <option value="Imobiliário">Imobiliário</option>
                                <option value="Restauração">Restauração</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <!-- Serviços Contratados -->
                        <div class="col-12">
                            <label class="form-label">Serviços de Interesse</label>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="SEO" id="servico_seo" name="servicos[]">
                                <label class="form-check-label" for="servico_seo">Otimização para Motores de Busca (SEO)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Google Ads" id="servico_google_ads" name="servicos[]">
                                <label class="form-check-label" for="servico_google_ads">Google Ads (Links Patrocinados)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Gestão de Redes Sociais" id="servico_redes_sociais" name="servicos[]">
                                <label class="form-check-label" for="servico_redes_sociais">Gestão de Redes Sociais</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Criação de Conteúdo" id="servico_conteudo" name="servicos[]">
                                <label class="form-check-label" for="servico_conteudo">Criação de Conteúdo</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="Design Gráfico" id="servico_design" name="servicos[]">
                                <label class="form-check-label" for="servico_design">Design Gráfico</label>
                            </div>
                        </div>

                        <!-- Observações -->
                        <div class="col-12">
                            <label for="observacoes" class="form-label">Observações</label>
                            <textarea class="form-control" id="observacoes" name="observacoes" rows="4" placeholder="Notas adicionais sobre o cliente ou requisitos especiais."></textarea>
                        </div>

                        <div class="col-12">
                            <button type="submit" class="btn btn-primary">Registar Cliente</button>
                        </div>

                        <div class="col-12">
                            <small class="text-muted">Cadastro de cliente.</small>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>