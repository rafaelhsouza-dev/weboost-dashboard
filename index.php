<?php
// Inclui as variáveis de configuração que serão usadas em toda a página
include 'includes/config.php';

// Carrega o conteúdo principal da página com base na view
ob_start();
if ($currentView === 'admin') {
    include 'views/admin.php';
} elseif ($currentView === 'geral') {
    include 'views/geral.php';
} elseif ($currentView === 'list-customers') {
    include 'views/list-customers.php';
} elseif ($currentView === 'crud-customer') {
    include 'views/crud-customer.php';
} elseif ($currentView === 'list-users') {
    include 'views/list-users.php';
} elseif ($currentView === 'crud-user') {
    include 'views/crud-user.php';
} elseif ($currentView === 'view-customer') {
    include 'views/view-customer.php';
} elseif ($currentView === 'settings') {
    include 'views/settings.php';
} else { // Para qualquer cliente
    include 'views/cliente.php';
}
$mainContent = ob_get_clean();

// Se for a visualização de PDF, carrega um template limpo
if ($is_pdf_view) {
    include 'includes/pdf_header.php';
    echo $mainContent;
    include 'includes/pdf_footer.php';
} else {
    // Caso contrário, carrega o layout padrão do dashboard
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | Weboost</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Swiper CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>

    <?php include 'includes/sidebar.php'; ?>

    <!-- Main Content -->
    <main class="main-content">
        
        <?php include 'includes/header.php'; ?>

        <?php echo $mainContent; ?>
        
    </main>

    <?php include 'includes/footer.php'; ?>
    
</body>

</html>
<?php
} // Fim do else
?>