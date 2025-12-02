<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Modern Dashboard</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Animate.css -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>

    <div class="login-page">
        <div class="card login-card p-4 animate__animated animate__fadeInUp">
            <div class="card-body">
                <div class="login-brand">
                    <img src="imgs/WB-LOGO-WORDMARK@300x-1.webp" alt="Weboost" height="40">
                </div>

                <h4 class="text-center mb-4">Olá!</h4>
                <p class="text-center text-muted mb-4">Por favor faça seu login para aceder ao painel.</p>

                <div id="errorMsg" class="alert alert-danger d-none" role="alert"></div>

                <form id="loginForm">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <span class="material-symbols-rounded text-muted">mail</span>
                            </span>
                            <input type="email" class="form-control border-start-0 ps-0" id="email"
                                placeholder="name@example.com" value="admin@dash.com" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="password" class="form-label">Senha</label>
                        <div class="input-group">
                            <span class="input-group-text bg-transparent border-end-0">
                                <span class="material-symbols-rounded text-muted">lock</span>
                            </span>
                            <input type="password" class="form-control border-start-0 ps-0" id="password"
                                value="admin123" required>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="rememberMe">
                            <label class="form-check-label" for="rememberMe">Lembrar</label>
                        </div>
                        <a href="#" class="text-decoration-none small">Perdeu a senha?</a>
                    </div>

                    <button type="submit" class="btn btn-primary w-100 py-2">Entrar</button>
                </form>

                <div class="text-center mt-4">
                    <p class="small text-muted">Não tem conta? <a href="#" class="text-decoration-none">Criar conta</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Auth JS -->
    <script src="assets/js/auth.js"></script>
</body>

</html>