// Mock data for inventory
let inventory = [
    { id: 1, name: "Paracetamol", stock: 50, expiry: "2025-10-10", status: "Available", shipmentStatus: "Delivered", lastUpdated: "2024-09-20", temperature: 22, humidity: 45 },
    { id: 2, name: "Ibuprofen", stock: 5, expiry: "2023-12-31", status: "Low Stock", shipmentStatus: "In Transit", lastUpdated: "2024-09-25", temperature: 23, humidity: 40 },
    { id: 3, name: "Amoxicillin", stock: 12, expiry: "2024-01-15", status: "Available", shipmentStatus: "Preparing", lastUpdated: "2024-09-21", temperature: 21, humidity: 42 }
];

// Mock data for vendors
let vendors = [
    { id: 1, name: "ABC Pharma", lastOrder: "2024-09-15", orderStatus: "Delivered", deliveryDate: "2024-09-20", rating: 4.5 },
    { id: 2, name: "Health Corp", lastOrder: "2024-09-10", orderStatus: "In Transit", deliveryDate: "2024-10-01", rating: 4.2 }
];

// User authentication
let users = [];

// DOM Elements
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const fullLogo = document.getElementById('full-logo');
const shortLogo = document.getElementById('short-logo');
const themeToggle = document.getElementById('theme-toggle');
const sidebarToggle = document.getElementById('sidebar-toggle');

// Render Inventory Table
const renderInventory = () => {
    const tableBody = document.querySelector('#inventory-table tbody');
    tableBody.innerHTML = '';
    let totalStock = 0;
    let lowStockCount = 0;
    let expiredDrugs = 0;

    inventory.forEach(drug => {
        const expiryDate = new Date(drug.expiry);
        const today = new Date();

        if (drug.stock < 10) lowStockCount++;
        if (expiryDate < today) expiredDrugs++;
        totalStock += drug.stock;

        tableBody.innerHTML += `
            <tr>
                <td>${drug.name}</td>
                <td>${drug.stock}</td>
                <td>${drug.expiry}</td>
                <td>${drug.status}</td>
                <td>${drug.shipmentStatus}</td>
                <td>${drug.temperature}°C / ${drug.humidity}%</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editDrug(${drug.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteDrug(${drug.id})">Delete</button>
                    <button class="action-btn order-btn" onclick="orderDrug(${drug.id})">Order</button>
                </td>
            </tr>
        `;
    });

    document.getElementById('total-stock').textContent = totalStock;
    document.getElementById('low-stock-count').textContent = lowStockCount;
    document.getElementById('expired-drugs').textContent = expiredDrugs;
};

// Render Vendor Table
const renderVendors = () => {
    const tableBody = document.querySelector('#vendor-table tbody');
    tableBody.innerHTML = '';

    vendors.forEach(vendor => {
        tableBody.innerHTML += `
            <tr>
                <td>${vendor.name}</td>
                <td>${vendor.lastOrder}</td>
                <td>${vendor.orderStatus}</td>
                <td>${vendor.deliveryDate}</td>
                <td>${vendor.rating}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editVendor(${vendor.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteVendor(${vendor.id})">Delete</button>
                    <button class="action-btn contact-btn" onclick="contactVendor(${vendor.id})">Contact</button>
                </td>
            </tr>
        `;
    });
};

// Render Tracking Table
const renderTracking = () => {
    const tableBody = document.querySelector('#tracking-table tbody');
    tableBody.innerHTML = '';

    inventory.forEach(drug => {
        tableBody.innerHTML += `
            <tr>
                <td>${drug.name}</td>
                <td>${drug.status}</td>
                <td>${drug.stock}</td>
                <td>${drug.shipmentStatus}</td>
                <td>${drug.lastUpdated}</td>
                <td><div class="progress-bar"><div style="width: ${getShipmentProgress(drug.shipmentStatus)}%"></div></div></td>
            </tr>
        `;
    });
};

// Get shipment progress percentage
const getShipmentProgress = (status) => {
    switch (status) {
        case 'Preparing': return 25;
        case 'In Transit': return 50;
        case 'Out for Delivery': return 75;
        case 'Delivered': return 100;
        default: return 0;
    }
};

// Toggle Theme
const toggleTheme = () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const themeIcon = document.getElementById('theme-icon');
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        themeIcon.style.color = '#f1c40f';
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        themeIcon.style.color = '#f39c12';
    }
};

// Sidebar Toggle
const toggleSidebar = () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    if (sidebar.classList.contains('collapsed')) {
        fullLogo.style.display = 'none';
        shortLogo.style.display = 'block';
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
    } else {
        fullLogo.style.display = 'block';
        shortLogo.style.display = 'none';
        sidebarToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
    }
};

// Render Reports Chart
const renderChart = () => {
    const ctx = document.getElementById('reports-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: inventory.map(drug => drug.name),
            datasets: [{
                label: 'Stock Levels',
                data: inventory.map(drug => drug.stock),
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

// Render Temperature Chart
const renderTemperatureChart = () => {
    const ctx = document.getElementById('temperature-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: inventory.map(drug => drug.name),
            datasets: [{
                label: 'Temperature (°C)',
                data: inventory.map(drug => drug.temperature),
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1
            },
            {
                label: 'Humidity (%)',
                data: inventory.map(drug => drug.humidity),
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
};

// Initialize App
const initApp = () => {
    renderInventory();
    renderVendors();
    renderTracking();
    renderChart();
    renderTemperatureChart();
};

// User Authentication
const signUp = (username, password) => {
    if (users.some(user => user.username === username)) {
        showNotification('Username already exists. Please choose a different one.', 'error');
        return false;
    }
    users.push({ username, password });
    showNotification('Sign up successful! You can now log in.', 'success');
    return true;
};

const login = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        showNotification('Login successful!', 'success');
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'index.html';
        return true;
    } else {
        showNotification('Invalid username or password.', 'error');
        return false;
    }
};

const logout = () => {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
};

// Check if user is logged in
const checkAuth = () => {
    const loggedIn = localStorage.getItem('loggedIn');
    if (!loggedIn && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }
};

// Show notification
const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Add/Edit Drug Modal
const showDrugModal = (drug = null) => {
    const modal = document.getElementById('drug-modal');
    const form = document.getElementById('drug-form');
    modal.style.display = 'block';

    if (drug) {
        document.getElementById('drug-id').value = drug.id;
        document.getElementById('drug-name').value = drug.name;
        document.getElementById('drug-stock').value = drug.stock;
        document.getElementById('drug-expiry').value = drug.expiry;
        document.getElementById('drug-status').value = drug.status;
        document.getElementById('drug-shipment').value = drug.shipmentStatus;
    } else {
        form.reset();
        document.getElementById('drug-id').value = '';
    }
};

// Add/Edit Vendor Modal
const showVendorModal = (vendor = null) => {
    const modal = document.getElementById('vendor-modal');
    const form = document.getElementById('vendor-form');
    modal.style.display = 'block';

    if (vendor) {
        document.getElementById('vendor-id').value = vendor.id;
        document.getElementById('vendor-name').value = vendor.name;
        document.getElementById('vendor-last-order').value = vendor.lastOrder;
        document.getElementById('vendor-order-status').value = vendor.orderStatus;
        document.getElementById('vendor-delivery-date').value = vendor.deliveryDate;
        document.getElementById('vendor-rating').value = vendor.rating;
    } else {
        form.reset();
        document.getElementById('vendor-id').value = '';
    }
};

// Close Modal
const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
};

// Save Drug
const saveDrug = (event) => {
    event.preventDefault();
    const form = document.getElementById('drug-form');
    const id = document.getElementById('drug-id').value;
    const newDrug = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('drug-name').value,
        stock: parseInt(document.getElementById('drug-stock').value),
        expiry: document.getElementById('drug-expiry').value,
        status: document.getElementById('drug-status').value,
        shipmentStatus: document.getElementById('drug-shipment').value,
        lastUpdated: new Date().toISOString().split('T')[0],
        temperature: Math.floor(Math.random() * 5) + 20,
        humidity: Math.floor(Math.random() * 10) + 40
    };

    if (id) {
        const index = inventory.findIndex(drug => drug.id === parseInt(id));
        inventory[index] = newDrug;
    } else {
        inventory.push(newDrug);
    }

    closeModal('drug-modal');
    renderInventory();
    showNotification('Drug saved successfully!', 'success');
};

// Save Vendor
const saveVendor = (event) => {
    event.preventDefault();
    const form = document.getElementById('vendor-form');
    const id = document.getElementById('vendor-id').value;
    const newVendor = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('vendor-name').value,
        lastOrder: document.getElementById('vendor-last-order').value,
        orderStatus: document.getElementById('vendor-order-status').value,
        deliveryDate: document.getElementById('vendor-delivery-date').value,
        rating: parseFloat(document.getElementById('vendor-rating').value)
    };

    if (id) {
        const index = vendors.findIndex(vendor => vendor.id === parseInt(id));
        vendors[index] = newVendor;
    } else {
        vendors.push(newVendor);
    }

    closeModal('vendor-modal');
    renderVendors();
    showNotification('Vendor saved successfully!', 'success');
};

// Edit Drug
const editDrug = (id) => {
    const drug = inventory.find(drug => drug.id === id);
    if (drug) {
        showDrugModal(drug);
    }
};

// Edit Vendor
const editVendor = (id) => {
    const vendor = vendors.find(vendor => vendor.id === id);
    if (vendor) {
        showVendorModal(vendor);
    }
};

// Delete Drug
const deleteDrug = (id) => {
    if (confirm('Are you sure you want to delete this drug?')) {
        inventory = inventory.filter(drug => drug.id !== id);
        renderInventory();
        showNotification('Drug deleted successfully!', 'success');
    }
};

// Delete Vendor
const deleteVendor = (id) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
        vendors = vendors.filter(vendor => vendor.id !== id);
        renderVendors();
        showNotification('Vendor deleted successfully!', 'success');
    }
};

// Order Drug
const orderDrug = (id) => {
    const drug = inventory.find(drug => drug.id === id);
    if (drug) {
        drug.stock += 10;
        drug.shipmentStatus = 'In Transit';
        drug.lastUpdated = new Date().toISOString().split('T')[0];
        renderInventory();
        showNotification(`Ordered 10 units of ${drug.name}. New stock: ${drug.stock}`, 'success');
    }
};

// Contact Vendor
const contactVendor = (id) => {
    const vendor = vendors.find(vendor => vendor.id === id);
    if (vendor) {
        showNotification(`Contacting ${vendor.name}...`, 'info');
        // Here you would typically integrate with a messaging or email system
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'login.html' || currentPage === '') {
        const signupForm = document.getElementById('signup');
        const loginForm = document.getElementById('login');
        const switchToLoginLink = document.getElementById('switch-to-login');
        const switchToSignupLink = document.getElementById('switch-to-signup');

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;
            if (signUp(username, password)) {
                document.getElementById('signup-form').classList.add('hidden');
                document.getElementById('login-form').classList.remove('hidden');
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            login(username, password);
        });

        switchToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signup-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });

        switchToSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('signup-form').classList.remove('hidden');
        });
    } else if (currentPage === 'index.html') {
        checkAuth();
        initApp();
        themeToggle.addEventListener('click', toggleTheme);
        sidebarToggle.addEventListener('click', toggleSidebar);

        // Add Drug Button
        document.getElementById('add-drug-btn').addEventListener('click', () => showDrugModal());

        // Add Vendor Button
        document.getElementById('add-vendor-btn').addEventListener('click', () => showVendorModal());

        // Drug Form Submit
        document.getElementById('drug-form').addEventListener('submit', saveDrug);

        // Vendor Form Submit
        document.getElementById('vendor-form').addEventListener('submit', saveVendor);

        // Close Modal Buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => closeModal(button.closest('.modal').id));
        });

        // Logout Button
        document.getElementById('logout-btn').addEventListener('click', logout);
    }
});

// Simulate IoT data updates
setInterval(() => {
    inventory.forEach(drug => {
        drug.temperature = Math.max(15, Math.min(30, drug.temperature + (Math.random() - 0.5)));
        drug.humidity = Math.max(30, Math.min(60, drug.humidity + (Math.random() - 0.5)));
    });
    renderTemperatureChart();
}, 5000);

// AI-driven stock prediction (simplified simulation)
const predictStockLevels = () => {
    inventory.forEach(drug => {
        const predictedStock = drug.stock - Math.floor(Math.random() * 5);
        if (predictedStock < 10) {
            showNotification(`Low stock predicted for ${drug.name}. Consider reordering.`, 'warning');
        }
    });
};

// Run stock prediction every minute
setInterval(predictStockLevels, 60000);

// Blockchain simulation for drug verification
const verifyDrug = (id) => {
    const drug = inventory.find(drug => drug.id === id);
    if (drug) {
        const verificationResult = Math.random() > 0.05; // 95% chance of successful verification
        if (verificationResult) {
            showNotification(`${drug.name} has been verified on the blockchain.`, 'success');
        } else {
            showNotification(`Warning: ${drug.name} failed blockchain verification. Potential counterfeit.`, 'error');
        }
    }
};

// Add blockchain verification to each drug in the inventory
inventory.forEach(drug => {
    drug.verify = () => verifyDrug(drug.id);
});

// Example usage of blockchain verification
// You can call this function when needed, e.g., when viewing drug details
// verifyDrug(1);