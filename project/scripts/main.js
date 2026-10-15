const equipmentList = [
    {
        id: "med-001",
        name: "ICU Mechanical Ventilator V500",
        category: "Respiratory",
        brand: "Draeger",
        price: 18500,
        featured: true,
        image: "images/ventilador.jpg",
        specs: "High-end ventilation for adult, pediatric, and neonatal patients. Touchscreen interface."
    },
    {
        id: "med-002",
        name: "HemoCue Hb 201+ Analyzer",
        category: "Laboratory",
        brand: "HemoCue",
        price: 1200,
        featured: true,
        image: "images/hemocue.jpg",
        specs: "Point-of-care hemoglobin testing system delivering laboratory-accurate results in 60 seconds."
    },
    {
        id: "med-003",
        name: "Clinical Centrifuge Micro 220",
        category: "Laboratory",
        brand: "Hettich",
        price: 3400,
        featured: false,
        image: "images/centrifuge.jpg",
        specs: "Compact refrigerated centrifuge for microrotors with quiet maintenance-free drive."
    },
    {
        id: "med-004",
        name: "Portable Emergency Suction Pump",
        category: "Respiratory",
        brand: "Atmosphere",
        price: 950,
        featured: true,
        image: "images/suction-pump.jpg",
        specs: "High-vacuum portable aspiration unit designed for emergency room and field use."
    },
    {
        id: "med-005",
        name: "Multi-Parameter Patient Monitor",
        category: "Monitoring",
        brand: "Zegen",
        price: 4200,
        featured: false,
        image: "images/monitor.jpg",
        specs: "12-inch display tracking ECG, SpO2, NIBP, Respiration, and Temperature."
    }
];

let quoteCart = JSON.parse(localStorage.getItem('dsba_quote_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderFeaturedProducts();
    renderCatalog(equipmentList);
    renderQuoteSummary();
    setupFilters();
    setupModal();
    setupFormHandler();
    updateFooterDates();
});

function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navUl = document.querySelector('#primary-nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('show');
        });
    }
}

function createProductCard(item) {
    return `
        <div class="product-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="product-info">
                <span class="badge">${item.category}</span>
                <h4>${item.name}</h4>
                <p><strong>Brand:</strong> ${item.brand}</p>
                <p><strong>Est. Price:</strong> $${item.price.toLocaleString()} USD</p>
                <div class="product-actions">
                    <button class="btn btn-secondary view-details-btn" data-id="${item.id}">Specs</button>
                    <button class="btn btn-primary add-quote-btn" data-id="${item.id}">+ Add Quote</button>
                </div>
            </div>
        </div>
    `;
}

function renderFeaturedProducts() {
    const container = document.getElementById('featured-grid');
    if (!container) return;
    const featuredItems = equipmentList.filter(item => item.featured);
    container.innerHTML = featuredItems.map(item => createProductCard(item)).join('');
    attachCardListeners(container);
}

function renderCatalog(items) {
    const container = document.getElementById('catalog-grid');
    if (!container) return;
    if (items.length === 0) {
        container.innerHTML = `<p>No medical equipment found matching your criteria.</p>`;
        return;
    }
    container.innerHTML = items.map(item => createProductCard(item)).join('');
    attachCardListeners(container);
}

function attachCardListeners(container) {
    container.querySelectorAll('.add-quote-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            addToQuoteCart(btn.getAttribute('data-id'));
        });
    });

    container.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openDetailModal(btn.getAttribute('data-id'));
        });
    });
}

function addToQuoteCart(itemId) {
    const item = equipmentList.find(prod => prod.id === itemId);
    if (item && !quoteCart.some(cartItem => cartItem.id === itemId)) {
        quoteCart.push(item);
        saveCart();
        renderQuoteSummary();
        alert(`${item.name} added to quote request.`);
    } else {
        alert("This item is already in your quote list.");
    }
}

function removeFromQuoteCart(itemId) {
    quoteCart = quoteCart.filter(item => item.id !== itemId);
    saveCart();
    renderQuoteSummary();
}

function saveCart() {
    localStorage.setItem('dsba_quote_cart', JSON.stringify(quoteCart));
    updateCartCount();
}

function updateCartCount() {
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = quoteCart.length;
    });
}

function renderQuoteSummary() {
    const container = document.getElementById('quote-items-container');
    const totalEl = document.getElementById('quote-total');
    updateCartCount();

    if (!container || !totalEl) return;

    if (quoteCart.length === 0) {
        container.innerHTML = `<p>No equipment selected for quote yet.</p>`;
        totalEl.innerHTML = `<p>Estimated Value: <strong>$0 USD</strong></p>`;
        return;
    }

    container.innerHTML = quoteCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;">
            <div>
                <strong>${item.name}</strong>
                <p style="font-size:0.85rem; color:#666;">${item.brand} | $${item.price.toLocaleString()} USD</p>
            </div>
            <button class="btn btn-secondary remove-item-btn" data-id="${item.id}" style="padding:0.2rem 0.5rem; font-size:0.8rem;">Remove</button>
        </div>
    `).join('');

    const totalCost = quoteCart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerHTML = `<p>Estimated Total Equipment Value: <strong>$${totalCost.toLocaleString()} USD</strong></p>`;

    container.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromQuoteCart(btn.getAttribute('data-id'));
        });
    });

    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            quoteCart = [];
            saveCart();
            renderQuoteSummary();
        };
    }
}

function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-select');

    if (!searchInput) return;

    let currentCategory = 'all';

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        let filtered = equipmentList.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(query) || item.brand.toLowerCase().includes(query);
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            return matchesSearch && matchesCategory;
        });

        const sortValue = sortSelect.value;
        if (sortValue === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortValue === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderCatalog(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            applyFilters();
        });
    });
}

function setupModal() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('close-modal');

    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });
}

function openDetailModal(itemId) {
    const item = equipmentList.find(p => p.id === itemId);
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');

    if (!item || !modal || !modalBody) return;

    modalBody.innerHTML = `
        <h3>${item.name}</h3>
        <span class="badge">${item.category}</span>
        <img src="${item.image}" alt="${item.name}" style="width:100%; max-height:220px; object-fit:cover; margin:1rem 0; border-radius:4px;">
        <p><strong>Brand:</strong> ${item.brand}</p>
        <p><strong>Reference Price:</strong> $${item.price.toLocaleString()} USD</p>
        <p style="margin-top:0.8rem;"><strong>Specifications:</strong></p>
        <p style="font-size:0.95rem; color:#444;">${item.specs}</p>
    `;

    modal.classList.add('open');
}

function setupFormHandler() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const contactName = document.getElementById('contact-name').value;
        alert(`Thank you, ${contactName}! Your quote request has been submitted to DSBA MedTech Solutions in Lima.`);
        form.reset();
        quoteCart = [];
        saveCart();
        renderQuoteSummary();
    });
}

function updateFooterDates() {
    const yearEl = document.getElementById('year');
    const modEl = document.getElementById('lastModified');
    
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (modEl) modEl.textContent = "Last Modified: " + document.lastModified;
}