
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

                $("#content-wrapper").hide(); // Hide the grid section

                // Fetch item details from item.json
                $.getJSON("items.json", function(items) {
                    let selectedItem = items.find(item => item.id === productId);

                    if (selectedItem) {
                        let productDetailsHTML = `
                            <button id="back-to-home" class="btn btn-primary" style="margin-bottom: 15px;">🏠 返回首頁</button>
                            <section id="maincontent" class="product-info span12" role="main">
                                <div class="mainborder">
                                    <div class="row-fluid">
                                        <div class="leftcol">
                                            <div id="main-image" class="image" style="padding:0px;overflow:hidden;min-height:initial;">
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
                                                <select name="option">
                                                    <option value="">--- 請選擇 ---</option>
                                                    <option value="${selectedItem.option1}">${selectedItem.option1}</option>
                                                    <option value="${selectedItem.option2}">${selectedItem.option2}</option>
                                                </select>
                                            </div>
                                            <button id="add-to-cart" class="btn btn-success" data-id="${selectedItem.id}" data-name="${selectedItem.name}" data-price="${selectedItem.price}">
                                                🛒 加入購物車
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </section>
                        `;

                        $("#item_wrapper").html(productDetailsHTML);
                        // Event listener for Back to Home button
                        $("#back-to-home").click(function() {
                            $("#item_wrapper").fadeOut("fast", function() {
                                $("#content-wrapper").fadeIn("fast");
                            });
                        });
                    } else {
                        $("#item_wrapper").html("<p>商品未找到</p>");
                    }
                });
            });
        });
    });

    // Handle broken images
    function imgError(image) {
        image.onerror = null;
        image.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
    }
