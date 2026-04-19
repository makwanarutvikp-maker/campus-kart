// ========================================
// Hostel Kart - FULL WORKING SCRIPT (FIXED)
// ========================================

// Global state
let cart = JSON.parse(localStorage.getItem('hostelKartCart')) || [];
let allProducts = [];


// ========================================
// LOAD PRODUCTS
// ========================================
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        allProducts = await response.json();
        renderProducts();
        console.log('✅ Products loaded:', allProducts.length);
    } catch (error) {
        console.error('❌ Error loading products:', error);

        const container = document.getElementById('products-container');

        if (container) {
            container.innerHTML =
                '<p style="text-align:center;color:#999;">Error loading products</p>';
        }
    }
}


// ========================================
// GET PRODUCT IMAGE (🔥 FIX)
// ========================================
function getProductImage(name) {
    const product = allProducts.find(p => p.name === name);
    return product ? product.image : "https://via.placeholder.com/100";
}


// ========================================
// RENDER PRODUCTS
// ========================================
function renderProducts(productsToShow = allProducts) {

    const container = document.getElementById('products-container');

    if (!container) return;

    container.innerHTML = '';

    productsToShow.forEach(product => {

        const productDiv = document.createElement('div');

        productDiv.className = 'product';

        productDiv.innerHTML = `
            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/250x250?text=No+Image'">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>

                <div class="price">
                    ₹${Number(product.price).toLocaleString()}
                </div>

                <p>${product.description || 'High quality product for hostel use.'}</p>

                <div class="button-group">

                    <a href="${product.filename}" class="view-btn">
                        View
                    </a>

                    <button class="buy-btn"
                        onclick='addToCart(${JSON.stringify(product.name)}, ${Number(product.price)})'>
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        container.appendChild(productDiv);

    });

}


// ========================================
// SEARCH FILTER
// ========================================
function filterProducts() {

    const search =
        document.querySelector('.search')?.value.toLowerCase() || '';

    const filtered =
        allProducts.filter(product =>
            product.name.toLowerCase().includes(search)
        );

    renderProducts(filtered);
}


// ========================================
// ADD TO CART (🔥 IMAGE FIX HERE)
// ========================================
function addToCart(name, price, qty = 1) {

    price = Number(price);
    qty = Number(qty);

    if (!name || isNaN(price)) {
        console.error("❌ Invalid product:", name, price);
        return;
    }

    let cart = JSON.parse(localStorage.getItem('hostelKartCart')) || [];

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            name,
            price,
            quantity: qty,
            image: getProductImage(name) // ✅ FIXED
        });
    }

    localStorage.setItem('hostelKartCart', JSON.stringify(cart));

    window.cart = cart;

    updateCartCount();

    showToast(`✅ Added ${qty}x ${name}`, 'success');
}


// ========================================
// CART COUNT
// ========================================
function updateCartCount() {

    const cartCount = document.getElementById('cart-count');

    if (!cartCount) return;

    let cart = JSON.parse(localStorage.getItem('hostelKartCart')) || [];

    const totalItems =
        cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    cartCount.textContent = totalItems;
}


// ========================================
// TOAST MESSAGE
// ========================================
function showToast(message, type = 'success') {

    const toast = document.createElement('div');

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        transition: 0.3s;
    `;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}


// ========================================
// QUANTITY CONTROLS
// ========================================
let currentQuantity = 1;

function increaseQty() {
    currentQuantity++;
    const el = document.getElementById('qty');
    if (el) el.textContent = currentQuantity;
}

function decreaseQty() {
    if (currentQuantity > 1) {
        currentQuantity--;
        const el = document.getElementById('qty');
        if (el) el.textContent = currentQuantity;
    }
}


// ========================================
// NAVIGATION
// ========================================
document.addEventListener('click', function(e) {

    const cartLink = e.target.closest('a');

    if (cartLink && cartLink.textContent.includes('Cart')) {
        e.preventDefault();
        window.location.href = 'cart.html';
    }

});


// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function() {

    loadProducts();

    updateCartCount();

    const search = document.querySelector('.search');

    if (search) {
        search.addEventListener('input', filterProducts);
    }

});