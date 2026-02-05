document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const productForm = document.getElementById('product-form');
    const editForm = document.getElementById('edit-form');
    const categoryForm = document.getElementById('category-form');
    const supplierForm = document.getElementById('supplier-form');
    const movementForm = document.getElementById('movement-form');
    const productsTable = document.getElementById('products-tbody');
    const searchInput = document.getElementById('search');
    const filterCategory = document.getElementById('filter-category');
    const filterSupplier = document.getElementById('filter-supplier');
    const filterStock = document.getElementById('filter-stock');
    const filterMinPrice = document.getElementById('filter-min-price');
    const filterMaxPrice = document.getElementById('filter-max-price');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const addSupplierBtn = document.getElementById('add-supplier-btn');
    const addMovementBtn = document.getElementById('add-movement-btn');
    const exportBtn = document.getElementById('export-btn');
    const editModal = document.getElementById('edit-modal');
    const categoryModal = document.getElementById('category-modal');
    const supplierModal = document.getElementById('supplier-modal');
    const movementModal = document.getElementById('movement-modal');
    const messageModal = document.getElementById('message-modal');
    const messageText = document.getElementById('message-text');
    const toggleCategoryChart = document.getElementById('toggle-category-chart');
    const categoryChartContainer = document.getElementById('category-chart-container');
    const toggleStockChart = document.getElementById('toggle-stock-chart');
    const stockChartContainer = document.getElementById('stock-chart-container');
    const toggleValueChart = document.getElementById('toggle-value-chart');
    const valueChartContainer = document.getElementById('value-chart-container');
    const toggleDemandChart = document.getElementById('toggle-demand-chart');
    const demandChartContainer = document.getElementById('demand-chart-container');
    const demandProductFilter = document.getElementById('demand-product-filter');
    const toggleMovements = document.getElementById('toggle-movements');
    const movementsContainer = document.getElementById('movements-container');
    const filterMovementProduct = document.getElementById('filter-movement-product');
    const filterMovementType = document.getElementById('filter-movement-type');
    const filterMovementFrom = document.getElementById('filter-movement-from');
    const filterMovementTo = document.getElementById('filter-movement-to');
    const clearMovementFilters = document.getElementById('clear-movement-filters');
    const toggleDetailedStats = document.getElementById('toggle-detailed-stats');
    const detailedStatsContainer = document.getElementById('detailed-stats-container');
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');

    // Datos
    let products = [];
    let categories = [];
    let suppliers = [];
    let movements = [];
    let currentEditId = null;

    // Gráficos
    let categoryChart, stockChart, valueChart, demandChart;
    let currentDemandMonths = 6; // Período predeterminado

    // IDs de datos de demostración (no modificables permanentemente)
    const DEMO_IDS = ['1', '2', '3', '4', '5', '6', '7', '8'];

    // Funciones de guardado
    function saveData() {
        localStorage.setItem('inventory-products', JSON.stringify(products));
        localStorage.setItem('inventory-categories', JSON.stringify(categories));
        localStorage.setItem('inventory-suppliers', JSON.stringify(suppliers));
        localStorage.setItem('inventory-movements', JSON.stringify(movements));
    }

    // Datos de demostración base (siempre se cargan)
    const demoCategories = [
        { id: '1', name: 'Ingredientes Básicos' },
        { id: '2', name: 'Carnes y Proteínas' },
        { id: '3', name: 'Verduras y Frutas' },
        { id: '4', name: 'Bebidas' },
        { id: '5', name: 'Lácteos' }
    ];

    const demoSuppliers = [
        { id: '1', name: 'Distribuidora de Alimentos S.A.' },
        { id: '2', name: 'Proveedor de Carnes Fresca' },
        { id: '3', name: 'Verduras Orgánicas Ltda.' },
        { id: '4', name: 'Bebidas Nacionales' },
        { id: '5', name: 'Lácteos del Valle' }
    ];

    const demoProducts = [
        { id: '1', name: 'Harina de Trigo', category: '1', supplier: '1', salePrice: 2500, stock: 50, unit: 'kg', lowStockThreshold: 10 },
        { id: '2', name: 'Carne Molida', category: '2', supplier: '2', salePrice: 12000, stock: 20, unit: 'kg', lowStockThreshold: 5 },
        { id: '3', name: 'Tomates', category: '3', supplier: '3', salePrice: 3000, stock: 30, unit: 'kg', lowStockThreshold: 8 },
        { id: '4', name: 'Coca-Cola', category: '4', supplier: '4', salePrice: 1500, stock: 100, unit: 'unidades', lowStockThreshold: 20 },
        { id: '5', name: 'Queso Cheddar', category: '5', supplier: '5', salePrice: 8000, stock: 15, unit: 'kg', lowStockThreshold: 3 },
        { id: '6', name: 'Aceite de Oliva', category: '1', supplier: '1', salePrice: 4500, stock: 12, unit: 'litros', lowStockThreshold: 8 },
        { id: '7', name: 'Lechuga', category: '3', supplier: '3', salePrice: 1800, stock: 10, unit: 'kg', lowStockThreshold: 6 },
        { id: '8', name: 'Sal', category: '1', supplier: '1', salePrice: 800, stock: 3, unit: 'kg', lowStockThreshold: 5 }
    ];

    // Función para generar movimientos de demostración
    function generateDemoMovements() {
        const demoMovements = [];
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 18);
        let movementId = 1;
        for (let i = 0; i < 700; i++) {
            const randomDays = Math.floor(Math.random() * 18 * 30);
            const date = new Date(startDate);
            date.setDate(date.getDate() + randomDays);
            const product = demoProducts[Math.floor(Math.random() * demoProducts.length)];
            const type = Math.random() > 0.5 ? 'entrada' : 'salida';
            const quantity = Math.floor(Math.random() * 10) + 1;
            let notes = '';
            if (type === 'salida') {
                if (product.name === 'Harina de Trigo') notes = ['Elaboración de pan', 'Preparación de masa para pizza', 'Repostería', 'Empanizado'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Carne Molida') notes = ['Preparación de hamburguesas', 'Salsa bolognesa', 'Albóndigas', 'Tacos'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Tomates') notes = ['Preparación de ensaladas', 'Salsa de tomate', 'Guarniciones', 'Platos principales'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Coca-Cola') notes = ['Venta al cliente', 'Servicio de mesa', 'Pedido para llevar', 'Delivery'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Queso Cheddar') notes = ['Preparación de hamburguesas', 'Gratinados', 'Nachos', 'Sándwiches'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Aceite de Oliva') notes = ['Frituras', 'Aderezos para ensaladas', 'Salteados', 'Marinados'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Lechuga') notes = ['Ensaladas', 'Guarniciones', 'Hamburguesas', 'Wraps'][Math.floor(Math.random() * 4)];
                else if (product.name === 'Sal') notes = ['Condimentación general', 'Salmueras', 'Preparación de carnes', 'Panadería'][Math.floor(Math.random() * 4)];
            } else {
                notes = ['Compra semanal', 'Reposición de stock', 'Pedido especial', 'Entrega de proveedor'][Math.floor(Math.random() * 4)];
            }
            demoMovements.push({
                id: movementId.toString(),
                product: product.id,
                type,
                quantity,
                date: date.toISOString().split('T')[0],
                notes
            });
            movementId++;
        }
        return demoMovements;
    }

    // Cargar datos: siempre incluir datos demo + datos adicionales del usuario
    function loadData() {
        // Siempre cargar datos de demostración
        categories = [...demoCategories];
        suppliers = [...demoSuppliers];
        products = [...demoProducts];
        movements = generateDemoMovements();

        // Cargar datos adicionales del usuario desde localStorage
        const savedProducts = localStorage.getItem('inventory-products');
        const savedCategories = localStorage.getItem('inventory-categories');
        const savedSuppliers = localStorage.getItem('inventory-suppliers');
        const savedMovements = localStorage.getItem('inventory-movements');

        if (savedCategories) {
            const userCategories = JSON.parse(savedCategories).filter(c => !DEMO_IDS.includes(c.id));
            categories = [...categories, ...userCategories];
        }

        if (savedSuppliers) {
            const userSuppliers = JSON.parse(savedSuppliers).filter(s => !DEMO_IDS.includes(s.id));
            suppliers = [...suppliers, ...userSuppliers];
        }

        if (savedProducts) {
            const userProducts = JSON.parse(savedProducts).filter(p => !DEMO_IDS.includes(p.id));
            products = [...products, ...userProducts];
        }

        if (savedMovements) {
            const userMovements = JSON.parse(savedMovements).filter(m => parseInt(m.id) > 700);
            movements = [...movements, ...userMovements];
        }
    }

    // Inicializar datos
    loadData();

    // Mostrar mensaje
    function showMessage(message) {
        messageText.textContent = message;
        messageModal.style.display = 'block';
    }

    // Mostrar productos de una categoría
    function showProductsForCategory(categoryName) {
        const productsInCat = products.filter(p => {
            const cat = categories.find(c => c.id === p.category);
            return cat && cat.name === categoryName;
        });
        let html = '<h3>Productos en ' + categoryName + '</h3>';
        if (productsInCat.length === 0) {
            html += '<p>No hay productos en esta categoría.</p>';
        } else {
            html += '<ul>';
            productsInCat.forEach(p => {
                html += '<li>' + p.name + ' (Stock: ' + p.stock + ' ' + p.unit + ')</li>';
            });
            html += '</ul>';
        }
        document.getElementById('category-products-text').innerHTML = html;
        document.getElementById('category-products-modal').style.display = 'block';
    }

    // Mostrar productos de un nivel de stock
    function showProductsForStockLevel(level) {
        let filteredProducts;
        if (level === 'Bajo Stock') {
            filteredProducts = products.filter(p => p.stock <= p.lowStockThreshold);
        } else if (level === 'Normal') {
            filteredProducts = products.filter(p => p.stock > p.lowStockThreshold && p.stock <= p.lowStockThreshold * 2);
        } else if (level === 'Alto Stock') {
            filteredProducts = products.filter(p => p.stock > p.lowStockThreshold * 2);
        }
        let html = '<h3>Productos con ' + level + '</h3>';
        if (filteredProducts.length === 0) {
            html += '<p>No hay productos en este nivel de stock.</p>';
        } else {
            html += '<ul>';
            filteredProducts.forEach(p => {
                html += '<li>' + p.name + ' (Stock: ' + p.stock + ' ' + p.unit + ')</li>';
            });
            html += '</ul>';
        }
        document.getElementById('category-products-text').innerHTML = html;
        document.getElementById('category-products-modal').style.display = 'block';
    }

    // Mostrar detalles de un producto
    function showProductDetails(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const category = categories.find(c => c.id === product.category)?.name || 'N/A';
        const supplier = suppliers.find(s => s.id === product.supplier)?.name || 'N/A';
        const totalValue = (product.stock * product.salePrice).toFixed(2);
        let html = '<h3>Detalles del Producto</h3>';
        html += '<p><strong>Nombre:</strong> ' + product.name + '</p>';
        html += '<p><strong>Descripción:</strong> ' + (product.description || 'N/A') + '</p>';
        html += '<p><strong>Categoría:</strong> ' + category + '</p>';
        html += '<p><strong>Proveedor:</strong> ' + supplier + '</p>';
        html += '<p><strong>Stock:</strong> ' + product.stock + ' ' + product.unit + '</p>';
        html += '<p><strong>Precio de Venta:</strong> $' + product.salePrice + '</p>';
        html += '<p><strong>Valor Total en Inventario:</strong> $' + totalValue + '</p>';
        document.getElementById('category-products-text').innerHTML = html;
        document.getElementById('category-products-modal').style.display = 'block';
    }

    // Actualizar estadísticas
    function updateStats(filtered = products) {
        // Solo actualizar estadísticas detalladas si están visibles
        if (detailedStatsContainer.style.display !== 'none') {
            updateDetailedStats(filtered);
        }
    }

    // Actualizar estadísticas detalladas
    function updateDetailedStats(filtered = products) {
        const totalProducts = filtered.length;
        let totalValue = 0;
        let lowStockCount = 0;
        for (let p of filtered) {
            const stock = Number(p.stock);
            const price = Number(p.salePrice);
            totalValue += stock * price;
            if (stock <= Number(p.lowStockThreshold)) lowStockCount++;
        }
        document.getElementById('stats-total').textContent = totalProducts;
        document.getElementById('stats-value').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('stats-low-stock').textContent = lowStockCount;

        // Producto con Mayor Valor en Inventario
        let topValueProduct = null;
        let maxValue = 0;
        filtered.forEach(p => {
            const value = p.stock * p.salePrice;
            if (value > maxValue) {
                maxValue = value;
                topValueProduct = p;
            }
        });
        document.getElementById('stats-top-value-product').textContent =
            topValueProduct ? `${topValueProduct.name} ($${maxValue.toFixed(2)})` : 'N/A';

        // Categoría con Mayor Valor Total
        const categoryValues = {};
        filtered.forEach(p => {
            const catName = categories.find(c => c.id === p.category)?.name || 'Sin Categoría';
            const value = p.stock * p.salePrice;
            categoryValues[catName] = (categoryValues[catName] || 0) + value;
        });
        let topCategory = null;
        let maxCategoryValue = 0;
        for (const [cat, value] of Object.entries(categoryValues)) {
            if (value > maxCategoryValue) {
                maxCategoryValue = value;
                topCategory = cat;
            }
        }
        document.getElementById('stats-top-value-category').textContent =
            topCategory ? `${topCategory} ($${maxCategoryValue.toFixed(2)})` : 'N/A';

        // Promedio de Precio de Venta por Categoría
        const categoryPrices = {};
        const categoryCounts = {};
        filtered.forEach(p => {
            const catName = categories.find(c => c.id === p.category)?.name || 'Sin Categoría';
            categoryPrices[catName] = (categoryPrices[catName] || 0) + p.salePrice;
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        });
        let avgPriceCategory = null;
        let maxAvgPrice = 0;
        for (const [cat, totalPrice] of Object.entries(categoryPrices)) {
            const avgPrice = totalPrice / categoryCounts[cat];
            if (avgPrice > maxAvgPrice) {
                maxAvgPrice = avgPrice;
                avgPriceCategory = cat;
            }
        }
        document.getElementById('stats-avg-price-category').textContent =
            avgPriceCategory ? `${avgPriceCategory} ($${maxAvgPrice.toFixed(2)})` : 'N/A';

        // Productos con Stock Crítico (0 unidades)
        const criticalStockCount = filtered.filter(p => p.stock === 0).length;
        document.getElementById('stats-critical-stock').textContent = criticalStockCount;

        // Valor Total de Movimientos en el Último Mes
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        let monthlyMovementValue = 0;
        movements.forEach(m => {
            const movementDate = new Date(m.date);
            if (movementDate >= lastMonth) {
                const product = filtered.find(p => p.id === m.productId);
                if (product) {
                    monthlyMovementValue += m.quantity * product.salePrice;
                }
            }
        });
        document.getElementById('stats-monthly-movements').textContent = `$${monthlyMovementValue.toFixed(2)}`;

        // Proveedor con Más Productos Asignados
        const supplierCounts = {};
        filtered.forEach(p => {
            const supName = suppliers.find(s => s.id === p.supplier)?.name || 'Sin Proveedor';
            supplierCounts[supName] = (supplierCounts[supName] || 0) + 1;
        });
        let topSupplier = null;
        let maxProducts = 0;
        for (const [supplier, count] of Object.entries(supplierCounts)) {
            if (count > maxProducts) {
                maxProducts = count;
                topSupplier = supplier;
            }
        }
        document.getElementById('stats-top-supplier').textContent =
            topSupplier ? `${topSupplier} (${maxProducts} productos)` : 'N/A';
    }

    // Renderizar gráficos
    function renderCharts() {
        const categoryData = {};
        products.forEach(p => {
            const catName = categories.find(c => c.id === p.category)?.name || 'Sin Categoría';
            categoryData[catName] = (categoryData[catName] || 0) + 1;
        });
        const categoryLabels = Object.keys(categoryData);
        const categoryValues = Object.values(categoryData);

        if (categoryChartContainer.style.display !== 'none') {
            if (categoryChart) categoryChart.destroy();
            categoryChart = new Chart(document.getElementById('categoryChart'), {
                type: 'pie',
                data: {
                    labels: categoryLabels,
                    datasets: [{
                        data: categoryValues,
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.9)',
                            'rgba(118, 75, 162, 0.9)',
                            'rgba(240, 147, 251, 0.9)',
                            'rgba(245, 87, 108, 0.9)',
                            'rgba(79, 209, 196, 0.9)',
                            'rgba(237, 100, 166, 0.9)'
                        ],
                        borderColor: 'white',
                        borderWidth: 3,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Productos por Categoría',
                            font: {
                                size: 18,
                                weight: 'bold',
                                family: "'Roboto', sans-serif"
                            },
                            color: '#1e293b',
                            padding: 20
                        },
                        legend: {
                            labels: {
                                font: {
                                    size: 14,
                                    weight: '600',
                                    family: "'Roboto', sans-serif"
                                },
                                color: '#475569',
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            },
                            position: 'bottom'
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    onClick: function(event, elements) {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const category = categoryLabels[index];
                            showProductsForCategory(category);
                        }
                    },
                    onHover: function(event, elements) {
                        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        }

        const stockLevels = products.reduce((acc, p) => {
            if (p.stock <= p.lowStockThreshold) acc.low++;
            else if (p.stock > p.lowStockThreshold * 2) acc.high++;
            else acc.normal++;
            return acc;
        }, { low: 0, normal: 0, high: 0 });

        if (stockChartContainer.style.display !== 'none') {
            if (stockChart) stockChart.destroy();
            stockChart = new Chart(document.getElementById('stockChart'), {
                type: 'bar',
                data: {
                    labels: ['Bajo Stock', 'Normal', 'Alto Stock'],
                    datasets: [{
                        data: [stockLevels.low, stockLevels.normal, stockLevels.high],
                        backgroundColor: ['#e53e3e', '#ffa500', '#38a169']
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                callback: function(value) { return Number.isInteger(value) ? value : null; },
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Cantidad de productos',
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Niveles de Stock'
                        },
                        legend: {
                            display: false
                        }
                    },
                    onClick: function(event, elements) {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const stockLevels = ['Bajo Stock', 'Normal', 'Alto Stock'];
                            const level = stockLevels[index];
                            showProductsForStockLevel(level);
                        }
                    },
                    onHover: function(event, elements) {
                        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        }

        const sortedProducts = [...products].sort((a, b) => (b.stock * b.salePrice) - (a.stock * a.salePrice));
        const valueLabels = sortedProducts.map(p => p.name);
        const valueData = sortedProducts.map(p => p.stock * p.salePrice);

        if (valueChartContainer.style.display !== 'none') {
            if (valueChart) valueChart.destroy();
            valueChart = new Chart(document.getElementById('valueChart'), {
                type: 'pie',
                data: {
                    labels: valueLabels,
                    datasets: [{
                        data: valueData,
                        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c4', '#ed64a6']
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Valor del Inventario por Producto'
                        },
                        legend: {
                            labels: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    onClick: function(event, elements) {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const product = sortedProducts[index];
                            showProductDetails(product.id);
                        }
                    },
                    onHover: function(event, elements) {
                        event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
                    }
                }
            });
        }
    }

    // Renderizar gráfico de demanda temporal
    function renderDemandChart() {
        const selectedProductId = demandProductFilter.value;
        if (!selectedProductId || demandChartContainer.style.display === 'none') return;

        const selectedProduct = products.find(p => p.id === selectedProductId);
        if (!selectedProduct) return;

        // Filtrar movimientos de salida del producto seleccionado
        const productMovements = movements.filter(m => 
            m.product === selectedProductId && m.type === 'salida'
        );

        // Calcular fecha límite según el rango seleccionado
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - currentDemandMonths);

        // Filtrar por rango de fecha
        const filteredMovements = productMovements.filter(m => {
            const moveDate = new Date(m.date);
            return moveDate >= startDate && moveDate <= now;
        });

        // Agrupar por mes
        const monthlyData = {};
        filteredMovements.forEach(m => {
            const date = new Date(m.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + m.quantity;
        });

        // Generar todos los meses en el rango
        const labels = [];
        const data = [];
        const current = new Date(startDate);
        while (current <= now) {
            const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = current.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            labels.push(monthLabel);
            data.push(monthlyData[monthKey] || 0);
            current.setMonth(current.getMonth() + 1);
        }

        // Destruir gráfico anterior
        if (demandChart) demandChart.destroy();

        // Crear nuevo gráfico
        demandChart = new Chart(document.getElementById('demandChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Salidas de ${selectedProduct.name}`,
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#667eea'
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            font: { size: 11, weight: 'bold' },
                            maxRotation: 45,
                            minRotation: 45
                        },
                        title: {
                            display: true,
                            text: 'Período',
                            font: { size: 13, weight: 'bold' }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) { return Number.isInteger(value) ? value : null; },
                            font: { size: 12, weight: 'bold' }
                        },
                        title: {
                            display: true,
                            text: `Cantidad (${selectedProduct.unit})`,
                            font: { size: 13, weight: 'bold' }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Demanda Temporal - ${selectedProduct.name}`,
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 13, weight: 'bold' }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                return `Salidas: ${context.parsed.y} ${selectedProduct.unit}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Renderizar historial de movimientos
    function renderMovements(filteredMovements = movements) {
        const movementsTbody = document.getElementById('movements-tbody');
        movementsTbody.innerHTML = '';
        const sortedMovements = [...filteredMovements].sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedMovements.forEach(movement => {
            const product = products.find(p => p.id === movement.product);
            const productName = product ? product.name : 'Producto eliminado';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movement.date}</td>
                <td>${productName}</td>
                <td>${movement.type}</td>
                <td>${movement.quantity}</td>
                <td>${movement.notes || ''}</td>
            `;
            movementsTbody.appendChild(row);
        });
    }

    // Filtrar movimientos
    function filterMovements() {
        let filtered = movements.slice();
        const productFilter = filterMovementProduct.value;
        const typeFilter = filterMovementType.value;
        const fromDate = filterMovementFrom.value;
        const toDate = filterMovementTo.value;

        if (productFilter) {
            filtered = filtered.filter(m => m.product === productFilter);
        }
        if (typeFilter) {
            filtered = filtered.filter(m => m.type === typeFilter);
        }
        if (fromDate) {
            filtered = filtered.filter(m => m.date >= fromDate);
        }
        if (toDate) {
            filtered = filtered.filter(m => m.date <= toDate);
        }

        renderMovements(filtered);
    }

    // Renderizar opciones de select
    function renderSelectOptions() {
        const categorySelects = [document.getElementById('product-category'), document.getElementById('edit-category'), filterCategory];
        const supplierSelects = [document.getElementById('product-supplier'), document.getElementById('edit-supplier'), filterSupplier];
        const productSelect = document.getElementById('movement-product');
        const movementProductFilter = document.getElementById('filter-movement-product');

        categorySelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccionar Categoría</option>';
            categories.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        });

        supplierSelects.forEach(select => {
            select.innerHTML = '<option value="">Seleccionar Proveedor</option>';
            suppliers.forEach(sup => {
                select.innerHTML += `<option value="${sup.id}">${sup.name}</option>`;
            });
        });

        productSelect.innerHTML = '<option value="">Seleccionar Producto</option>';
        movementProductFilter.innerHTML = '<option value="">Todos los Productos</option>';
        products.forEach(prod => {
            productSelect.innerHTML += `<option value="${prod.id}">${prod.name}</option>`;
            movementProductFilter.innerHTML += `<option value="${prod.id}">${prod.name}</option>`;
        });

        // Reset filter values to avoid filtering with old IDs
        filterCategory.value = "";
        filterSupplier.value = "";
        filterStock.value = "";
        filterMinPrice.value = "";
        filterMaxPrice.value = "";
    }

    // Renderizar tabla
    function renderTable(filteredProducts = products) {
        productsTable.innerHTML = '';
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            if (product.stock <= product.lowStockThreshold) {
                row.classList.add('low-stock');
            } else if (product.stock > product.lowStockThreshold && product.stock <= product.lowStockThreshold * 2) {
                row.classList.add('normal-stock');
            }
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${categories.find(c => c.id === product.category)?.name || 'N/A'}</td>
                <td>${suppliers.find(s => s.id === product.supplier)?.name || 'N/A'}</td>
                <td>${product.stock} ${product.unit}</td>
                <td>$${product.salePrice.toFixed(2)}</td>
                <td>$${(product.stock * product.salePrice).toFixed(2)}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${product.id}" title="Editar">✏️</button>
                    <button class="delete-btn" data-id="${product.id}" title="Eliminar">🗑️</button>
                </td>
            `;
            productsTable.appendChild(row);
        });
    }

    // Filtrar productos
    function filterProducts() {
        let filtered = products.slice();
        const searchTerm = searchInput.value.toLowerCase();
        const catFilter = filterCategory.value;
        const supFilter = filterSupplier.value;
        const stockFilter = filterStock.value;
        const minPrice = parseFloat(filterMinPrice.value) || 0;
        const maxPrice = parseFloat(filterMaxPrice.value) || Infinity;

        if (searchTerm) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
        }
        if (catFilter) {
            filtered = filtered.filter(p => p.category === catFilter);
        }
        if (supFilter) {
            filtered = filtered.filter(p => p.supplier === supFilter);
        }
        if (stockFilter) {
            filtered = filtered.filter(p => {
                if (stockFilter === 'low') return p.stock <= p.lowStockThreshold;
                if (stockFilter === 'normal') return p.stock > p.lowStockThreshold && p.stock <= p.lowStockThreshold * 2;
                if (stockFilter === 'high') return p.stock > p.lowStockThreshold * 2;
                return true;
            });
        }
        filtered = filtered.filter(p => p.salePrice >= minPrice && p.salePrice <= maxPrice);

        renderTable(filtered);
        updateStats(filtered);
    }

    // Agregar producto
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('product-name').value.trim();
        const description = document.getElementById('product-description').value.trim();
        const category = document.getElementById('product-category').value;
        const supplier = document.getElementById('product-supplier').value;
        const purchasePrice = parseFloat(document.getElementById('purchase-price').value.replace(',', '.'));
        const salePrice = parseFloat(document.getElementById('sale-price').value.replace(',', '.'));
        const stock = parseInt(document.getElementById('initial-stock').value);
        const unit = document.getElementById('unit').value.trim();
        const threshold = parseInt(document.getElementById('low-stock-threshold').value);

        if (!name || !category || !supplier || purchasePrice < 0 || salePrice < 0 || stock < 0 || !unit) {
            showMessage('Todos los campos son obligatorios y válidos.');
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            description,
            category,
            supplier,
            purchasePrice,
            salePrice,
            stock,
            unit,
            lowStockThreshold: threshold
        };
        products.push(newProduct);
        saveData();
        productForm.reset();
        renderSelectOptions();
        filterProducts();
        renderCharts();
        showMessage('Producto agregado correctamente.');
        productModal.style.display = 'none';
        productForm.reset();
    });

    // Abrir modal agregar producto
    addProductBtn.addEventListener('click', () => {
        productModal.style.display = 'block';
    });

    // Cancelar agregar producto
    document.getElementById('cancel-product').addEventListener('click', () => {
        productModal.style.display = 'none';
        productForm.reset();
    });

    // Editar producto
    productsTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const id = e.target.dataset.id;
            const product = products.find(p => p.id === id);
            if (product) {
                currentEditId = id;
                document.getElementById('edit-name').value = product.name;
                document.getElementById('edit-description').value = product.description;
                document.getElementById('edit-category').value = product.category;
                document.getElementById('edit-supplier').value = product.supplier;
                document.getElementById('edit-purchase-price').value = product.purchasePrice;
                document.getElementById('edit-sale-price').value = product.salePrice;
                document.getElementById('edit-stock').value = product.stock;
                document.getElementById('edit-unit').value = product.unit;
                document.getElementById('edit-threshold').value = product.lowStockThreshold;
                editModal.style.display = 'block';
            }
        } else if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('¿Eliminar este producto?')) {
                products = products.filter(p => p.id !== id);
                saveData();
                filterProducts();
                renderCharts();
                showMessage('Producto eliminado.');
            }
        }
    });

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = products.find(p => p.id === currentEditId);
        if (!product) return;

        product.name = document.getElementById('edit-name').value.trim();
        product.description = document.getElementById('edit-description').value.trim();
        product.category = document.getElementById('edit-category').value;
        product.supplier = document.getElementById('edit-supplier').value;
        product.purchasePrice = parseFloat(document.getElementById('edit-purchase-price').value.replace(',', '.'));
        product.salePrice = parseFloat(document.getElementById('edit-sale-price').value.replace(',', '.'));
        product.stock = parseInt(document.getElementById('edit-stock').value);
        product.unit = document.getElementById('edit-unit').value.trim();
        product.lowStockThreshold = parseInt(document.getElementById('edit-threshold').value);

        saveData();
        editModal.style.display = 'none';
        filterProducts();
        renderCharts();
        showMessage('Producto actualizado.');
    });

    // Agregar categoría
    addCategoryBtn.addEventListener('click', () => {
        categoryModal.style.display = 'block';
    });
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('category-name').value.trim();
        if (!name) return;
        categories.push({ id: Date.now().toString(), name });
        saveData();
        renderSelectOptions();
        categoryForm.reset();
        categoryModal.style.display = 'none';
        showMessage('Categoría agregada.');
    });

    // Agregar proveedor
    addSupplierBtn.addEventListener('click', () => {
        supplierModal.style.display = 'block';
    });
    supplierForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('supplier-name').value.trim();
        const contact = document.getElementById('supplier-contact').value.trim();
        if (!name) return;
        suppliers.push({ id: Date.now().toString(), name, contact });
        saveData();
        renderSelectOptions();
        supplierForm.reset();
        supplierModal.style.display = 'none';
        showMessage('Proveedor agregado.');
    });

    // Registrar movimiento
    addMovementBtn.addEventListener('click', () => {
        movementModal.style.display = 'block';
    });
    movementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productId = document.getElementById('movement-product').value;
        const type = document.getElementById('movement-type').value;
        const quantity = parseInt(document.getElementById('movement-quantity').value);
        const date = document.getElementById('movement-date').value;
        const notes = document.getElementById('movement-notes').value.trim();

        const product = products.find(p => p.id === productId);
        if (!product || !type || !quantity || !date) return;

        if (type === 'salida' && product.stock < quantity) {
            showMessage('Stock insuficiente.');
            return;
        }

        if (type === 'entrada') product.stock += quantity;
        else if (type === 'salida') product.stock -= quantity;
        else product.stock = quantity; // ajuste

        movements.push({ id: Date.now().toString(), product: productId, type, quantity, date, notes });
        saveData();
        movementForm.reset();
        movementModal.style.display = 'none';
        filterProducts();
        renderCharts();
        filterMovements(); // Re-render movements with current filters
        showMessage('Movimiento registrado.');
    });

    // Exportar a Excel
    exportBtn.addEventListener('click', async () => {
        // Mostrar gráficos temporalmente para capturar
        const wasCategoryVisible = categoryChartContainer.style.display !== 'none';
        const wasStockVisible = stockChartContainer.style.display !== 'none';
        const wasValueVisible = valueChartContainer.style.display !== 'none';
        categoryChartContainer.style.display = 'block';
        stockChartContainer.style.display = 'block';
        valueChartContainer.style.display = 'block';
        renderCharts();
        await new Promise(resolve => setTimeout(resolve, 500)); // Esperar render

        const workbook = new ExcelJS.Workbook();

        // Hoja de Productos
        const productSheet = workbook.addWorksheet('Productos');
        productSheet.columns = [
            { header: 'Nombre', key: 'name' },
            { header: 'Descripción', key: 'description' },
            { header: 'Categoría', key: 'category' },
            { header: 'Proveedor', key: 'supplier' },
            { header: 'Precio Compra', key: 'purchasePrice' },
            { header: 'Precio Venta', key: 'salePrice' },
            { header: 'Stock', key: 'stock' },
            { header: 'Unidad', key: 'unit' },
            { header: 'Umbral Bajo', key: 'lowStockThreshold' }
        ];
        products.forEach(p => {
            productSheet.addRow({
                name: p.name,
                description: p.description,
                category: categories.find(c => c.id === p.category)?.name || '',
                supplier: suppliers.find(s => s.id === p.supplier)?.name || '',
                purchasePrice: p.purchasePrice,
                salePrice: p.salePrice,
                stock: p.stock,
                unit: p.unit,
                lowStockThreshold: p.lowStockThreshold
            });
        });

        // Hoja de Estadísticas
        const statsSheet = workbook.addWorksheet('Estadísticas');
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + (p.stock * p.salePrice), 0);
        const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

        // Calcular estadísticas detalladas
        let topValueProduct = null;
        let maxValue = 0;
        products.forEach(p => {
            const value = p.stock * p.salePrice;
            if (value > maxValue) {
                maxValue = value;
                topValueProduct = p;
            }
        });

        const categoryValues = {};
        products.forEach(p => {
            const catName = categories.find(c => c.id === p.category)?.name || 'Sin Categoría';
            const value = p.stock * p.salePrice;
            categoryValues[catName] = (categoryValues[catName] || 0) + value;
        });
        let topCategory = null;
        let maxCategoryValue = 0;
        for (const [cat, value] of Object.entries(categoryValues)) {
            if (value > maxCategoryValue) {
                maxCategoryValue = value;
                topCategory = cat;
            }
        }

        const categoryPrices = {};
        const categoryCounts = {};
        products.forEach(p => {
            const catName = categories.find(c => c.id === p.category)?.name || 'Sin Categoría';
            categoryPrices[catName] = (categoryPrices[catName] || 0) + p.salePrice;
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        });
        let avgPriceCategory = null;
        let maxAvgPrice = 0;
        for (const [cat, totalPrice] of Object.entries(categoryPrices)) {
            const avgPrice = totalPrice / categoryCounts[cat];
            if (avgPrice > maxAvgPrice) {
                maxAvgPrice = avgPrice;
                avgPriceCategory = cat;
            }
        }

        const criticalStockCount = products.filter(p => p.stock === 0).length;

        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        let monthlyMovementValue = 0;
        movements.forEach(m => {
            const movementDate = new Date(m.date);
            if (movementDate >= lastMonth) {
                const product = products.find(p => p.id === m.productId);
                if (product) {
                    monthlyMovementValue += m.quantity * product.salePrice;
                }
            }
        });

        const supplierCounts = {};
        products.forEach(p => {
            const supName = suppliers.find(s => s.id === p.supplier)?.name || 'Sin Proveedor';
            supplierCounts[supName] = (supplierCounts[supName] || 0) + 1;
        });
        let topSupplier = null;
        let maxProducts = 0;
        for (const [supplier, count] of Object.entries(supplierCounts)) {
            if (count > maxProducts) {
                maxProducts = count;
                topSupplier = supplier;
            }
        }

        statsSheet.addRow(['ESTADÍSTICAS DEL INVENTARIO']);
        statsSheet.addRow(['']);
        statsSheet.addRow(['Total de Productos', totalProducts]);
        statsSheet.addRow(['Valor Total del Inventario', `$${totalValue.toFixed(2)}`]);
        statsSheet.addRow(['Productos con Bajo Stock', lowStockCount]);
        statsSheet.addRow(['Producto con Mayor Valor', topValueProduct ? `${topValueProduct.name} ($${maxValue.toFixed(2)})` : 'N/A']);
        statsSheet.addRow(['Categoría con Mayor Valor', topCategory ? `${topCategory} ($${maxCategoryValue.toFixed(2)})` : 'N/A']);
        statsSheet.addRow(['Promedio Precio por Categoría', avgPriceCategory ? `${avgPriceCategory} ($${maxAvgPrice.toFixed(2)})` : 'N/A']);
        statsSheet.addRow(['Valor Movimientos Último Mes', `$${monthlyMovementValue.toFixed(2)}`]);
        statsSheet.addRow(['Productos sin Stock', criticalStockCount]);
        statsSheet.addRow(['Proveedor con Más Productos', topSupplier ? `${topSupplier} (${maxProducts} productos)` : 'N/A']);

        // Hoja de Movimientos
        const movementsSheet = workbook.addWorksheet('Movimientos');
        movementsSheet.columns = [
            { header: 'Fecha', key: 'date' },
            { header: 'Producto', key: 'product' },
            { header: 'Tipo', key: 'type' },
            { header: 'Cantidad', key: 'quantity' },
            { header: 'Notas', key: 'notes' }
        ];
        const sortedMovements = [...movements].sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedMovements.forEach(movement => {
            const product = products.find(p => p.id === movement.product);
            movementsSheet.addRow({
                date: movement.date,
                product: product ? product.name : 'Producto eliminado',
                type: movement.type === 'entrada' ? 'Entrada' : movement.type === 'salida' ? 'Salida' : 'Ajuste',
                quantity: movement.quantity,
                notes: movement.notes || ''
            });
        });

        // Hoja de Gráficos
        const chartSheet = workbook.addWorksheet('Gráficos');
        let imageId1, imageId2, imageId3;
        if (categoryChart) {
            const categoryImage = categoryChart.canvas.toDataURL('image/png').split(',')[1];
            imageId1 = workbook.addImage({ base64: categoryImage, extension: 'png' });
            chartSheet.addImage(imageId1, 'A1:D15');
            chartSheet.getCell('A16').value = 'Gráfico de Categorías';
        }
        if (stockChart) {
            const stockImage = stockChart.canvas.toDataURL('image/png').split(',')[1];
            imageId2 = workbook.addImage({ base64: stockImage, extension: 'png' });
            chartSheet.addImage(imageId2, 'A18:D32');
            chartSheet.getCell('A33').value = 'Gráfico de Niveles de Stock';
        }
        if (valueChart) {
            const valueImage = valueChart.canvas.toDataURL('image/png').split(',')[1];
            imageId3 = workbook.addImage({ base64: valueImage, extension: 'png' });
            chartSheet.addImage(imageId3, 'A35:D49');
            chartSheet.getCell('A50').value = 'Gráfico de Valor por Producto';
        }

        // Generar y descargar
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'inventario.xlsx';
        link.click();

        // Restaurar visibilidad
        categoryChartContainer.style.display = wasCategoryVisible ? 'block' : 'none';
        stockChartContainer.style.display = wasStockVisible ? 'block' : 'none';
        valueChartContainer.style.display = wasValueVisible ? 'block' : 'none';
    });

    // Eventos de filtros
    searchInput.addEventListener('input', filterProducts);
    filterCategory.addEventListener('change', filterProducts);
    filterSupplier.addEventListener('change', filterProducts);
    filterStock.addEventListener('change', filterProducts);
    filterMinPrice.addEventListener('input', filterProducts);
    filterMaxPrice.addEventListener('input', filterProducts);

    // Evento limpiar filtros
    document.getElementById('clear-filters').addEventListener('click', () => {
        searchInput.value = '';
        filterCategory.value = '';
        filterSupplier.value = '';
        filterStock.value = '';
        filterMinPrice.value = '';
        filterMaxPrice.value = '';
        filterProducts();
    });

    // Cerrar modales
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            editModal.style.display = 'none';
            categoryModal.style.display = 'none';
            supplierModal.style.display = 'none';
            movementModal.style.display = 'none';
            document.getElementById('category-products-modal').style.display = 'none';
            productModal.style.display = 'none';
        });
    });
    document.querySelector('.message-close').addEventListener('click', () => {
        messageModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === messageModal) messageModal.style.display = 'none';
        if (e.target === document.getElementById('category-products-modal')) document.getElementById('category-products-modal').style.display = 'none';
    });

    // Evento toggle gráfico de categorías
    toggleCategoryChart.addEventListener('click', () => {
        const isVisible = categoryChartContainer.style.display !== 'none';
        categoryChartContainer.style.display = isVisible ? 'none' : 'block';
        toggleCategoryChart.textContent = isVisible ? 'Ver Gráfico de Categorías' : 'Ocultar Gráfico de Categorías';
        if (!isVisible) {
            renderCharts(); // Renderizar solo cuando se muestra
        }
    });

    // Evento toggle gráfico de niveles de stock
    toggleStockChart.addEventListener('click', () => {
        const isVisible = stockChartContainer.style.display !== 'none';
        stockChartContainer.style.display = isVisible ? 'none' : 'block';
        toggleStockChart.textContent = isVisible ? 'Ver Gráfico de Niveles de Stock' : 'Ocultar Gráfico de Niveles de Stock';
        if (!isVisible) {
            renderCharts(); // Renderizar solo cuando se muestra
        }
    });

    // Evento toggle gráfico de valor por producto
    toggleValueChart.addEventListener('click', () => {
        const isVisible = valueChartContainer.style.display !== 'none';
        valueChartContainer.style.display = isVisible ? 'none' : 'block';
        toggleValueChart.textContent = isVisible ? 'Ver Gráfico de Valor por Producto' : 'Ocultar Gráfico de Valor por Producto';
        if (!isVisible) {
            renderCharts(); // Renderizar solo cuando se muestra
        }
    });

    // Evento toggle gráfico de demanda temporal
    toggleDemandChart.addEventListener('click', () => {
        const isVisible = demandChartContainer.style.display !== 'none';
        demandChartContainer.style.display = isVisible ? 'none' : 'block';
        toggleDemandChart.textContent = isVisible ? 'Ver Gráfico de Demanda Temporal' : 'Ocultar Gráfico de Demanda Temporal';
        if (!isVisible) {
            // Poblar selector de productos
            demandProductFilter.innerHTML = '<option value="">Seleccionar producto</option>';
            products.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.name;
                demandProductFilter.appendChild(option);
            });
            // Seleccionar primer producto por defecto si hay productos
            if (products.length > 0) {
                demandProductFilter.value = products[0].id;
                renderDemandChart();
            }
        }
    });

    // Evento cambio de producto en gráfico de demanda
    demandProductFilter.addEventListener('change', () => {
        renderDemandChart();
    });

    // Eventos para botones de rango temporal
    document.querySelectorAll('.time-range-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remover clase active de todos los botones
            document.querySelectorAll('.time-range-btn').forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            e.target.classList.add('active');
            // Actualizar rango y re-renderizar
            currentDemandMonths = parseInt(e.target.dataset.months);
            renderDemandChart();
        });
    });

    // Evento toggle historial de movimientos
    // Mostrar la tabla de movimientos al inicio
    movementsContainer.style.display = 'block';
    filterMovements();

    toggleMovements.addEventListener('click', () => {
        const isVisible = movementsContainer.style.display !== 'none';
        movementsContainer.style.display = isVisible ? 'none' : 'block';
        toggleMovements.textContent = isVisible ? 'Ver Historial de Movimientos' : 'Ocultar Historial de Movimientos';
        if (!isVisible) {
            filterMovements(); // Renderizar solo cuando se muestra
        }
    });

    // Evento toggle estadísticas detalladas
    toggleDetailedStats.addEventListener('click', () => {
        const isVisible = detailedStatsContainer.style.display !== 'none';
        detailedStatsContainer.style.display = isVisible ? 'none' : 'block';
        toggleDetailedStats.textContent = isVisible ? 'Ver Todas las Estadísticas' : 'Ocultar Estadísticas';
        if (!isVisible) {
            updateDetailedStats(); // Calcular estadísticas solo cuando se muestra
        }
    });

    // Inicializar texto del botón de estadísticas
    toggleDetailedStats.textContent = 'Ocultar Estadísticas';

    // Eventos de filtros de movimientos
    filterMovementProduct.addEventListener('change', filterMovements);
    filterMovementType.addEventListener('change', filterMovements);
    filterMovementFrom.addEventListener('change', filterMovements);
    filterMovementTo.addEventListener('change', filterMovements);

    // Evento limpiar filtros de movimientos
    clearMovementFilters.addEventListener('click', () => {
        filterMovementProduct.value = '';
        filterMovementType.value = '';
        filterMovementFrom.value = '';
        filterMovementTo.value = '';
        filterMovements();
    });

    // Cerrar modales con tecla Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            editModal.style.display = 'none';
            categoryModal.style.display = 'none';
            supplierModal.style.display = 'none';
            movementModal.style.display = 'none';
            messageModal.style.display = 'none';
            document.getElementById('category-products-modal').style.display = 'none';
            productModal.style.display = 'none';
        }
    });

    // Inicializar
    renderSelectOptions();
    filterProducts();
    renderCharts();
    
    // Inicializar textos de botones de gráficos (ya visibles)
    toggleCategoryChart.textContent = 'Ocultar Gráfico de Categorías';
    toggleStockChart.textContent = 'Ocultar Gráfico de Niveles de Stock';
    toggleValueChart.textContent = 'Ocultar Gráfico de Valor por Producto';
    toggleDemandChart.textContent = 'Ocultar Gráfico de Demanda Temporal';
    
    // Poblar selector de productos en gráfico de demanda
    demandProductFilter.innerHTML = '<option value="">Seleccionar producto</option>';
    products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        demandProductFilter.appendChild(option);
    });
    // Seleccionar primer producto por defecto
    if (products.length > 0) {
        demandProductFilter.value = products[0].id;
        renderDemandChart();
    }

    // Manejo del modal de tutorial
    const tutorialModal = document.getElementById('tutorial-modal');
    const tutorialClose = document.getElementById('tutorial-close');
    const startDemo = document.getElementById('start-demo');

    // Tutorial slider functionality
    const steps = document.querySelectorAll('.step');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    let currentStep = 0;
    
    // Initialize: hide prev arrow on first step
    prevBtn.style.display = 'none';

    // Agregar blur al cargar página con tutorial abierto
    if (tutorialModal && tutorialModal.style.display === 'block') {
        document.body.classList.add('tutorial-active');
    }

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.remove('active');
            indicators[i].classList.remove('active');
        });
        steps[index].classList.add('active');
        indicators[index].classList.add('active');
        currentStep = index;
        
        // Hide/show arrows based on position
        if (currentStep === 0) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
        }
        
        if (currentStep === steps.length - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showStep(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (tutorialModal && tutorialModal.style.display === 'block') {
            if (e.key === 'ArrowLeft' && currentStep > 0) {
                showStep(currentStep - 1);
            } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            }
        }
    });

    tutorialClose.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
        document.body.classList.remove('tutorial-active');
    });

    startDemo.addEventListener('click', () => {
        tutorialModal.style.display = 'none';
        document.body.classList.remove('tutorial-active');
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (tutorialModal && tutorialModal.style.display === 'block') {
                tutorialModal.style.display = 'none';
                document.body.classList.remove('tutorial-active');
            }
            if (editModal && editModal.style.display === 'block') {
                editModal.style.display = 'none';
            }
            if (categoryModal && categoryModal.style.display === 'block') {
                categoryModal.style.display = 'none';
            }
            if (supplierModal && supplierModal.style.display === 'block') {
                supplierModal.style.display = 'none';
            }
            if (movementModal && movementModal.style.display === 'block') {
                movementModal.style.display = 'none';
            }
            if (productModal && productModal.style.display === 'block') {
                productModal.style.display = 'none';
            }
        }
    });
});