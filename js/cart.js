// =====================================================
// LETS GO ANIME - SHOPPING CART
// =====================================================

console.log("CART.JS LOADED");

let cart = JSON.parse(localStorage.getItem("animeCart")) || [];


// =====================================================
// SAVE CART
// =====================================================

function saveCart() {
    localStorage.setItem("animeCart", JSON.stringify(cart));
}


// =====================================================
// ADD TO CART
// =====================================================

function addToCart(product) {

    const existingProduct = cart.find(function(item) {
        return item.id === product.id;
    });

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();

    console.log("Added to cart:", product);
}


// =====================================================
// CART COUNT
// =====================================================

function updateCartCount() {

    const cartCount = document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    let totalItems = 0;

    cart.forEach(function(item) {
        totalItems += item.quantity;
    });

    cartCount.textContent = totalItems;
}


// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const cartItems = document.getElementById("cart-items");

    if (!cartItems) {
        return;
    }

    const emptyCart = document.getElementById("empty-cart");
    const cartSummary = document.getElementById("cart-summary");

    // EMPTY CART
    if (cart.length === 0) {

        cartItems.innerHTML = "";

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        if (cartSummary) {
            cartSummary.style.display = "none";
        }

        return;
    }


    // CART HAS PRODUCTS

    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    if (cartSummary) {
        cartSummary.style.display = "block";
    }

    cartItems.innerHTML = "";


    cart.forEach(function(product) {

        const item = document.createElement("div");

        item.className = "cart-item";


        item.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="cart-item-image"
            >

            <div class="cart-item-info">

                <h3>${product.name}</h3>

                <p>
                    KSh ${product.price.toLocaleString()}
                </p>

                <div class="quantity-controls">

                    <button
                        class="quantity-btn"
                        data-action="decrease"
                        data-id="${product.id}">
                        −
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        class="quantity-btn"
                        data-action="increase"
                        data-id="${product.id}">
                        +
                    </button>

                </div>

                <button
                    class="remove-item"
                    data-id="${product.id}">
                    Remove
                </button>

            </div>

            <div class="cart-item-total">

                KSh ${(
                    product.price * product.quantity
                ).toLocaleString()}

            </div>
        `;

        cartItems.appendChild(item);

    });


    updateCartSummary();
}


// =====================================================
// UPDATE SUMMARY
// =====================================================

function updateCartSummary() {

    let totalItems = 0;
    let subtotal = 0;


    cart.forEach(function(item) {

        totalItems += item.quantity;

        subtotal +=
            item.price * item.quantity;

    });


    const itemsElement =
        document.getElementById("cart-total-items");

    const subtotalElement =
        document.getElementById("cart-subtotal");


    if (itemsElement) {
        itemsElement.textContent = totalItems;
    }


    if (subtotalElement) {
        subtotalElement.textContent =
            subtotal.toLocaleString();
    }
}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(productId, change) {

    const product = cart.find(function(item) {
        return item.id === productId;
    });


    if (!product) {
        return;
    }


    product.quantity += change;


    if (product.quantity <= 0) {

        cart = cart.filter(function(item) {
            return item.id !== productId;
        });

    }


    saveCart();

    updateCartCount();

    displayCart();
}


// =====================================================
// REMOVE PRODUCT
// =====================================================

function removeFromCart(productId) {

    cart = cart.filter(function(item) {
        return item.id !== productId;
    });


    saveCart();

    updateCartCount();

    displayCart();
}


// =====================================================
// CLEAR CART
// =====================================================

function clearCart() {

    cart = [];

    saveCart();

    updateCartCount();

    displayCart();
}


// =====================================================
// ALL BUTTONS
// =====================================================

document.addEventListener("click", function(event) {


    // ADD TO CART

    const addButton =
        event.target.closest(".add-to-cart");


    if (addButton) {

        const product = {

            id: addButton.dataset.id,

            name: addButton.dataset.name,

            price: Number(
                addButton.dataset.price
            ),

            image: addButton.dataset.image

        };


        addToCart(product);

        return;
    }


    // QUANTITY BUTTON

    const quantityButton =
        event.target.closest(".quantity-btn");


    if (quantityButton) {

        const id =
            quantityButton.dataset.id;

        const action =
            quantityButton.dataset.action;


        if (action === "increase") {
            changeQuantity(id, 1);
        }


        if (action === "decrease") {
            changeQuantity(id, -1);
        }


        return;
    }


    // REMOVE BUTTON

    const removeButton =
        event.target.closest(".remove-item");


    if (removeButton) {

        removeFromCart(
            removeButton.dataset.id
        );

        return;
    }


    // CLEAR CART

    if (event.target.id === "clear-cart") {

        clearCart();

        return;
    }


    // CHECKOUT

    if (event.target.id === "checkout-btn") {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        alert(
            "Checkout will be connected next."
        );

    }

});


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log("Cart items:", cart);

        updateCartCount();

        displayCart();

    }
);