$(document).ready(function() {
        $.getJSON("products.json", function(products) {
            let productHTML = "";

            products.forEach(product => {
                productHTML += `
                    <div class="grid-box" style="width:100%; max-width:25%; height:auto; padding: 0px; margin: 0px;">
                        <div class="inner">
                            <div class="image">
                                <a href="${product.link}">
                                    <img onerror="imgError(this);" class="flipper" data-qazy="true"
                                         src="${product.image}" data-flipper="${product.flipper}"
                                         title="${product.title}" alt="${product.title}">
                                </a>
                            </div>
                            <div class="name">
                                <a href="${product.link}">${product.name}</a>
                            </div>
                            <div class="price">${product.price}</div>
                        </div>
                    </div>
                `;
            });

            $("#product-container").html(productHTML);
        });
    });

    // Handle broken images
    function imgError(image) {
        image.onerror = null;
        image.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
    }