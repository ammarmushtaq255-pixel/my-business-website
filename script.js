// Sample Products Data
const products = [
    {
        id: 1,
        name: 'Premium Product A',
        price: 49.99,
        description: 'High-quality product with excellent features',
        emoji: '🎁'
    },
    {
        id: 2,
        name: 'Deluxe Service Package',
        price: 99.99,
        description: 'Comprehensive service solution for your needs',
        emoji: '⭐'
    },
    {
        id: 3,
        name: 'Professional Kit',
        price: 149.99,
        description: 'Complete professional toolkit',
        emoji: '🛠️'
    },
    {
        id: 4,
        name: 'Premium Bundle',
        price: 199.99,
        description: 'Best value combination package',
        emoji: '📦'
    },
    {
        id: 5,
        name: 'Standard Edition',
        price: 29.99,
        description: 'Affordable entry-level option',
        emoji: '✨'
    },
    {
        id: 6,
        name: 'Ultimate Collection',
        price: 299.99,
        description: 'Everything you need in one package',
        emoji: '👑'
    }
];

// Cart Array
let cart = [];

// Load Products
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="product-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showNotification('Added to cart!');
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Show Notification
function showNotification(message) {
    alert(message);
}

// Open Cart
function openCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'block';
    updateCartDisplay();
}

// Close Cart
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

// Update Cart Display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <div>$${itemTotal.toFixed(2)}</div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\n\nTotal: $${total.toFixed(2)}\n\nYour order has been received.`);
    
    cart = [];
    updateCartCount();
    closeCart();
}

// Handle Contact Form
function handleContact(event) {
    event.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    event.target.reset();
}

// Cart Icon Click
document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }

    // Close modal when clicking outside
    const cartModal = document.getElementById('cartModal');
    window.addEventListener('click', function(event) {
        if (event.target == cartModal) {
            closeCart();
        }
    });

    // Load products on page load
    loadProducts();
});
