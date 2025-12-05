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

    if(themeToggle) {
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

    // PDF Export Logic (Refactored)
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            const btn = this;
            const originalBtnHTML = btn.innerHTML;
            const sourceContent = document.getElementById('viewContent');

            if (!sourceContent) {
                alert('Erro: Não foi possível encontrar o conteúdo para exportar.');
                return;
            }

            // 1. Indicate loading state
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Gerando...';
            btn.disabled = true;

            // 2. Create a temporary, in-DOM container for the clone (kept visible but transparent for correct sizing)
            const pdfContainer = document.createElement('div');
            // Keep it in the normal flow for proper sizing of charts/canvases
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '0';
            pdfContainer.style.top = '0';
            // Keep visible for layout, but fully transparent and non-interactive
            pdfContainer.style.opacity = '0.01';
            pdfContainer.style.pointerEvents = 'none';
            // Force light appearance
            pdfContainer.setAttribute('data-theme', 'light');
            pdfContainer.style.background = '#ffffff';
            pdfContainer.style.padding = '20px';
            // Match source content width to avoid clipping and reflows
            const contentWidth = sourceContent.scrollWidth || sourceContent.offsetWidth || 1024;
            pdfContainer.style.width = contentWidth + 'px';
            document.body.appendChild(pdfContainer);

            // 3. Clone the content and append
            const contentClone = sourceContent.cloneNode(true);
            // Add a helper class to force light styles in CSS
            contentClone.classList.add('pdf-export');
            pdfContainer.appendChild(contentClone);

            // 4. Function to re-render a chart in the clone
            const renderClonedChart = async (originalChart, selector) => {
                const clonedEl = contentClone.querySelector(selector);
                if (originalChart && clonedEl) {
                    // Ensure cloned chart container has a width similar to the original
                    const origEl = document.querySelector(selector);
                    if (origEl) {
                        const computed = getComputedStyle(origEl);
                        clonedEl.style.width = origEl.clientWidth + 'px';
                        clonedEl.style.height = origEl.clientHeight + 'px';
                        clonedEl.style.maxWidth = computed.maxWidth;
                    }
                    // Deep copy options and force light theme
                    const clonedOptions = JSON.parse(JSON.stringify(originalChart.w.globals.initialOptions));
                    clonedOptions.chart.background = '#ffffff';
                    clonedOptions.tooltip = { theme: 'light' };
                    const textColor = '#212529';
                    clonedOptions.xaxis.labels.style.colors = textColor;
                    clonedOptions.yaxis.labels.style.colors = textColor;
                    clonedOptions.grid.borderColor = '#e9ecef';
                    if (clonedOptions.legend && clonedOptions.legend.labels) {
                        clonedOptions.legend.labels.colors = textColor;
                    }
                    // For visitors chart specifically
                    if (selector === '#visitorsChart') {
                        clonedOptions.theme = { mode: 'light', palette: 'palette1' }; // Ensure consistent palette
                    }
                    
                    const chart = new ApexCharts(clonedEl, clonedOptions);
                    await chart.render();
                    return chart;
                }
                return null;
            };

            // Helper: wait for all images inside the cloned content to load
            const waitForImages = async (rootEl) => {
                const imgs = Array.from(rootEl.querySelectorAll('img'));
                await Promise.all(imgs.map(img => {
                    return new Promise(resolve => {
                        if (img.complete && img.naturalWidth !== 0) return resolve();
                        img.addEventListener('load', () => resolve(), { once: true });
                        img.addEventListener('error', () => resolve(), { once: true });
                    });
                }));
            };

            // Re-render all charts and wait for them
            try {
                // Ensure the global chart variables exist
                if (typeof salesChart !== 'undefined') {
                    await renderClonedChart(salesChart, '#salesChart');
                }
                if (typeof visitorsChart !== 'undefined') {
                     await renderClonedChart(visitorsChart, '#visitorsChart');
                }
                // Ensure images are loaded
                await waitForImages(contentClone);
            } catch (err) {
                console.error("Erro ao clonar gráficos para o PDF:", err);
                // Cleanup and exit if charts fail
                document.body.removeChild(pdfContainer);
                btn.innerHTML = originalBtnHTML;
                btn.disabled = false;
                alert('Ocorreu um erro ao gerar os gráficos para o PDF.');
                return;
            }
            
            // 5. Generate PDF from the prepared clone
            const pdfOptions = {
                margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right in inches for more equal margins
                filename: `relatorio-weboost-${new Date().toISOString().slice(0, 10)}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2, // Higher scale for better quality
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#ffffff',
                    windowWidth: contentWidth
                },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['css', 'legacy'], before: '.page-break' }
            };

            html2pdf().from(contentClone).set(pdfOptions).toPdf().get('pdf').then(function (pdf) {
                const pageCount = pdf.internal.getNumberOfPages();
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                pdf.setFontSize(8);
                pdf.setTextColor('#6c757d'); // Changed to a slightly darker gray for better visibility

                for (let i = 1; i <= pageCount; i++) {
                    pdf.setPage(i);
                    // Header
                    pdf.text('Relatório Confidencial - Weboost', pageWidth / 2, 0.25, { align: 'center' });
                    // Footer
                    const footerText = `Página ${i} de ${pageCount}`;
                    pdf.text(footerText, pageWidth / 2, pageHeight - 0.35, { align: 'center' });
                }
            }).save().finally(() => {
                // 6. Cleanup
                document.body.removeChild(pdfContainer);
                btn.innerHTML = originalBtnHTML;
                btn.disabled = false;
            });
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