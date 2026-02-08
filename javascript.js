// --- 1. CONFIGURATION ---
const STORAGE_KEY = 'stevePlexz_v2'; // Key to save data in browser's local storage

// A helper function to prevent HTML injection issues
function escapeHtml(text) {
    if (!text) return text;
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// A helper function to show brief messages (toasts)
function showToast(message) {
    // For simplicity, we'll use a standard alert. You can integrate a proper toast library later.
    alert(message);
}

// --- 2. THE PRODUCT CATALOGUE (With Richer Data for Cards) ---
const defaultProducts = [
    { id: 1, title: "iPhone 15 Pro Max", desc: "Titanium design, A17 Pro chip.", price: 1199.00, originalPrice: 1299.00, image: "images/iphone.jpg", category: "Electronics", badge: "HOT", type: "Own", rating: 4.8, reviews: 2451, freeShipping: true },
    { id: 2, title: "Sony WH-1000XM5", desc: "Industry Leading Noise Cancelling", price: 348.00, originalPrice: 399.00, image: "images/headphone.jpg", category: "Electronics", badge: "AFFILIATE", type: "Affiliate", link: "https://amazon.com", rating: 4.9, reviews: 15888, freeShipping: true },
    { id: 3, title: "Air Jordan 1 High", desc: "Classic Chicago colorway", price: 180.00, originalPrice: null, image: "images/shoe.jpg", category: "Fashion", badge: "STEVE PLEXZ", type: "Own", rating: 4.7, reviews: 985, freeShipping: false },
    { id: 4, title: "MacBook Air M2", desc: "Supercharged by M2 chip", price: 1099.00, originalPrice: 1199.00, image: "images/laptop.jpg", category: "Electronics", badge: "SALE", type: "Own", rating: 4.8, reviews: 3012, freeShipping: true },
    { id: 5, title: "Canon EOS R5", desc: "8K Video Mirrorless Camera", price: 3899.00, originalPrice: null, image: "images/camera.jpg", category: "Electronics", badge: "AFFILIATE", type: "Affiliate", link: "https://amazon.com", rating: 4.9, reviews: 850, freeShipping: true },
    { id: 6, title: "Modern Grey Sofa", desc: "Minimalist 3-seater for living room", price: 899.00, originalPrice: 999.00, image: "images/sofa.jpg", category: "Home", badge: "NEW", type: "Own", rating: 4.5, reviews: 413, freeShipping: false },
    { id: 7, title: "PlayStation 5", desc: "Next-gen gaming console", price: 499.00, originalPrice: null, image: "images/ps5.jpg", category: "Electronics", badge: "STOCK LOW", type: "Own", rating: 4.9, reviews: 22401, freeShipping: true },
    { id: 8, title: "Ray-Ban Aviator", desc: "Classic gold frame sunglasses", price: 160.00, originalPrice: 180.00, image: "images/glasses.jpg", category: "Fashion", badge: "AFFILIATE", type: "Affiliate", link: "https://amazon.com", rating: 4.6, reviews: 7854, freeShipping: true },
    { id: 9, title: "Dyson V15 Detect", desc: "Laser cordless vacuum cleaner", price: 749.00, originalPrice: null, image: "images/vacuum.jpg", category: "Home", badge: "AFFILIATE", type: "Affiliate", link: "https://amazon.com", rating: 4.7, reviews: 1259, freeShipping: true },
    { id: 10, title: "Rolex Submariner", desc: "Luxury Diver Watch", price: 12500.00, originalPrice: null, image: "images/watch.jpg", category: "Fashion", badge: "EXCLUSIVE", type: "Own", rating: 5.0, reviews: 680, freeShipping: true },
    { id: 11, title: "Herman Miller Chair", desc: "Ergonomic Office Chair", price: 1400.00, originalPrice: 1550.00, image: "images/chair.jpg", category: "Home", badge: "PRO", type: "Own", rating: 4.9, reviews: 1980, freeShipping: true },
    { id: 12, title: "Gucci Leather Belt", desc: "Genuine leather with GG buckle", price: 450.00, originalPrice: null, image: "images/belt.jpg", category: "Fashion", badge: "STEVE PLEXZ", type: "Own", rating: 4.8, reviews: 889, freeShipping: false }
];

// --- 3. STATE MANAGEMENT ---
let products = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProducts;
if (products.length === 0) products = defaultProducts; // Ensure it's never empty

let cart = [];
let typeFilter = 'all'; 

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// --- 4. NAVIGATION & VIEW SWITCHING ---
function goHome() {
    // Hide the detail view
    document.getElementById('product-detail-view').classList.add('d-none');
    
    // Show the main marketplace and hero section
    document.getElementById('marketplace-view').classList.remove('d-none');
    document.getElementById('hero-section').classList.remove('d-none');
    
    window.scrollTo(0, 0);
    applyFilters(); // Re-render the grid
}

function openDetail(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;

    // Populate the detail view elements
    document.getElementById('detail-img').src = p.image;
    document.getElementById('detail-title').innerText = p.title;
    document.getElementById('detail-desc').innerText = p.desc;
    document.getElementById('detail-price').innerText = "$" + p.price.toFixed(2);
    document.getElementById('detail-category').innerText = p.category;
    document.getElementById('detail-badge').innerText = p.badge;

    const btnContainer = document.getElementById('detail-btn-container');
    btnContainer.innerHTML = p.type === 'Affiliate' 
        ? `<a href="${p.link}" target="_blank" class="btn btn-dark w-100 py-3 rounded-pill">Buy on Partner Site</a>` 
        : `<button onclick="addToCart(${p.id})" class="btn btn-dark w-100 py-3 rounded-pill">Add to Cart</button>`;

    // Hide the main marketplace and hero section
    document.getElementById('marketplace-view').classList.add('d-none');
    document.getElementById('hero-section').classList.add('d-none');
    
    // Show the detail view
    document.getElementById('product-detail-view').classList.remove('d-none');
    
    window.scrollTo(0, 0);
}

// --- 5. RENDERING & FILTERING ---
function applyFilters() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    let filtered = products.filter(p => 
        p.title.toLowerCase().includes(search) &&
        (category === 'all' || p.category === category) &&
        (typeFilter === 'all' || p.type === typeFilter)
    );
    renderGrid(filtered);
}

function setFilterType(type) {
    typeFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('btn-dark', btn.dataset.type === type);
        btn.classList.toggle('btn-outline-dark', btn.dataset.type !== type);
    });
    applyFilters();
}

function renderGrid(data) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = ""; 
    if (data.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5"><h4>No products found</h4><p class="text-muted">Try adjusting your search or filters.</p></div>`;
        return;
    }
    
    data.forEach(p => {
        const safeTitle = escapeHtml(p.title);
        const badgeStyle = p.type === 'Affiliate' ? "background: #eef2ff; color: #4338ca;" : "background: #f0f8ff; color: #0066cc;";
        const btnText = p.type === 'Affiliate' ? 'View on Partner' : 'Add to Cart';
        const discount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        
        grid.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="pro-card" style="height: 100%;">
                    <span class="card-badge" style="${badgeStyle}">${escapeHtml(p.badge)}</span>
                    <div class="img-box" onclick="openDetail(${p.id})">
                        <img src="${p.image}" alt="${safeTitle}" onerror="this.src='https://via.placeholder.com/300?text=Image+Not+Found'">
                    </div>
                    <div class="card-details">
                        <div class="flex-grow-1" onclick="openDetail(${p.id})">
                            <h5 class="product-title">${safeTitle}</h5>
                            <div class="d-flex align-items-center gap-2 mb-2" style="font-size: 0.8rem;">
                                <span style="color: #ffc107;">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
                                <span class="text-muted">(${p.reviews.toLocaleString()})</span>
                            </div>
                            <p class="product-desc">${escapeHtml(p.desc)}</p>
                        </div>
                        <div>
                            <div class="price-row mb-2">
                                <span class="price">${p.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                                ${p.originalPrice ? `<span class="text-muted text-decoration-line-through small ms-2">${p.originalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>` : ''}
                            </div>
                            ${discount > 0 ? `<div class="mb-2"><span class="badge bg-danger-subtle text-danger-emphasis rounded-pill">${discount}% off</span></div>` : ''}
                            ${p.freeShipping ? '<div class="text-success small fw-bold mb-3">FREE Shipping</div>' : ''}
                            <button class="btn-buy w-100" onclick="handleQuickAction('${p.type}', ${p.id}, '${p.link}')">${btnText}</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

// --- 6. CART LOGIC ---
function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');

    badge.style.display = cart.length > 0 ? 'block' : 'none';
    badge.innerText = cart.length;

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center mt-5 text-muted"><i class="bi bi-bag-x" style="font-size: 4rem;"></i><p class="mt-3">Your bag is empty.</p></div>`;
        return;
    }
    
    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img src="${item.image}" style="width: 60px; height: 60px; object-fit: contain; background: #f8f9fa; border-radius: 8px;">
                <div class="ms-3 flex-grow-1">
                    <h6 class="mb-0 fw-bold small">${escapeHtml(item.title)}</h6>
                    <span class="text-muted small">${item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                </div>
                <button onclick="cart.splice(${index}, 1); updateCartUI();" class="btn btn-sm btn-link text-danger"><i class="bi bi-trash-fill"></i></button>
            </div>`;
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        cart.push(product);
        updateCartUI();
        new bootstrap.Offcanvas(document.getElementById('cartDrawer')).show();
    }
}

function handleQuickAction(type, id, link) {
    if (type === 'Own') {
        addToCart(id);
    } else {
        window.open(link, '_blank');
    }
}

// --- 7. EVENT LISTENERS & INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial render when the page loads
    applyFilters();
    updateCartUI();

    // Attach listener for the search input
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    // Attach listener for the upload form
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const type = document.getElementById('pType').value;
        const newProduct = {
            id: Date.now(),
            title: document.getElementById('pTitle').value,
            desc: "A newly added item.",
            price: parseFloat(document.getElementById('pPrice').value),
            category: document.getElementById('pCategory').value,
            image: document.getElementById('pImage').value,
            type: type,
            link: document.getElementById('pLink').value || "#",
            badge: type === 'Affiliate' ? "AFFILIATE" : "NEW",
            rating: 0, reviews: 0, freeShipping: false, originalPrice: null
        };
        products.unshift(newProduct);
        saveData();
        applyFilters();
        
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
        showToast("Product Added Successfully");
    });

    // Attach listener for the checkout form
    document.getElementById('finalCheckoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast("Order Confirmed! Thank you.");
        cart = []; 
        updateCartUI();
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
        goHome();
    });
});