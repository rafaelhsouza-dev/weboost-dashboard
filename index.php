<!DOCTYPE html>
<html lang="en">

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

    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="d-flex align-items-center gap-2 text-primary fw-bold fs-4">
                <img id="sidebarLogo" src="imgs/WB-LOGO-WORDMARK@300x-1.webp" alt="Weboost" height="40">
            </div>
        </div>

        <div class="sidebar-menu">
            <a href="#" class="menu-item active">
                <span class="material-symbols-rounded">home</span>
                <span>Dashboard</span>
            </a>
            <a href="#" class="menu-item">
                <span class="material-symbols-rounded">group</span>
                <span>CDP</span>
            </a>
            <a href="#" class="menu-item">
                <span class="material-symbols-rounded">analytics</span>
                <span>Analytics</span>
            </a>
            <a href="#" class="menu-item">
                <span class="material-symbols-rounded">campaign</span>
                <span>Campaigns</span>
            </a>
            <a href="#" class="menu-item">
                <span class="material-symbols-rounded">settings</span>
                <span>Settings</span>
            </a>
        </div>

        <div class="p-3 border-top border-secondary-subtle">
            <a href="#" onclick="logout()" class="menu-item text-danger">
                <span class="material-symbols-rounded">logout</span>
                <span>Logout</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
            <div class="d-flex align-items-center">
                <button id="sidebarToggle" class="btn btn-link text-body p-0 me-3">
                    <span class="material-symbols-rounded">menu</span>
                </button>
                <h4 class="m-0">Dashboard Overview</h4>
            </div>

            <div class="d-flex align-items-center gap-3">
                <div class="theme-toggle" id="themeToggle">
                    <span class="material-symbols-rounded">dark_mode</span>
                </div>

                <div class="dropdown">
                    <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle text-body"
                        data-bs-toggle="dropdown">
                        <img src="https://ui-avatars.com/api/?name=Admin+User&background=4361ee&color=fff" alt="User"
                            class="rounded-circle me-2" width="32" height="32">
                        <span class="d-none d-md-block">Admin User</span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                        <li><a class="dropdown-item" href="#">Profile</a></li>
                        <li><a class="dropdown-item" href="#">Settings</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item text-danger" href="#" onclick="logout()">Logout</a></li>
                    </ul>
                </div>
            </div>
        </header>

        <!-- Dashboard Content -->
        <div class="container-fluid p-0">

            <!-- Stats Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body d-flex align-items-center">
                            <div class="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                                <span class="material-symbols-rounded">attach_money</span>
                            </div>
                            <div>
                                <h6 class="text-muted mb-1">Total Revenue</h6>
                                <h4 class="mb-0">$45,231</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body d-flex align-items-center">
                            <div class="bg-success bg-opacity-10 p-3 rounded-circle me-3 text-success">
                                <span class="material-symbols-rounded">shopping_cart</span>
                            </div>
                            <div>
                                <h6 class="text-muted mb-1">Total Orders</h6>
                                <h4 class="mb-0">1,205</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body d-flex align-items-center">
                            <div class="bg-warning bg-opacity-10 p-3 rounded-circle me-3 text-warning">
                                <span class="material-symbols-rounded">group</span>
                            </div>
                            <div>
                                <h6 class="text-muted mb-1">New Customers</h6>
                                <h4 class="mb-0">342</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body d-flex align-items-center">
                            <div class="bg-info bg-opacity-10 p-3 rounded-circle me-3 text-info">
                                <span class="material-symbols-rounded">trending_up</span>
                            </div>
                            <div>
                                <h6 class="text-muted mb-1">Growth</h6>
                                <h4 class="mb-0">+12.5%</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="row mb-4">
                <div class="col-lg-8">
                    <div class="card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Revenue Analytics</h5>
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button"
                                    data-bs-toggle="dropdown">
                                    Last 7 Days
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Last 7 Days</a></li>
                                    <li><a class="dropdown-item" href="#">Last Month</a></li>
                                    <li><a class="dropdown-item" href="#">Last Year</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="card-body">
                            <div id="salesChart"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card h-100">
                        <div class="card-header">
                            <h5 class="mb-0">Traffic Sources</h5>
                        </div>
                        <div class="card-body d-flex align-items-center justify-content-center">
                            <div id="visitorsChart" class="w-100"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Swiper Section -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Featured Campaigns</h5>
                        </div>
                        <div class="card-body">
                            <div class="swiper mySwiper">
                                <div class="swiper-wrapper">
                                    <div class="swiper-slide">
                                        <div class="card bg-primary text-white h-100">
                                            <div class="card-body">
                                                <h4>Summer Sale</h4>
                                                <p>Up to 50% off on all items.</p>
                                                <button class="btn btn-light btn-sm">View Details</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="card bg-success text-white h-100">
                                            <div class="card-body">
                                                <h4>New Arrivals</h4>
                                                <p>Check out the latest trends.</p>
                                                <button class="btn btn-light btn-sm">Shop Now</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="card bg-warning text-dark h-100">
                                            <div class="card-body">
                                                <h4>Flash Deal</h4>
                                                <p>Limited time offer.</p>
                                                <button class="btn btn-dark btn-sm">Grab it</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="swiper-slide">
                                        <div class="card bg-info text-white h-100">
                                            <div class="card-body">
                                                <h4>Members Only</h4>
                                                <p>Exclusive access for members.</p>
                                                <button class="btn btn-light btn-sm">Join Now</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-pagination"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </main>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- ApexCharts -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <!-- Swiper JS -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <!-- Auth JS -->
    <script src="assets/js/auth.js"></script>
    <!-- Main JS -->
    <script src="assets/js/main.js"></script>
</body>

</html>