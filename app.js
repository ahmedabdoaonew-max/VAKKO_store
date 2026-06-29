// ================================================================
// 🔽🔽🔽 غيّر الصور هنا بسهولة (أضف أو امسح الروابط كما تريد) 🔽🔽🔽
const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1920',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1920',
    'https://i.postimg.cc/t4X4t37H/WA-1782738835358.jpg'
];
// 🔼🔼🔼 نهاية قسم الصور السهل التعديل 🔼🔼🔼
// ================================================================

let currentCategory = null;
let cart = [];
let favorites = [];
let allProducts = []; // سيتم ملؤها من productsData

// ==================== بناء سلايدر الهيرو ====================
function buildHeroSlider() {
    const container = document.getElementById('heroSlider');
    container.innerHTML = '';
    HERO_IMAGES.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Slide ${index + 1}`;
        if (index === 0) img.classList.add('active');
        container.appendChild(img);
    });
    let currentSlide = 0;
    const slides = container.querySelectorAll('img');
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 3000);
}

// ==================== السلة ====================
function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartDisplay();
}

function updateCartDisplay() {
    document.getElementById('cart-count').innerText = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').innerText = total + ' ج.م';
    const list = document.getElementById('cartItems');
    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = '<li style="text-align:center;color:#888;padding:20px 0;">السلة فارغة</li>';
        return;
    }
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'sidebar-item';
        li.innerHTML = `<span>${item.name}</span><span>${item.price} ج.م</span>`;
        list.appendChild(li);
    });
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('favSidebar').classList.remove('open');
}

// ==================== المفضلات ====================
function toggleFavorite(event, productId) {
    event.stopPropagation();
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
    }
    updateFavDisplay();
    renderFavorites();
    document.querySelectorAll('#products-container .product-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        const icon = card.querySelector('.fav-icon i');
        if (favorites.includes(id)) {
            icon.className = 'fas fa-heart';
            card.querySelector('.fav-icon').classList.add('active');
        } else {
            icon.className = 'far fa-heart';
            card.querySelector('.fav-icon').classList.remove('active');
        }
    });
}

function updateFavDisplay() {
    document.getElementById('fav-count').innerText = favorites.length;
}

function renderFavorites() {
    const container = document.getElementById('favItems');
    container.innerHTML = '';
    if (favorites.length === 0) {
        container.innerHTML = '<li style="text-align:center;color:#888;padding:30px 0;">لا توجد منتجات مفضلة بعد.</li>';
        return;
    }
    favorites.forEach(id => {
        const prod = allProducts.find(p => p.id === id);
        if (!prod) return;
        const li = document.createElement('li');
        li.className = 'sidebar-item';
        li.innerHTML = `
            <span>${prod.name} - ${prod.price} ج.م</span>
            <button class="remove-item" onclick="removeFromFavorites(${prod.id})">✕</button>
        `;
        container.appendChild(li);
    });
}

function removeFromFavorites(productId) {
    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        updateFavDisplay();
        renderFavorites();
        document.querySelectorAll('#products-container .product-card').forEach(card => {
            const id = parseInt(card.dataset.id);
            if (id === productId) {
                const icon = card.querySelector('.fav-icon i');
                icon.className = 'far fa-heart';
                card.querySelector('.fav-icon').classList.remove('active');
            }
        });
    }
}

function toggleFavSidebar() {
    document.getElementById('favSidebar').classList.toggle('open');
    document.getElementById('cartSidebar').classList.remove('open');
}

// ==================== عرض المنتجات ====================
function displayProducts(productsArray) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    if (!productsArray || productsArray.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:#888;">لا توجد منتجات تطابق بحثك.</p>';
        container.style.display = 'grid';
        return;
    }
    productsArray.forEach(prod => {
        const isFav = favorites.includes(prod.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = prod.id;
        card.dataset.name = prod.name;
        card.dataset.price = prod.price;
        card.innerHTML = `
            <div class="img-container">
                <img src="${prod.img}" alt="${prod.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/%3E%3Ctext fill=%22%23555%22 x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22%3E📷 لا توجد صورة%3C/text%3E%3C/svg%3E';">
                <span class="fav-icon ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${prod.id})">
                    <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                </span>
            </div>
            <div class="product-details">
                <div class="title">${prod.name}</div>
                <div class="product-options">
                    <div class="sizes">
                        <select><option>M</option><option>L</option><option>XL</option></select>
                    </div>
                    <div class="colors">
                        <span class="color-dot" style="background:#000;"></span>
                        <span class="color-dot" style="background:#fff;"></span>
                    </div>
                </div>
                <div class="price-row">
                    <span class="price">${prod.price} ج.م</span>
                    <button class="add-to-cart" onclick="addToCart('${prod.name.replace(/'/g, "\\'")}', ${prod.price})">أضف للسلة</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==================== فتح الأقسام ====================
function openCategory(categoryName) {
    currentCategory = categoryName;
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('back-to-categories').style.display = 'block';
    document.getElementById('products-container').style.display = 'grid';
    document.getElementById('category-status').innerText = `Viewing: ${categoryName}`;
    document.getElementById('backFloatContainer').classList.add('show');

    const filtered = allProducts.filter(p => p.category === categoryName);
    displayProducts(filtered);
    document.getElementById('store-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showAllCategories() {
    currentCategory = null;
    document.getElementById('categories-container').style.display = 'grid';
    document.getElementById('back-to-categories').style.display = 'none';
    document.getElementById('products-container').style.display = 'none';
    document.getElementById('category-status').innerText = "Select a category to browse";
    document.getElementById('products-container').innerHTML = '';
    document.getElementById('backFloatContainer').classList.remove('show');
    document.getElementById('store-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== البحث من البار العلوي (يعمل على كل المنتجات) ====================
function performSearch() {
    const query = document.getElementById('topSearchInput').value.trim().toLowerCase();
    if (!query) {
        alert('الرجاء كتابة كلمة البحث أولاً.');
        return;
    }

    // البحث في جميع المنتجات
    const results = allProducts.filter(p => p.name.toLowerCase().includes(query));
    
    // إظهار شبكة المنتجات وإخفاء الأقسام
    document.getElementById('categories-container').style.display = 'none';
    document.getElementById('back-to-categories').style.display = 'block';
    document.getElementById('products-container').style.display = 'grid';
    document.getElementById('category-status').innerText = `نتائج البحث عن: "${query}"`;
    document.getElementById('backFloatContainer').classList.add('show');
    
    displayProducts(results);
    document.getElementById('store-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== التهيئة ====================
(function initApp() {
    // نسخ بيانات المنتجات من المتغير العام productsData
    if (typeof productsData !== 'undefined') {
        allProducts = productsData;
    } else {
        console.error('productsData غير موجود! تأكد من تحميل products.js قبل app.js');
    }

    // بناء سلايدر الهيرو
    buildHeroSlider();

    // إظهار الأقسام في البداية
    document.getElementById('categories-container').style.display = 'grid';
    document.getElementById('back-to-categories').style.display = 'none';
    document.getElementById('products-container').style.display = 'none';
    document.getElementById('backFloatContainer').classList.remove('show');

    // تهيئة المفضلات
    updateFavDisplay();
    renderFavorites();

    // دعم الضغط على Enter في بار البحث
    document.getElementById('topSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
})();

// ==================== واتساب ====================
function handleCheckoutFlow() {
    const formContainer = document.getElementById('checkoutForm');
    const checkoutBtn = document.getElementById('mainCheckoutBtn');

    if (cart.length === 0) {
        alert('سلتك فارغة!');
        return;
    }

    if (formContainer.style.display !== 'block') {
        formContainer.style.display = 'block';
        checkoutBtn.innerText = 'تأكيد وإرسال الطلب للواتساب';
        formContainer.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const address = document.getElementById('clientAddress').value.trim();

    if (!name || !phone || !address) {
        alert('يرجى ملء جميع الحقول لتوصيل الأوردر!');
        return;
    }

    let total = document.getElementById('cartTotal').innerText;
    let message = `🔥 *طلب جديد من متجر VAKKO EGYPT* 🔥%0A%0A`;
    message += `👤 *بيانات العميل:*%0A`;
    message += `- *الاسم:* ${name}%0A`;
    message += `- *الموبايل:* ${phone}%0A`;
    message += `- *العنوان:* ${address}%0A%0A`;
    message += `📦 *المنتجات:*%0A`;

    cart.forEach(item => {
        message += `• ${item.name} - ${item.price} ج.م%0A`;
    });

    message += `%0A💰 *المجموع:* ${total}`;
    window.open(`https://wa.me/201032484130?text=${message}`, '_blank');
}