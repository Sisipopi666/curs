document.addEventListener('DOMContentLoaded', function() {
    // Данные товаров
    const products = [
        {
            id: 1,
            title: "Тормозные колодки",
            price: 2499,
            image: "images/product1.jpg",
            description: "Высококачественные тормозные колодки с увеличенным сроком службы. Обеспечивают плавное и бесшумное торможение в любых условиях.",
            materials: "Композитный материал с металлическими добавками, устойчивый к высоким температурам"
        },
        {
            id: 2,
            title: "Масляный фильтр",
            price: 899,
            image: "images/product2.jpg",
            description: "Надежный масляный фильтр с высокой степенью очистки. Задерживает частицы размером до 10 микрон.",
            materials: "Бумажный фильтрующий элемент, стальной корпус, резиновые уплотнители"
        },
        {
            id: 3,
            title: "Воздушный фильтр",
            price: 1299,
            image: "images/product3.jpg",
            description: "Качественный воздушный фильтр с увеличенной площадью фильтрации. Обеспечивает чистый воздух для двигателя.",
            materials: "Специальная фильтровальная бумага, пластиковый корпус"
        },
        {
            id: 4,
            title: "Свечи зажигания",
            price: 1799,
            image: "images/product4.jpg",
            description: "Иридиевые свечи зажигания с увеличенным сроком службы. Обеспечивают стабильное искрообразование.",
            materials: "Иридиевый центральный электрод, никелевый боковой электрод, керамический изолятор"
        },
        {
            id: 5,
            title: "Аккумулятор",
            price: 5990,
            image: "images/product5.jpg",
            description: "Мощный аккумулятор с увеличенным сроком службы. Подходит для большинства современных автомобилей.",
            materials: "Свинцово-кислотная технология, ABS-пластиковый корпус"
        },
        {
            id: 6,
            title: "Щетки стеклоочистителя",
            price: 1490,
            image: "images/product6.jpg",
            description: "Качественные щетки стеклоочистителя с карбоновым покрытием. Обеспечивают чистое и бесшумное очищение стекла.",
            materials: "Резиновые элементы с карбоновым покрытием, металлический каркас"
        }
    ];

    // Корзина
    let cart = loadCartFromStorage();
    
    // Инициализация
    initCart();
    setupModals();
    setupAddToCartButtons();
    setupOrderForm();
    
    // Функции корзины
    function loadCartFromStorage() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            return [];
        }
    }
    
    function saveCartToStorage() {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Ошибка сохранения корзины:', e);
        }
    }
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }
    
    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        saveCartToStorage();
        updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToStorage();
        updateCartCount();
        renderCart();
    }
    
    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity > 0 ? newQuantity : 1;
            saveCartToStorage();
            renderCart();
        }
    }
    
    function renderCart() {
        const cartItemsEl = document.querySelector('.cart-items');
        if (!cartItemsEl) return;
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = `
                <div class="empty-cart">
                    <p>Ваша корзина пуста</p>
                    <a href="products.html" class="btn">Перейти к товарам</a>
                </div>
            `;
            document.querySelector('.cart-total h3 span').textContent = '0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                        <div>
                            <h3 class="cart-item-title">${item.title}</h3>
                            <div class="cart-item-price">${item.price} ₽</div>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-total">${item.price * item.quantity} ₽</div>
                    <i class="fas fa-times remove-item" data-id="${item.id}"></i>
                </div>
            `;
        });
        
        cartItemsEl.innerHTML = html;
        document.querySelector('.cart-total h3 span').textContent = total;
        
        // Назначение обработчиков событий
        document.querySelectorAll('.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === id);
                if (item) updateQuantity(id, item.quantity - 1);
            });
        });
        
        document.querySelectorAll('.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const item = cart.find(item => item.id === id);
                if (item) updateQuantity(id, item.quantity + 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }
    
    function initCart() {
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
    }
    
    // Модальные окна
    function setupModals() {
        // Модальное окно товара
        if (document.querySelector('.products-grid')) {
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', function(e) {
                    if (!e.target.classList.contains('add-to-cart')) {
                        const productId = parseInt(this.getAttribute('data-id'));
                        const product = products.find(p => p.id === productId);
                        
                        if (product) {
                            document.getElementById('modal-product-img').src = product.image;
                            document.getElementById('modal-product-title').textContent = product.title;
                            document.getElementById('modal-product-price').textContent = `${product.price} ₽`;
                            document.getElementById('modal-product-description').textContent = product.description;
                            document.getElementById('modal-product-materials').textContent = product.materials;
                            
                            const addBtn = document.querySelector('.add-to-cart-modal');
                            addBtn.setAttribute('data-id', product.id);
                            addBtn.textContent = 'Добавить в корзину';
                            
                            document.getElementById('product-modal').style.display = 'block';
                        }
                    }
                });
            });
        }
        
        // Модальное окно оформления заказа
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length > 0) {
                    document.getElementById('order-modal').style.display = 'block';
                } else {
                    alert('Ваша корзина пуста!');
                }
            });
        }
        
        // Закрытие модальных окон
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });
        
        // Клик вне модального окна
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Добавление в корзину из модального окна
        const addToCartModal = document.querySelector('.add-to-cart-modal');
        if (addToCartModal) {
            addToCartModal.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
                this.textContent = 'Добавлено!';
                setTimeout(() => {
                    document.getElementById('product-modal').style.display = 'none';
                }, 1000);
            });
        }
    }
    
    // Оформление заказа с валидацией
    function setupOrderForm() {
        const orderForm = document.getElementById('order-form');
        if (!orderForm) return;

        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearErrors();
            
            const fields = {
                name: document.getElementById('name'),
                phone: document.getElementById('phone'),
                email: document.getElementById('email'),
                address: document.getElementById('address'),
                date: document.getElementById('date')
            };
            
            let isValid = true;
            
            // Валидация имени
            if (!fields.name.value.trim()) {
                showError(fields.name, 'Введите ваше ФИО');
                isValid = false;
            }
            
            // Валидация телефона
            const phoneRegex = /^[\d\+][\d\(\)\ -]{9,}\d$/;
            if (!phoneRegex.test(fields.phone.value)) {
                showError(fields.phone, 'Введите корректный номер телефона');
                isValid = false;
            }
            
            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(fields.email.value)) {
                showError(fields.email, 'Введите корректный email');
                isValid = false;
            }
            
            // Валидация адреса
            if (!fields.address.value.trim()) {
                showError(fields.address, 'Введите адрес доставки');
                isValid = false;
            }
            
            // Валидация даты
            const selectedDate = new Date(fields.date.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (!fields.date.value || selectedDate < today) {
                showError(fields.date, 'Выберите будущую дату доставки');
                isValid = false;
            }
            
            if (isValid) {
                submitOrder();
            }
        });
        
        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return;
            
            let errorElement = formGroup.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            input.classList.add('error');
            
            input.addEventListener('input', function() {
                this.classList.remove('error');
                const error = this.closest('.form-group').querySelector('.error-message');
                if (error) error.remove();
            }, { once: true });
        }
        
        function clearErrors() {
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                input.classList.remove('error');
            });
        }
        
        function submitOrder() {
            // Здесь должна быть отправка данных на сервер
            document.getElementById('order-modal').style.display = 'none';
            document.getElementById('success-modal').style.display = 'block';
            
            // Очистка корзины
            cart = [];
            saveCartToStorage();
            updateCartCount();
            
            if (window.location.pathname.includes('cart.html')) {
                renderCart();
            }
            
            // Очистка формы
            document.getElementById('order-form').reset();
        }
    }
    
    // Добавление товаров в корзину
    function setupAddToCartButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = parseInt(e.target.getAttribute('data-id'));
                addToCart(productId);
                
                // Анимация добавления
                e.target.textContent = 'Добавлено!';
                e.target.style.backgroundColor = 'var(--success-color)';
                
                setTimeout(() => {
                    e.target.textContent = 'В корзину';
                    e.target.style.backgroundColor = 'var(--secondary-color)';
                }, 1000);
            }
        });
    }
});



