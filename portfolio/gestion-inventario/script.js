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
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');

    // Datos
    let products = JSON.parse(localStorage.getItem('inventory-products')) || [];
    let categories = JSON.parse(localStorage.getItem('inventory-categories')) || [];
    let suppliers = JSON.parse(localStorage.getItem('inventory-suppliers')) || [];
    let movements = JSON.parse(localStorage.getItem('inventory-movements')) || [];
    let currentEditId = null;

    // Gráficos
    let categoryChart, stockChart, valueChart;

    // Funciones de guardado
    function saveData() {
        localStorage.setItem('inventory-products', JSON.stringify(products));
        localStorage.setItem('inventory-categories', JSON.stringify(categories));
        localStorage.setItem('inventory-suppliers', JSON.stringify(suppliers));
        localStorage.setItem('inventory-movements', JSON.stringify(movements));
    }

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
                        backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4fd1c4', '#ed64a6']
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Productos por Categoría'
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

    // Renderizar opciones de select
    function renderSelectOptions() {
        const categorySelects = [document.getElementById('product-category'), document.getElementById('edit-category'), filterCategory];
        const supplierSelects = [document.getElementById('product-supplier'), document.getElementById('edit-supplier'), filterSupplier];
        const productSelect = document.getElementById('movement-product');

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
        products.forEach(prod => {
            productSelect.innerHTML += `<option value="${prod.id}">${prod.name}</option>`;
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
            if (product.stock <= product.lowStockThreshold) row.classList.add('low-stock');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${categories.find(c => c.id === product.category)?.name || 'N/A'}</td>
                <td>${suppliers.find(s => s.id === product.supplier)?.name || 'N/A'}</td>
                <td>${product.stock} ${product.unit}</td>
                <td>$${product.salePrice.toFixed(2)}</td>
                <td>$${(product.stock * product.salePrice).toFixed(2)}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}">Editar</button>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
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

        movements.push({ id: Date.now().toString(), productId, type, quantity, date, notes });
        saveData();
        movementForm.reset();
        movementModal.style.display = 'none';
        filterProducts();
        renderCharts();
        showMessage('Movimiento registrado.');
    });

    // Exportar a CSV
    exportBtn.addEventListener('click', () => {
        const csv = Papa.unparse(products.map(p => ({
            Nombre: p.name,
            Descripción: p.description,
            Categoría: categories.find(c => c.id === p.category)?.name || '',
            Proveedor: suppliers.find(s => s.id === p.supplier)?.name || '',
            'Precio Compra': p.purchasePrice,
            'Precio Venta': p.salePrice,
            Stock: p.stock,
            Unidad: p.unit,
            'Umbral Bajo': p.lowStockThreshold
        })));
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'inventario.csv';
        link.click();
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
});