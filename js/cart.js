
    // Function to update the cart total
function updateCart() {
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); // Count total quantity of all items

    if (totalItems > 0) {
        $(".badge").removeClass("hidden").text(totalItems); // Show badge with item count
    } else {
        $(".badge").addClass("hidden"); // Hide badge if no items in cart
    }

    let totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    $("#cart-total").html(`${totalItems} 件商品 $${totalPrice.toFixed(2)}`);
}

    // Handle broken images
    function imgError(image) {
        image.onerror = null;
        image.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
    }
        function openSideCart() {
        $("#cart-overlay").fadeIn();
        $("#side-cart").addClass("open");
        updateSideCart();
    }

    function closeSideCart() {
        $("#cart-overlay").fadeOut();
        $("#side-cart").removeClass("open");
    }

function updateSideCart() {
    let sideCartContent = $("#side-cart-content");
    sideCartContent.html(""); // Clear existing content

    if (cart.length === 0) {
        sideCartContent.html("<p>購物車是空的</p>");
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            total += item.totalPrice; // Use total price from the item

            sideCartContent.append(`
                <div class="side-cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-thumb">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-quantity">數量: ${item.quantity}</span>
                        <span class="cart-item-price">總價: ${item.totalPrice.toFixed(2)}</span>
                    </div>
                    <span class="remove-item" data-index="${index}">❌</span>
                </div>
            `);
        });

        $("#side-cart-total").text(`${total.toFixed(2)}`);
    }
}

// Remove item from cart
$(document).on("click", ".remove-item", function() {
    let index = $(this).data("index");

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1; // Decrease quantity
        cart[index].totalPrice -= cart[index].price; // Decrease total price
    } else {
        cart.splice(index, 1); // Remove item if quantity reaches zero
    }

    updateSideCart();
    updateCart();
});

    // Close Side Cart Events
    $("#close-side-cart, #cart-overlay").click(closeSideCart);

    // Open Side Cart on Click
    $("#shopping-cart-list").on("click", function() {
        openSideCart();
        return false;
    });
    // PC Version Cart Icon Click Event
    $("#cart").on("click", function() {
        openSideCart();
        return false;
    });

function generateOrderId() {
        // Get current date
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1; // Get month (1-based)
        let orderNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number

        // Generate the order prefix based on months since Jan 2025
        let monthPrefix = String.fromCharCode(65 + (month - 1)); // A = Jan 2025, B = Feb 2025, ..., M = Jan 2026

        return `A${monthPrefix}${orderNumber}`;
}


$("#checkout-btn").click(function() {
        let orderId = generateOrderId();
        let time = new Date().toISOString();
        let memberId = localStorage.getItem("memberId") || null; // Retrieve memberId if available, otherwise null
        let items = cart.map(item => `${item.name} x${item.quantity}`);
        let totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
   
        let orderData = {
            time: time,
            memberId: memberId,
            orderId: orderId,
            items: items,
            total: totalPrice.toFixed(2)
        };

        console.log("Sending Order Data:", orderData); // Debugging log

        // Send data to GCF endpoint
        fetch("https://mrbean-website-save-to-sheet-545199463340.us-central1.run.app", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Order recorded:", data);
            
            // Delay before redirecting
            setTimeout(() => {
                window.location.href = `https://www.mrbean.tw/order/?MerchantTradeNo=${orderId}`;
            }, 2000); // Redirect after 2 seconds
        })
        .catch(error => {
            console.error("Error sending order:", error);
            alert("結帳時發生錯誤，請稍後再試。");
        });
});
