document.addEventListener('DOMContentLoaded', function () {
    // Check Auth
    checkAuth();

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Verifica se themeToggle existe antes de tentar acessá-lo
    if (themeToggle) {
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
    }

    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const userAvatarCollapsed = document.getElementById('userAvatarCollapsed');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarLogo = document.getElementById('sidebarLogo');
    const clientSelector = document.getElementById('clientSelector');

    if (clientSelector) {
        clientSelector.addEventListener('change', (event) => {
            const selectedView = event.target.value;
            window.location.href = 'index.php?view=' + selectedView;
        });
    }

    const toggleSidebar = () => {
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
    };

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar();
        });
    }

    if (userAvatarCollapsed) {
        userAvatarCollapsed.addEventListener('click', (e) => {
            e.preventDefault();
            // Apenas expande, não recolhe
            if (sidebar.classList.contains('collapsed')) {
                toggleSidebar();
            }
        });
    }

    // Date Range Logic
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const applyDateRangeBtn = document.getElementById('applyDateRange');
    const datePresetItems = document.querySelectorAll('[aria-labelledby="datePresetPicker"] .dropdown-item');

    // Helper para formatar a data para o input datetime-local (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (date) => {
        const pad = (num) => num.toString().padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const urlParams = new URLSearchParams(window.location.search);
    const currentView = urlParams.get('view') || 'geral';
    const startDateParam = urlParams.get('startDate');
    const endDateParam = urlParams.get('endDate');

    // Inicializa os campos de data
    if (startDateInput && endDateInput) {
        if (startDateParam && endDateParam) {
            startDateInput.value = startDateParam;
            endDateInput.value = endDateParam;
        } else {
            const now = new Date();
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            startDateInput.value = formatDateForInput(todayStart);
            endDateInput.value = formatDateForInput(now);
        }
    }
    
    // Aplica o filtro de data
    if (applyDateRangeBtn) {
        applyDateRangeBtn.addEventListener('click', () => {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;

            if (startDate && endDate) {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete('period');
                urlParams.set('startDate', startDate);
                urlParams.set('endDate', endDate);
                window.location.search = urlParams.toString();
            }
        });
    }

    // Aplica predefinições
    if(datePresetItems) {
        datePresetItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const period = this.getAttribute('data-period');
                const now = new Date();
                let startDate = new Date();
    
                switch (period) {
                    case 'today':
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    case '7d':
                        startDate.setDate(now.getDate() - 7);
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    case '15d':
                        startDate.setDate(now.getDate() - 15);
                        startDate.setHours(0, 0, 0, 0);
                        break;
                    case '30d':
                         startDate.setDate(now.getDate() - 30);
                         startDate.setHours(0, 0, 0, 0);
                        break;
                }
                
                startDateInput.value = formatDateForInput(startDate);
                endDateInput.value = formatDateForInput(now);
            });
        });
    }

    // PDF Export Logic
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // 1. Construir a URL da página de impressão
            const dashboardUrl = new URL(window.location.href);
            dashboardUrl.searchParams.set('pdf', '1');
            // Adiciona o token de acesso para autenticação no backend
            if (window.pdfAccessToken) {
                dashboardUrl.searchParams.set('token', window.pdfAccessToken);
            }

            // 2. Construir a URL final da API, deixando URLSearchParams cuidar da codificação
            const apiBaseUrl = 'https://api.weboost.pt/puppeteer/pdf';
            const apiParams = new URLSearchParams({
                url: dashboardUrl.toString(), // Passar a URL literal diretamente
                format: 'A4',
                landscape: 'false',
                margin_top: '10mm',
                margin_right: '10mm',
                margin_bottom: '10mm',
                margin_left: '10mm'
            });

            const finalApiUrl = `${apiBaseUrl}?${apiParams.toString()}`;

            // 3. Redirecionar para a API para baixar o PDF
            window.open(finalApiUrl, '_blank');
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

    if (typeof salesChart !== 'undefined' && salesChart) {
        salesChart.updateOptions({
            xaxis: { labels: { style: { colors: textColor } } },
            yaxis: { labels: { style: { colors: textColor } } },
            grid: { borderColor: gridColor },
            tooltip: { theme: themeMode }
        });
    }

    if (typeof visitorsChart !== 'undefined' && visitorsChart) {
        visitorsChart.updateOptions({
            theme: { mode: themeMode },
            legend: { labels: { colors: textColor } }
        });
    }
}

// Swiper
function initSwiper() {
    if(typeof Swiper !== 'undefined') {
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
}