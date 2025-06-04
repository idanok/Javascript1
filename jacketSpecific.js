// Hamburger menu
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// Get product ID from URL query string
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productContainer = document.getElementById("product-detail");

if (!productId) {
    productContainer.innerHTML = "<p>No product selected.</p>";
} else {
    fetch(`https://api.noroff.dev/api/v1/rainy-days/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch product.");
            }
            return response.json();
        })
        .then(product => {
            displayProduct(product);
            renderCart();
        })
        .catch(error => {
            console.error(error);
            productContainer.innerHTML = "<p>Sorry, failed to load product details.</p>";
        });
}

function displayProduct(product) {
    const sizes = product.sizes || [];
    const onSale = product.onSale;
    const priceHTML = onSale
        ? `<p class="price"><s>$${product.price.toFixed(2)}</s> <span style="color:red; font-weight:bold;">$${product.discountedPrice.toFixed(2)}</span></p>`
        : `<p class="price">$${product.price.toFixed(2)}</p>`;

    const sizeOptions = sizes
        .map(size => `<option value="${size}">${size}</option>`)
        .join("");

    productContainer.innerHTML = `
        <div class="product-detail-card">
        <img src="${product.image}" alt="${product.title}" class="product-image" />
        <div class="product-info">
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        ${priceHTML}
        <p><strong>Gender:</strong> ${product.gender || "N/A"}</p>
        <p><strong>Base Color:</strong> ${product.baseColor || "N/A"}</p>
        <div class="size-selector">
        <label for="size-select">Select size:</label>
        <select id="size-select" aria-label="Select product size">
        <option value="" disabled selected>Select size</option>
        ${sizeOptions}
        </select>
        </div>
        <button class="add-to-cart-btn" id="add-to-cart-btn" disabled>Add to Cart</button>
        </div>
        </div>
    `;

    const sizeSelect = document.getElementById("size-select");
    const addToCartBtn = document.getElementById("add-to-cart-btn");

    sizeSelect.addEventListener("change", () => {
        addToCartBtn.disabled = !sizeSelect.value;
    });

    addToCartBtn.addEventListener("click", () => {
        const selectedSize = sizeSelect.value;
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }
        addToCart({ ...product, selectedSize });
    });
}

// Cart functionallity
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
        item => item.id === product.id && item.selectedSize === product.selectedSize
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.title} (${product.selectedSize}) added to cart!`);
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

    if (!cartItems || !cartTotal || !cartCount) {
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const priceToUse = item.onSale ? item.discountedPrice : item.price;
        total += priceToUse * item.quantity;
        count += item.quantity;

        const li = document.createElement("li");
        li.innerHTML = `
        ${item.title} (${item.selectedSize}) x ${item.quantity} - $${(priceToUse * item.quantity).toFixed(2)}
        <button onclick="removeFromCart('${item.id}', '${item.selectedSize}')">Remove</button>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = count;
}

function toggleCart() {
    const cartDropdown = document.getElementById("cart-dropdown");
    if (!cartDropdown) return;
    cartDropdown.classList.toggle("hidden");
}

document.addEventListener("click", function (event) {
    const cartDropdown = document.getElementById("cart-dropdown");
    const cartIcon = document.querySelector(".cart-icon");

    if (!cartDropdown || !cartIcon) return;

    if (
        !cartDropdown.classList.contains("hidden") &&
        !cartDropdown.contains(event.target) &&
        !cartIcon.contains(event.target)
    ) {
        cartDropdown.classList.add("hidden");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    const checkoutBtn = document.getElementById("checkout-button");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }
});
