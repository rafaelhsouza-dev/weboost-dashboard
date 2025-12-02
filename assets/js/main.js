document.addEventListener('DOMContentLoaded', function () {
    // Check Auth
    checkAuth();

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('span');

    // Check local storage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            icon.textContent = 'light_mode';
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.textContent = 'dark_mode';
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.textContent = 'light_mode';
        }
        // Update charts theme if needed
        updateChartsTheme();
    });

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarLogo = document.getElementById('sidebarLogo'); // Obter referência ao logo
    const clientSelector = document.getElementById('clientSelector'); // Obter referência ao seletor de cliente

    if (clientSelector) {
        clientSelector.addEventListener('change', (event) => {
            console.log('Cliente selecionado:', event.target.value);
            // Aqui você adicionaria a lógica para carregar os dados do cliente selecionado
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (window.innerWidth >= 992) {
                // Desktop: Collapse/Expand
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');

                // Lógica para trocar o logo
                if (sidebar.classList.contains('collapsed')) {
                    sidebarLogo.src = 'imgs/Icon-1.webp';
                } else {
                    sidebarLogo.src = 'imgs/WB-LOGO-WORDMARK@300x-1.webp';
                }

                // Trigger resize for charts
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 300);
            } else {
                // Mobile: Show/Hide
                sidebar.classList.toggle('show');
            }
        });
    }

    // Initialize ApexCharts
    initCharts();

    // Initialize Swiper
    initSwiper();
});

// Logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.php';
}

// Charts
let salesChart, visitorsChart;

function initCharts() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#d0d2d6' : '#212529';
    const gridColor = isDark ? '#3b4253' : '#e9ecef';

    // Sales Chart
    const salesOptions = {
        series: [{
            name: 'Sales',
            data: [31, 40, 28, 51, 42, 109, 100]
        }, {
            name: 'Revenue',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: { show: false },
            background: 'transparent'
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
            labels: { style: { colors: textColor } }
        },
        yaxis: {
            labels: { style: { colors: textColor } }
        },
        grid: {
            borderColor: gridColor
        },
        tooltip: {
            theme: isDark ? 'dark' : 'light'
        },
        colors: ['#00FF85', '#28c76f']
    };

    const salesChartEl = document.querySelector("#salesChart");
    if (salesChartEl) {
        salesChart = new ApexCharts(salesChartEl, salesOptions);
        salesChart.render();
    }

    // Visitors Chart (Donut)
    const visitorsOptions = {
        series: [44, 55, 41, 17, 15],
        chart: {
            type: 'donut',
            background: 'transparent'
        },
        labels: ['Direct', 'Social', 'Referral', 'Organic', 'Other'],
        theme: {
            mode: isDark ? 'dark' : 'light',
            palette: 'palette1'
        },
        stroke: { show: false },
        dataLabels: { enabled: false },
        legend: {
            position: 'bottom',
            labels: { colors: textColor }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { width: 200 },
                legend: { position: 'bottom' }
            }
        }]
    };

    const visitorsChartEl = document.querySelector("#visitorsChart");
    if (visitorsChartEl) {
        visitorsChart = new ApexCharts(visitorsChartEl, visitorsOptions);
        visitorsChart.render();
    }
}

function updateChartsTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#d0d2d6' : '#212529';
    const gridColor = isDark ? '#3b4253' : '#e9ecef';
    const themeMode = isDark ? 'dark' : 'light';

    if (salesChart) {
        salesChart.updateOptions({
            xaxis: { labels: { style: { colors: textColor } } },
            yaxis: { labels: { style: { colors: textColor } } },
            grid: { borderColor: gridColor },
            tooltip: { theme: themeMode }
        });
    }

    if (visitorsChart) {
        visitorsChart.updateOptions({
            theme: { mode: themeMode },
            legend: { labels: { colors: textColor } }
        });
    }
}

// Swiper
function initSwiper() {
    new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        }
    });
}
