// Global cart array
let cart = [];
$(document).ready(function() {
    let allProducts = [];
    
    $.getJSON("products.json", function(products) {
        allProducts = products;
        renderProducts(allProducts);
        
        // Add click event listeners to category buttons
        $(".category-btn").on("click", function() {
            // Remove active class from all buttons
            $(".category-btn").removeClass("active");
            
            // Add active class to clicked button
            $(this).addClass("active");
            
            // Get selected category
            const selectedCategory = $(this).data("category");
            
            // Filter products based on selected category
            if (selectedCategory === "all") {
                renderProducts(allProducts);
            } else {
                const filteredProducts = allProducts.filter(product => 
                    product.category === selectedCategory
                );
                renderProducts(filteredProducts);
            }
        });
    });
    
    // Function to render products
    function renderProducts(products) {
        let productHTML = "";
        products.forEach(product => {
            productHTML += `
                <div class="grid-box" data-id="${product.id}" style="width:100%; max-width:25%; height:auto; padding: 0px; margin: 0px;">
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
        
        // Add click event to the newly rendered product boxes
        attachProductClickHandlers();
    }
    
    // Function to attach click handlers to product boxes
    function attachProductClickHandlers() {
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
    }
});
    // Handle broken images
/*
    function imgError(image) {
        image.onerror = null;
        image.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
    }
    */
 