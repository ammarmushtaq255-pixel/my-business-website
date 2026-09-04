// Sample Products Data
const productsData = [
    {
        id: 1,
        name: 'Premium Laptop',
        price: 1299.99,
        originalPrice: 1499.99,
        category: 'electronics',
        description: 'High-performance laptop for professionals',
        emoji: '💻',
        rating: 5
    },
    {
        id: 2,
        name: 'Wireless Headphones',
        price: 199.99,
        originalPrice: 249.99,
        category: 'accessories',
        description: 'Premium sound quality with noise cancellation',
        emoji: '🎧',
        rating: 4.5
    },
    {
        id: 3,
        name: 'Professional Camera',
        price: 899.99,
        originalPrice: 999.99,
        category: 'electronics',
        description: 'Full-frame mirrorless camera with 4K video',
        emoji: '📷',
        rating: 5
    },
    {
        id: 4,
        name: 'Consulting Service',
        price: 150.00,
        originalPrice: 200.00,
        category: 'services',
        description: 'Expert business consulting and strategy',
        emoji: '👔',
        rating: 4.8
    },
    {
        id: 5,
        name: 'Phone Case Premium',
        price: 49.99,
        originalPrice: 69.99,
        category: 'accessories',
        description: 'Durable and stylish phone protection',
        emoji: '📱',
        rating: 4.3
    },
    {
        id: 6,
        name: 'Web Design Service',
        price: 500.00,
        originalPrice: 750.00,
        category: 'services',
        description: 'Professional website design and development',
        emoji: '🌐',
        rating: 5
    },
    {
        id: 7,
        name: 'Tablet Pro',
        price: 649.99,
        originalPrice: 799.99,
        category: 'electronics',
        description: 'Powerful tablet for work and creativity',
        emoji: '⌚',
        rating: 4.7
    },
    {
        id: 8,
        name: 'Screen Protector',
        price: 19.99,
        originalPrice: 29.99,
        category: 'accessories',
        description: 'Tempered glass screen protection',
        emoji: '🛡️',
        rating: 4.5
    }
];

// Cart Array
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const notification = document.getElementById('notification');
const loadingSpinner = document.getElementById('loadingSpinner');

// Load Products
function loadProducts(category = 'all') {
    productGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? productsData 
        : productsData.filter(p => p.category === category);
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No products found in this category</p>';
        return;
    }
    
    filteredProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animation = `slideInUp 0.5s ease ${index * 0.1}s backwards`;
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))}</div>
                <div class="product-price">
                    <span>$${product.price.toFixed(2)}</span>
                    <span class="price-original">$${product.originalPrice.toFixed(2)}</span>
                </div>
                <button class="product-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter Products
function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    loadProducts(category);
}

// Add to Cart
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showNotification(`✅ ${product.name} added to cart!`, 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    showNotification('❌ Item removed from cart', 'info');
}

// Update Quantity
function updateQuantity(productId, amount) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += amount;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Open Cart
function openCart(event) {
    if (event) event.preventDefault();
    cartModal.classList.add('show');
    updateCartDisplay();
}

// Close Cart
function closeCart() {
    cartModal.classList.remove('show');
}

// Update Cart Display
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><div class="empty-cart-icon">🛒</div><p>Your cart is empty</p></div>';
        updateCartSummary(0);
        return;
    }

    cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div style="text-align: right; min-width: 80px;">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">$${itemTotal.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartSummary(subtotal);
}

// Update Cart Summary
function updateCartSummary(subtotal) {
    const shipping = subtotal > 0 && subtotal < 100 ? 15 : 0;
    const tax = (subtotal + shipping) * 0.1;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free';
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    showLoading(true);
    
    setTimeout(() => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showLoading(false);
        
        showNotification(
            `🎉 Thank you for your purchase! Total: $${total.toFixed(2)}`, 
            'success'
        );
        
        cart = [];
        updateCartCount();
        closeCart();
    }, 1500);
}

// Handle Contact Form
function handleContact(event) {
    event.preventDefault();
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        showNotification('✉️ Message sent successfully! We\'ll get back to you soon.', 'success');
        event.target.reset();
    }, 1000);
}

// Handle Newsletter
function handleNewsletter(event) {
    event.preventDefault();
    showLoading(true);
    
    setTimeout(() => {
        showLoading(false);
        showNotification('📧 Thanks for subscribing! Check your email for updates.', 'success');
        event.target.reset();
    }, 1000);
}

// Show Notification
function showNotification(message, type = 'info') {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.className = `notification ${type} show`;
    
    setTimeout(() => {
        notif.classList.remove('show');
    }, 3000);
}

// Show Loading
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.add('show');
    } else {
        spinner.classList.remove('show');
    }
}

// Scroll to Section
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal on outside click
window.addEventListener('click', function(event) {
    if (event.target == cartModal) {
        closeCart();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    
    // Add smooth scroll behavior for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cart') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
});
