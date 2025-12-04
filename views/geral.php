<!-- Dashboard Content -->
<div class="container-fluid p-0">

    <!-- Stats Cards -->
    <div class="row mb-4">
        <div class="col-md-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <div class="cicle-wb bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
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

</div>
