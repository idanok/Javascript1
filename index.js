
// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

const apiURL = 'https://api.noroff.dev/api/v1/rainy-days';
const productContainer = document.getElementById('product-container');
const filterForm = document.querySelector('.filter');

// Initial fetch
fetchAllProducts();

// Handle filter form submission
filterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedColor = document.getElementById('color').value;
    const selectedGender = document.getElementById('gender').value;

    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            let filteredProducts = products;

            if (selectedColor && selectedColor !== "all") {
                filteredProducts = filteredProducts.filter(product =>
                    product.color.toLowerCase() === selectedColor.toLowerCase()
                );
            }

            if (selectedGender && selectedGender !== "all") {
                filteredProducts = filteredProducts.filter(product =>
                    product.gender.toLowerCase() === selectedGender.toLowerCase()
                );
            }

            displayProducts(filteredProducts);
        })
        .catch(error => console.error('Filter error:', error));
});

function fetchAllProducts() {
    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error('Fetch error:', error));
}

function displayProducts(products) {
    productContainer.innerHTML = '';

    if (products.length === 0) {
        productContainer.innerHTML = '<p>No products match your filter.</p>';
        return;
    }

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button><a href="jacketSpecific.html?id=${product.id}">View Detail</a></button>
            <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Cart logic
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalPriceDisplay = document.querySelector('.cart-total-price');
let cartItems = [];
let cartItemCount = 0;

function addToCart(product) {
    cartItemCount++;
    document.getElementById('cart-item-count').textContent = cartItemCount;

    const existingItem = cartItems.find(item => item.title === product.title);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }

    renderCart();
    openPopup('Item Added', `${product.title} has been added to your cart!`);
}

function removeFromCart(title) {
    const index = cartItems.findIndex(item => item.title === title);
    if (index !== -1) {
        cartItems.splice(index, 1);
    }
    renderCart();
}

function updateCartItemQuantity(title, quantity) {
    const item = cartItems.find(item => item.title === title);
    item.quantity = parseInt(quantity);
    renderCart();
}

function renderCart() {
    const cartItemContainer = document.querySelector('.cart-item-container');
    cartItemContainer.innerHTML = '';

    let totalPrice = 0;

    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                <div class="cart-item-actions">
                    <button class="btn btn-remove">Remove</button>
                    <input class="cart-item-quantity" type="number" value="${item.quantity}" min="1">
                </div>
            </div>
        `;

        cartItemElement.querySelector('.btn-remove').addEventListener('click', () => removeFromCart(item.title));
        cartItemElement.querySelector('.cart-item-quantity').addEventListener('change', (e) => updateCartItemQuantity(item.title, e.target.value));

        cartItemContainer.appendChild(cartItemElement);
        totalPrice += item.price * item.quantity;
    });

    cartTotalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
}

// Checkout redirection
document.getElementById('check-out-button').addEventListener('click', function () {
    const cartItemsHTML = document.querySelector('.cart-item-container').innerHTML;
    window.location.href = 'checkoutSuccess.html?cartItems=' + encodeURIComponent(cartItemsHTML);
});

// Pop up logic
function openPopup(title, message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => closePopup(popup), 5000);
    popup.addEventListener('click', () => closePopup(popup));
}

function closePopup(popup) {
    document.body.removeChild(popup);
}

