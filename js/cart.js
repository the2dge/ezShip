
    let cart = []; // Array to store cart items

    $(document).ready(function() {
        $.getJSON("products.json", function(products) {
            let productHTML = "";

            products.forEach(product => {
                let productId = product.link.split("product_id=")[1];

                productHTML += `
                    <div class="grid-box" style="width:100%; max-width:25%; height:auto; padding: 0px; margin: 0px;" data-id="${productId}">
                        <div class="inner">
                            <div class="image">
                                <a href="javascript:void(0);">
                                    <img onerror="imgError(this);" class="flipper" data-qazy="true"
                                         src="${product.image}" data-flipper="${product.flipper}"
                                         title="${product.title}" alt="${product.title}">
                                </a>
                            </div>
                            <div class="name">
                                <a href="javascript:void(0);">${product.name}</a>
                            </div>
                            <div class="price">${product.price}</div>
                        </div>
                    </div>
                `;
            });

            $("#product-container").html(productHTML);

            // Click event to load product details from item.json
            $(".grid-box").click(function() {
                let productId = $(this).attr("data-id");

                console.log("Product clicked. ID:", productId); // Debugging

                // Fetch item details from item.json
                $.getJSON("item.json", function(items) {
                    let selectedItem = items.find(item => item.id === productId);

                    if (selectedItem) {
                        console.log("Product found in item.json:", selectedItem); // Debugging

                        let productDetailsHTML = `
                            <button id="back-to-home" class="btn btn-primary" style="margin-bottom: 15px;">🏠 返回首頁</button>
                            <section id="maincontent" class="product-info span12" role="main">
                                <div class="mainborder">
                                    <div class="row-fluid">
                                        <div class="leftcol">
                                            <div id="main-image" class="image">
                                                <a class="fancybox-product" href="${selectedItem.mainIMG}" title="${selectedItem['mainIMG-title']}">
                                                    <img id="zoom1" src="${selectedItem.mainIMG}" alt="${selectedItem['mainIMG-title']}">
                                                </a>
                                            </div>
                                            <div id="image-additional-container" class="image-additional">
                                                <ul id="image-additional">
                                                    <li><a data-fancybox="gallery" href="${selectedItem.galleryImg1}"><img src="${selectedItem.galleryImg1}" alt=""></a></li>
                                                    <li><a data-fancybox="gallery" href="${selectedItem.galleryImg2}"><img src="${selectedItem.galleryImg2}" alt=""></a></li>
                                                    <li><a data-fancybox="gallery" href="${selectedItem.galleryImg3}"><img src="${selectedItem.galleryImg3}" alt=""></a></li>
                                                    <li><a data-fancybox="gallery" href="${selectedItem.galleryImg4}"><img src="${selectedItem.galleryImg4}" alt=""></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="rightcol">
                                            <div class="price">
                                                <span class="product-sell-price">${selectedItem.price}</span>
                                            </div>
                                            <div class="description">
                                                <p>${selectedItem.description}</p>
                                            </div>
                                            <div class="options">
                                                <label for="option">${selectedItem['option-title']}</label>
                                                <select id="product-option" name="option">
                                                    <option value="">--- 請選擇 ---</option>
                                                    <option value="${selectedItem.option1}">${selectedItem.option1}</option>
                                                    <option value="${selectedItem.option2}">${selectedItem.option2}</option>
                                                </select>
                                            </div>
                                            <button id="add-to-cart" class="btn btn-success" 
                                                data-id="${selectedItem.id}" 
                                                data-name="${selectedItem.name}" 
                                                data-price="${selectedItem.price}" 
                                                data-image="${selectedItem.mainIMG}">
                                                🛒 加入購物車
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        `;

                        $("#item_wrapper").html(productDetailsHTML);

                        // Hide content-wrapper and show item_wrapper with smooth scrolling
                      /*    $("#content-wrapper").fadeOut("fast", function() {
                            $("#item_wrapper").fadeIn("fast");
                        });*/
                       $("#content-wrapper").fadeOut("fast", function() {
                            $("#item_wrapper").fadeIn("fast", function() {
                                // Scroll to #item_wrapper after it becomes visible
                                $("html, body").animate({
                                    scrollTop: $("#item_wrapper").offset().top
                                }, 600); // Adjust speed if needed
                            });
                        });

                        // Event listener for Back to Home button
                        $("#back-to-home").click(function() {
                            $("#item_wrapper").fadeOut("fast", function() {
                                $("#content-wrapper").fadeIn("fast");
                            });
                        });

                        // Event listener for Add to Cart button
                        $("#add-to-cart").click(function() {
                            let selectedOption = $("#product-option").val();
                            if (selectedOption === "") {
                                alert("請選擇一個選項");
                                return;
                            }

                            let productId = $(this).data("id");
                            let productName = $(this).data("name") + " (" + selectedOption + ")";
                            let productPrice = parseFloat($(this).data("price").replace("$", "")); // Convert to number
                            let productImage = $(this).data("image");

                            if (!productImage) {
                                console.error("Image not found for product:", productName);
                                productImage = "https://via.placeholder.com/50?text=No+Image"; // Fallback image
                            }

                            // Check if the item is already in the cart
                            let existingItem = cart.find(item => item.id === productId && item.option === selectedOption);

                            if (existingItem) {
                                existingItem.quantity += 1; // Increase quantity
                                existingItem.totalPrice += productPrice; // Update total price
                            } else {
                                // Add new item to cart
                                cart.push({
                                    id: productId,
                                    name: productName,
                                    price: productPrice,
                                    totalPrice: productPrice, // Initial total price
                                    image: productImage,
                                    option: selectedOption,
                                    quantity: 1 // Start with quantity 1
                                });
                            }

                            updateCart();
                            alert("已加入購物車：" + productName);
                        });
                    } else {
                        console.log("Product not found in item.json"); // Debugging
                        $("#item_wrapper").html("<p>商品未找到</p>");
                    }
                });
            });
        });
    });

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
