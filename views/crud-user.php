<?php
// --- Lógica CRUD para Usuários ---

// 1. Dados Mockados
$all_users = [
    1 => ['id' => 1, 'name' => 'Rafael Souza', 'email' => 'rafael.souza@weboost.pt', 'role' => 'Admin'],
    2 => ['id' => 2, 'name' => 'Carla Mendes', 'email' => 'carla.mendes@weboost.pt', 'role' => 'Gestor de Projetos'],
    3 => ['id' => 3, 'name' => 'Pedro Alves', 'email' => 'pedro.alves@weboost.pt', 'role' => 'Analista de SEO'],
];

// 2. Determinar o modo (Criação vs. Edição)
$userId = $_GET['id'] ?? null;
$user = null;
if ($userId && isset($all_users[$userId])) {
    $user = $all_users[$userId];
}

$isEditing = isset($user);
$pageTitle = $isEditing ? 'Editar Usuário' : 'Novo Usuário';
$submitButtonText = $isEditing ? 'Salvar Alterações' : 'Criar Usuário';

// Simulação de POST
$formSubmitted = false;
$submitMessage = '';
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $formSubmitted = true;
    $submitMessage = $isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!';
}

?>

<!-- Inner view content -->
<div class="container-fluid p-0" id="viewContent">
    <div class="row">
        <div class="col-12 col-lg-8 mx-auto">
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
                            <div class="col-12">
                                <label for="user_name" class="form-label">Nome Completo</label>
                                <input type="text" class="form-control" id="user_name" name="user_name" required value="<?php echo htmlspecialchars($user['name'] ?? ''); ?>">
                            </div>
                            <div class="col-12">
                                <label for="user_email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="user_email" name="user_email" required value="<?php echo htmlspecialchars($user['email'] ?? ''); ?>">
                            </div>
                            <div class="col-12">
                                <label for="user_role" class="form-label">Cargo</label>
                                <select id="user_role" name="user_role" class="form-select">
                                    <?php
                                    $roles = ['Admin', 'Gestor de Projetos', 'Analista de SEO', 'Editor de Conteúdo'];
                                    $selectedRole = $user['role'] ?? '';
                                    foreach ($roles as $role) {
                                        $selected = ($role === $selectedRole) ? 'selected' : '';
                                        echo "<option value='{$role}' {$selected}>{$role}</option>";
                                    }
                                    ?>
                                </select>
                            </div>
                            <div class="col-12">
                                <label for="user_password" class="form-label"><?php echo $isEditing ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'; ?></label>
                                <input type="password" class="form-control" id="user_password" name="user_password" <?php echo !$isEditing ? 'required' : ''; ?>>
                            </div>
                            
                            <!-- Botões de Ação -->
                            <div class="col-12 d-flex align-items-center mt-4">
                                <button type="submit" class="btn btn-primary me-3"><?php echo $submitButtonText; ?></button>
                                <?php if ($isEditing): ?>
                                    <button type="button" class="btn btn-danger">Deletar Usuário</button>
                                <?php endif; ?>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
