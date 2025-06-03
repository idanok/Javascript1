// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// API and DOM elements
const apiURL = 'https://api.noroff.dev/api/v1/rainy-days';
const productContainer = document.getElementById('product-container');
const filterForm = document.querySelector('.filter');

fetchAllProducts();

// Filter functionality
filterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedGender = document.getElementById('gender').value.toLowerCase();

    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            let filteredProducts;
            if (selectedGender === "all") {
                filteredProducts = products;
            } else {
                filteredProducts = products.filter(product =>
                    product.gender && product.gender.toLowerCase() === selectedGender
                );
            }
            displayProducts(filteredProducts);
        })
        .catch(error => {
            console.error('Filter error:', error);
            productContainer.innerHTML = "<p>Could not load products. Please try again later.</p>";
        });
});

function fetchAllProducts() {
    fetch(apiURL)
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            productContainer.innerHTML = "<p>Could not load products. Please try again later.</p>";
        });
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
        <button class="view-detail">View Detail</button>
        <button class="add-to-cart">Add to Cart</button>
        `;

        productContainer.appendChild(productElement);

        productElement.querySelector('.view-detail').addEventListener('click', () => {
            window.location.href = `jacketSpecific.html?id=${product.id}`;
        });

        productElement.querySelector('.add-to-cart').addEventListener('click', () => {
            addToCart(product);
        });
    });
}

// Cart functionality
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function removeFromCart(productId) {
    if (confirm("Are you sure you want to remove this item from the cart?")) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
        ${item.title} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
        <button onclick="removeFromCart('${item.id}')">Remove</button>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = count;
}

function toggleCart() {
    document.getElementById("cart-dropdown").classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", renderCart);

document.getElementById('checkout-button').addEventListener('click', () => {
    window.location.href = 'checkout.html';
});

document.addEventListener('click', function (event) {
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartIcon = document.querySelector(".cart-icon");
    if (!cartDropdown.classList.contains("hidden") &&
        !cartDropdown.contains(event.target) &&
        !cartIcon.contains(event.target)) {
        cartDropdown.classList.add("hidden");
    }
});
