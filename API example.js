// Function to fetch and display categories
function fetchCategories() {
    axios.get("http://localhost:3000/api/categories/") // Replace with your API URL
        .then(function (response) {
            const categories = response.data;
            const categoriesDiv = document.getElementById("categories");
            categoriesDiv.innerHTML = ""; // Clear existing categories

            categories.forEach(category => {
                const categoryDiv = document.createElement("div");
                categoryDiv.className = "category-item";
                // categoryDiv.dataset.id = category.id; // Uncomment to use category IDs

                const name = document.createElement("h3");
                name.textContent = category.name;

                categoryDiv.appendChild(name);

                // Add click event to fetch products of the category
                categoryDiv.addEventListener("click", function () {
                    fetchProducts(category.id); // Replace with your parameter
                });

                categoriesDiv.appendChild(categoryDiv);
            });
        })
        .catch(function (error) {
            console.error("Error fetching categories:", error);
        });
}

// Function to fetch and display products of a category
function fetchProducts(categoryId) {
    axios.get(`http://localhost:3000/api/categories/${categoryId}/products`) // Replace with your API URL
        .then(function (response) {
            const products = response.data;
            const productsDiv = document.getElementById("products");
            productsDiv.innerHTML = ""; // Clear existing products

            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product-item";

                const img = document.createElement("img");
                img.src = product.img;
                img.alt = product.name;

                const name = document.createElement("h3");
                name.textContent = product.name;

                const description = document.createElement("p");
                description.textContent = product.description;

                const addToCartButton = document.createElement("button");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.addEventListener("click", function () {
                    addToCart(product);
                });

                productDiv.appendChild(img);
                productDiv.appendChild(name);
                productDiv.appendChild(description);
                productDiv.appendChild(addToCartButton);

                productsDiv.appendChild(productDiv);
            });
        })
        .catch(function (error) {
            console.error("Error fetching products:", error);
        });
}

// Function to add a product to the cart
function addToCart(product) {
    const cartCountElement = document.getElementById("cartCount");
    let cartCount = parseInt(cartCountElement.textContent);
    cartCount += 1;
    cartCountElement.textContent = cartCount;
    console.log("Product added to cart:", product);
}

// Open and close modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Event listeners for modal buttons
document.getElementById("cartButton").addEventListener("click", function () {
    openModal("cart");
});

document.getElementById("paymentButton").addEventListener("click", function () {
    openModal("paymentModal");
});

document.getElementById("payNowButton").addEventListener("click", function () {
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;

    // Log payment details for now
    console.log("Payment details submitted:", { cardNumber, expiryDate, cvv });

    // Close the payment modal after submission
    closeModal("paymentModal");
});

// Fetch categories on page load
window.onload = fetchCategories;
