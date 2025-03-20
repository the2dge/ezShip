
function initMarquee(idx) {
	var items = $('.simple-marquee-container[data-id="'+idx+'"] .marquee-content-items > li').length;
	if( items ) {
		var qspeed = 55000;
		var maxwidth = $("#body-outer-container").innerWidth();
		$('.simple-marquee-container[data-id="'+idx+'"]').fadeIn();
		if( !is.mobile() ) {
			$('.simple-marquee-container[data-id="'+idx+'"] .marquee-content-items > li').attr("style", "min-width:" + maxwidth + "px");
			qspeed = 55000 + ( (items-1) * 15000 );
		} else {
			$('.simple-marquee-container[data-id="'+idx+'"] .marquee-content-items > li').attr("style", "margin-right:60px;");
			qspeed = 25000 + ( (items-1) * 15000 );
		}
		
		if (!!$.prototype.SimpleMarquee){
			$('.simple-marquee-container[data-id="'+idx+'"]').SimpleMarquee({
				duration: qspeed
			});
		} else {
			$.getScript( "js/marquee.js", function( data, textStatus, jqxhr ) {
				$('.simple-marquee-container[data-id="'+idx+'"]').SimpleMarquee({
					duration: qspeed
				});
			});
		}
	}
}
setTimeout(function(){
	try {
				initMarquee(1);
				$(".simple-marquee-container-wrapper[data-id!='1']").remove();
		$(".simple-marquee-container-wrapper").not(':first').remove();
	} catch (e) { }
}, 2000);
			$(document).ready(function() {
				var j = 0;
				var delay = 3000; 
				function cycleStickyBarTop(){
					var jmax = $(".sticky-bar-top .sticky-bar-content").length -1;
					if(jmax > 0){
						$(".sticky-bar-top .sticky-bar-content:eq(" + j + ")")
						.animate({"opacity" : "1","z-index":"9998"} ,400)
						.animate({"opacity" : "1","z-index":"9998"}, delay)
						.animate({"opacity" : "0","z-index":"9"}, 400, function(){
							(j == jmax) ? j=0 : j++;
							cycleStickyBarTop();
						});
					}else{
						$(".sticky-bar-top .sticky-bar-content:eq(" + j + ")")
						.animate({"opacity" : "1","z-index":"9998"}, delay)
					}
				};
				cycleStickyBarTop();
				
				var i = 0;
				function cycleStickyBarBottom(){
					var imax = $(".sticky-bar-bottom .sticky-bar-content").length -1;
					if(imax > 0){
						$(".sticky-bar-bottom .sticky-bar-content:eq(" + i + ")")
						.animate({"opacity" : "1","z-index":"9998"} ,400)
						.animate({"opacity" : "1","z-index":"9998"}, delay)
						.animate({"opacity" : "0","z-index":"9"}, 400, function(){
							(i == imax) ? i=0 : i++;
							cycleStickyBarBottom();
						});
					}else{
						$(".sticky-bar-bottom .sticky-bar-content:eq(" + i + ")")
						.animate({"opacity" : "1","z-index":"9998"}, delay)
					}
					
				};
				cycleStickyBarBottom();
				
				var k = 0;
				function cycleStickyBarTopMobile(){
					var kmax = $(".mobile-sticky-bar-top .sticky-bar-content").length -1;
					if(kmax > 0){
						$(".mobile-sticky-bar-top .sticky-bar-content:eq(" + k + ")")
						.animate({"opacity" : "1","z-index":"9998"} ,400)
						.animate({"opacity" : "1","z-index":"9998"}, delay)
						.animate({"opacity" : "0","z-index":"9"}, 400, function(){
							(k == kmax) ? k=0 : k++;
							cycleStickyBarTopMobile();
						});
					}else{
						$(".mobile-sticky-bar-top .sticky-bar-content:eq(" + k + ")")
						.animate({"opacity" : "1","z-index":"9998"}, delay)
					}
				};
				cycleStickyBarTopMobile();
				
				//COUNTDOWN TIMER
				$(".sticky-bar-countdown").each(function(){
					
					var sticky_bar_date = $(this).attr("data-countdown-date").replace(/-/g,'/');
					var sticky_bar_countdown_id = $(this).attr("id");
					var countDownDate = new Date(sticky_bar_date).getTime();

					var x = setInterval(function() {
					
						var now = new Date().getTime();
						
						var distance = countDownDate - now;
						
						var days = Math.floor(distance / (1000 * 60 * 60 * 24));
						var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
						var seconds = Math.floor((distance % (1000 * 60)) / 1000);
						
						if(hours<10){
							var hours1 = "0"+hours;
						}else{
							var hours1 = hours;
						}
						if(minutes<10){
							var minutes1 = "0"+minutes;
						}else{
							var minutes1 = minutes;
						}
						if(seconds<10){
							var seconds1 = "0"+seconds;
						}else{
							var seconds1 = seconds;
						}
						
						if( $("#" + sticky_bar_countdown_id).length ) {
							document.getElementById(sticky_bar_countdown_id).innerHTML = " "+days+ " DAY " + hours1 + ": "
						+ minutes1 + ": " + seconds1 + " ";
						}
						
						if (distance < 0) {
							clearInterval(x);
							//document.getElementById(sticky_bar_countdown_id).innerHTML = "-";
							$("#"+sticky_bar_countdown_id).remove();
						}
					}, 1000);
					
				 });
				
			});
			 
			jQuery.ajaxPrefilter( function( s ) {
				if ( s.crossDomain ) {
					s.contents.script = false;
				}
			});
			
			var loc = window.location.href, index = loc.indexOf('#');
			if (index > 0) {
				try {
					var urlHash = loc.split("#")[1];
					if( urlHash ) {
						if( $('#' + urlHash).length ) {
							$('html,body').animate({
								scrollTop: $('#' + urlHash).offset().top
							}, 1200);
						} else {
							window.location = loc.substring(0, index) + "&" + loc.substring(index+1);
						}
					}
				} catch(err) { }
			}
			
			var readyInitPage = 1;
			var doAdjust = true;
			var doAdjustCounter = 0;
			var jsLoadTimeout = null;
			var previousWidth = 0;
			var maxHeight = 0;
			var flipper_random_status = 0;
			var float_banner_count = 1;
			var lazy = 1;
			var transInitial = -280;
			var mDistance = 0;
					
			if (window!= top) top.location.href = location.href;
			
			//20210713 add menu url target
		 	$(".pushy-submenu button span").click(function(){
				if($(this).attr("target")){
					$(this).removeClass("pushy-submenu-parent");
					if($(this).parents("li").hasClass("pushy-submenu-open")){
						window.open($(this).data("url"),"_blank");
					}
				}
			});

			$(".pushy-menu-storename span").click(function(){
				$("#myBody").removeClass("pushy-open-left");
			});
			
			function getScript(url,success){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = url;
			var head=document.getElementsByTagName('head')[0], done=false;
			script.onload=script.onreadystatechange = function(){
			  if ( !done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') ) {
				done=true;
				success();
				script.onload = script.onreadystatechange = null;
				head.removeChild(script);
			  }
			};
			head.appendChild(script);
			}
						
			function getParams(a){var b=document.getElementsByTagName("script");for(var i=0;i<b.length;i++){if(b[i].src.indexOf("/"+a)>-1){var c=b[i].src.split("?").pop().split("&");var p={};for(var j=0;j<c.length;j++){var d=c[j].split("=");p[d[0]]=d[1]}return p}}return{}}
			
			function adjustBoxHeights() {
				maxHeight1 = 270;
				maxHeight2 = 270;
				maxHeight3 = 270;
				maxHeight4 = 270;
				maxHeight5 = 270;
				
				$('.content-top .product-box > div').each(function(){
					$(this).height('auto');
					if (maxHeight2 < $(this).height()) { maxHeight2 = $(this).height(); }
				});
				$('.content-top .product-box > div').each(function(){
					if( maxHeight2 ) {
						$(this).height(maxHeight2);
					}
				});
				
				$('.content-bottom .product-box > div').each(function(){
					$(this).height('auto');
					if (maxHeight3 < $(this).height()) { maxHeight3 = $(this).height(); }
				});
				$('.content-bottom .product-box > div').each(function(){
					if( maxHeight3 ) {
						$(this).height(maxHeight3);
					}
				});
				
				$('.product-grid > div').each(function(){
					var img_src = $(this).find(".image img[src]").attr("src");
					try {
						var img_src_ext = img_src.split('.').pop().toLowerCase();
					} catch(err) {
						img_src_ext = "";
					}
					$(this).height('auto');
					if( $( "#myBody" ).hasClass("product-category") ){
						img_src_ext = "";
					}
					if( img_src_ext != "gif" ) {
						if (maxHeight1 < $(this).height()) { maxHeight1 = $(this).height(); }
					} else {
						$(this).addClass("gif-tag");
					}
				});
				var img_gif_height = 0;
				$('.product-grid > div').each(function(){
					var img_src = $(this).find(".image img[src]").attr("src");
					try {
						var img_src_ext = img_src.split('.').pop().toLowerCase();
					} catch(err) {
						img_src_ext = "";
					}
					if( maxHeight1 ){
						$(this).height(maxHeight1);
						if( img_src_ext != "gif" ) {
							img_gif_height = $(this).find(".image img").height();
						}
					}
				});
				$('.product-grid > div.gif-tag').attr("style","");
				if( img_gif_height ) {
					$('.product-grid > div.gif-tag').find(".image img").attr("style","height:" + img_gif_height + "px;width:auto;");
				}
				
				$('.box-content').each(function(index,elmain){
					$(elmain).find('.product-box').each(function(index,el){
						maxHeight1 = 0;
						$(el).find('.grid-box').each(function(index,el2){
							$(el2).height('auto');
						});
						$(el).find('.grid-box .inner').each(function(index,el2){
							if (maxHeight1 < $(el2).height()) { maxHeight1 = $(el2).height(); }
						});
						maxHeight1 = maxHeight1 + 18;
						$(el).find('.grid-box').each(function(index,el2){
							if( maxHeight1 ) {
								$(el2).height(maxHeight1);
							}
						});
					});
				});
				
				$('#related-products').each(function(index,elmain){
					$(elmain).imagesLoaded(function(){
						$(this).find('.product-box').each(function(index,el){
							maxHeight1 = 0;
							$(el).find('.grid-box').each(function(index,el2){
								$(el2).height('auto');
							});
							$(el).find('.grid-box .inner').each(function(index,el2){
								if (maxHeight1 < $(el2).height()) { maxHeight1 = $(el2).height(); }
							});
							maxHeight1 = maxHeight1 + 36;
							if( maxHeight1 < 220 ) maxHeight1 = 220;
							if( !is.mobile() ) {
								if( maxHeight1 < 340 ) maxHeight1 = 340;
							}
							$(el).find('.grid-box').each(function(index,el2){
								if( maxHeight1 ) {
									$(el2).height(maxHeight1);
								}
							});
						});
					});
				});
				
				$('.content-bottom #related-products').each(function(index,elmain){
					var contentset_height = parseInt($('.content-bottom #related-products .contentset').height());
					if( contentset_height ) contentset_height = contentset_height + 70;
					$(elmain).imagesLoaded(function(){
						$(this).find('.product-box').each(function(index,el){
							maxHeight1 = 0;
							$(el).find('.grid-box').each(function(index,el2){
								$(el2).height('auto');
							});
							$(el).find('.grid-box .inner').each(function(index,el2){
								if (maxHeight1 < $(el2).height()) { maxHeight1 = $(el2).height(); }
							});
							maxHeight1 = maxHeight1 + 36 + contentset_height;
							if( maxHeight1 < 220 ) maxHeight1 = 220;
							if( !is.mobile() ) {
								if( maxHeight1 < 340 ) maxHeight1 = 340;
							}
							$(el).find('.grid-box').each(function(index,el2){
								if( maxHeight1 ) {
									$(el2).height(maxHeight1);
								}
							});
						});
					});
				});
				
				$('.any-products').each(function(index,el){
					
					if(is.mobile()){
						$(el).find(".grid-box").attr("style","");
					}
					
					maxHeight5 = 0;
					$(el).find('.any-box > div').each(function(index,el2){
						$(el2).height('auto');
						if (maxHeight5 < $(el2).height()) { maxHeight5 = $(el2).height(); }
					});
					$(el).find('.any-box > div').each(function(index,el2){
						if( maxHeight5 ) {
							$(el2).height(maxHeight5);
						}
					});
					$(el).find('.grid-box > .inner').each(function(index,el2){
						$(el2).css("display", "block");
					});
				});
			}
			
			var supportsNatural = ( "naturalWidth" in (new Image()) );
			
			function initDeferImages() {
				[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
					img.setAttribute('src', img.getAttribute('data-src'));
					img.onload = function() {
						this.removeAttribute('data-src');
						if (this.style.opacity !== undefined) {
							this.style.opacity = 1;
						}
						var naturalWidth = supportsNatural ? this.naturalWidth : $(this).width();
						if( naturalWidth == 0 ) {
							this.src += '?timestamp=' + new Date().getTime();
						}
					};
				});
				$(".grid-box img,.product-row img").each(function(){
					var _this = $(this);
					_this.imagesLoaded(function(){
						_this.animate({opacity: 1.0}, 100);
						_this.closest('.grid-box').find('.onsale').removeClass("hidden");
						_this.closest('.grid-box').find('.name').removeClass("hidden");
						_this.closest('.grid-box').find('.price').removeClass("hidden");
						_this.closest('.grid-box').find('.label-important').removeClass("hidden");
						_this.closest('.grid-box').find('.load-thumb-conver').remove();
						_this.closest('.product-row').find('.load-thumb-conver').remove();
						try { 
							if (typeof _this.data('flipper') !== 'undefined') {
								_this.flipper(); 
							}
						} catch(err) { }
						_this.height('auto');
						if( (lazy == $(".grid-box img").length) ) { adjustBoxHeights(); }
						lazy++;
					});
				});
			}
			
			function updateCartProductCount() {
				$.get("index.php?route=module/cart/GetProductTotal", function(data) {
					$("#shopping-cart-list .badge").html(data);
					if(data>0){
						$("#shopping-cart-list .badge").removeClass("hidden");
						$("#shopping-cart-list .badge").removeClass("animated");
						$("#shopping-cart-list .badge").addClass("animated bounce");
					} else {
						$("#shopping-cart-list .badge").addClass("hidden");
					}
				});
			}
			/*
			function updateQuantityByProductKey(key, quantity) {
				quantity = typeof(quantity) != 'undefined' ? quantity : 1;
				$.ajax({
					url: 'index.php?route=checkout/cart/updateProductQuantity',
					type: 'post',
					data: { 'quantity':quantity, 'key': key },
					dataType: 'json',
					success: function(json) {
						$.get( "index.php?route=module/cart/list", function( data ) {
							$(".slidePanel .slidePanel-content").html(data);
							updateCartProductCount();
						});
					}
				});
			}*/
			
			function removeProductFromSideCart(key, idx) {
				//var newkey = encodeURIComponent(key);
				var newkey = key;
				$.get("index.php?route=module/cart&remove=" + newkey, function(data) {
					$.get( "index.php?route=module/cart/list", function( data ) {
						$(".slidePanel .slidePanel-content").html(data);
						updateCartProductCount();
					});
				});
				$("#producr-list-" + idx).fadeOut(1200, function() { $(this).remove(); });
				return false;
			}
			
			/*
			function openSideCart(ta_product_id){
				var slidePanelVisible = $(".slidePanel").hasClass("slidePanel-show");
				if( slidePanelVisible ) {
					$("#content-wrapper").off("click");
					$.slidePanel.hide();
				} else {
					updateCartProductCount();
										$.slidePanel.show({
						url: 'index.php?route=module/cart/list'
					}, {
						direction: "left",
						duration: '500',
						mouseDrag: false,
						touchDrag: false,
						pointerDrag: false,
						loading: {
							template: function(options) {
								return '<div class="' + options.classes.loading + '"><div class="spinner"><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div></div>';
							}
						}
					});
					$("#content-wrapper").on('click', function(event) {
						$("#content-wrapper").off("click");
						$.slidePanel.hide();
						event.preventDefault();
						event.stopPropagation();
						
						var t_url = location.href; 
						var c_url = "https://mrbean.tw/cart";
						
						if(t_url == c_url){
							location.reload();
						}
						
					});
					$(".fancybox-product").on('click', function(event) {
						$.slidePanel.hide();
						event.preventDefault();
						event.stopPropagation();
						
						var t_url = location.href; 
						var c_url = "https://mrbean.tw/cart";
						
						if(t_url == c_url){
							location.reload();
						}
						
					});
									}
			}*/
			
			function gaTrackAddToCart(page, product_ids) {
				
				product_ids.forEach(function(item){
					
					try {
					
						// UA
						dataLayer.push({
						  'event': 'addToCart',
						  'ecommerce': {
							'currencyCode': 'TWD',
							'add': {
							  'products': [{
								'name': item.p_name,
								'id': item.p_id,
								'price': item.p_prices,
								'quantity': item.p_qty
							   }]
							}
						  }
						});
						
						// GA4
						dataLayer.push({
						  'event': 'add_to_cart',
						  'ecommerce': {
							'items': [{
							  'item_name': item.p_name,
							  'item_id': item.p_id,
							  'price': item.p_prices,
							  'quantity': item.p_qty
							}]
						  }
						});
						
												
										
					} catch (e) { }
					
				});
				
			}
			
			function InstantAddToCart(product_id, quantity, promotion_id, free_present_id){
				
				if( product_id && quantity ) {
					
					gecommProductToCart.product_id = product_id;
					gecommProductToCart.quantity = quantity;
					
					try {
						
						var p_name = $("[data-producttlid='"+product_id+"'] .name [itemprop='name']").html();
						var p_prices = $("[data-producttlid='"+product_id+"'] .price[data-price]").data("price");
						gecommProductToCart.product_name = p_name;
						
						gecommProductToCart.price = p_prices;
						
						// UA
						dataLayer.push({
						  'event': 'addToCart',
						  'ecommerce': {
							'currencyCode': 'TWD',
							'add': {
							  'products': [{
								'name': p_name,
								'id': product_id,
								'price': p_prices,
								'quantity': quantity
							   }]
							}
						  }
						});
						
						// GA4
						dataLayer.push({
						  'event': 'add_to_cart',
						  'ecommerce': {
							'items': [{
							  'item_name': p_name,
							  'item_id': product_id,
							  'price': p_prices,
							  'quantity': quantity
							}]
						  }
						});
						
												 var product_category = "";
												 /*
						 $.getJSON( "index.php?route=common/footer/getProductCategory&product_id=" + product_id, function( data ) {
							 
							 if(data) product_category = data;
							 
							 if(product_category != ""){
								   gtag('event', 'add_to_cart', {
									  'value': p_prices, 
									  'items': [{
									  'id'    : product_id,
									  'item_id'   : product_id,
									  'item_name'  : p_name,
									  'price'   : p_prices,
									  'quantity'  : quantity,
									  'google_business_vertical': 'retail',
									  'item_category': product_category
									  }]
								   });
							   }else{
								   gtag('event', 'add_to_cart', {
									  'value': p_prices, 
									  'items': [{
									  'id'    : product_id,
									  'item_id'   : product_id,
									  'item_name'  : p_name,
									  'price'   : p_prices,
									  'quantity'  : quantity,
									  'google_business_vertical': 'retail'
									  }]
								   });
							   }
							 
						 }); */
						 
												
												
												
												
												
												
						
						
					} catch (e) { }
					
				}
				
				$('[data-toggle="tooltip"], .tooltip').tooltip("hide");
				
				promotion_id = typeof(promotion_id) != 'undefined' ? promotion_id : -1;
				free_present_id = typeof(free_present_id) != 'undefined' ? free_present_id : -1;
				
				if(free_present_id != "-1"){
					quantity = $('input[name="quantity"]').val();
					quantity = typeof(quantity) != 'undefined' ? quantity : 1;
				}
				
				var price = $('#price-price-block .price-normal').attr('data-content');
		
				if(typeof(price) === 'undefined') price = $('#price-price-block .price-new').attr('data-content');
				
				price = typeof(price) != 'undefined' ? price : 0;
				
				try {
				
					$.fancybox.open({
						src  : 'https://mrbean.tw/index.php?route=product/instant_add&product_id=' + product_id + '&promotion_id=' + promotion_id + '&quantity=' + quantity +'&price=' + price + '&free_present_id=' + free_present_id,
						type : 'iframe',
						opts : {
							openEffect 			: 'none',
							closeEffect 		: 'none',
							closeClickOutside 	: true,
							iframe : { css : { "max-width" : '332px', "width:": '100%' } },
							beforeLoad: function() {
								$(".fancybox-container").css("zIndex", 999999993);
							}
						}
					});
				
				} catch (e) { }
			}
			
			function InstantAddToCart1(product_id, quantity, key_id, type, position){
				
				product_id = (typeof product_id !== 'undefined') ?  product_id : 0;
				quantity = (typeof quantity !== 'undefined') ?  quantity : 1;
				key_id = (typeof key_id !== 'undefined') ?  key_id : "-1";
				type = (typeof type !== 'undefined') ?  type : "";
				position = (typeof position !== 'undefined') ?  position : "";
				
				if( product_id && quantity ) {
					
					gecommProductToCart.product_id = product_id;
					gecommProductToCart.quantity = quantity;
					
					try {
						
						var p_name = $("[data-producttlid='"+product_id+"'] .name [itemprop='name']").html();
						var p_prices = $("[data-producttlid='"+product_id+"'] .price[data-price]").data("price");
						
						gecommProductToCart.price = p_prices;
						
						// UA
						dataLayer.push({
						  'event': 'addToCart',
						  'ecommerce': {
							'currencyCode': 'TWD',
							'add': {
							  'products': [{
								'name': p_name,
								'id': product_id,
								'price': p_prices,
								'quantity': quantity
							   }]
							}
						  }
						});
						
						// GA4
						dataLayer.push({
						  'event': 'add_to_cart',
						  'ecommerce': {
							'items': [{
							  'item_name': p_name,
							  'item_id': product_id,
							  'price': p_prices,
							  'quantity': quantity
							}]
						  }
						});
						
												
												
												
												
												
												
					} catch (e) { }
					
				}
				
				$('[data-toggle="tooltip"], .tooltip').tooltip("hide");
				
				if(type == "promotion"){
					var promotion_id = typeof(key_id) != 'undefined' ? key_id : -1;
					var send_value = '&promotion_id=' + promotion_id ;
				}
				
				if(type == "present"){
					var free_present_id = typeof(key_id) != 'undefined' ? key_id : -1;
					
					//if(free_present_id > 0){
						quantity = $('input[name="quantity"]').val();
						quantity = typeof(quantity) != 'undefined' ? quantity : 1;
					//}
					
					var send_value = '&free_present_id=' + free_present_id +'&position=' + position;
				}
				
				if(type == "buytogether"){
					var buy_together_id = typeof(key_id) != 'undefined' ? key_id : -1;
					
					quantity = $('input[name="quantity"]').val();
					quantity = typeof(quantity) != 'undefined' ? quantity : 1;
					
					var send_value = '&buy_together_id=' + buy_together_id +'&position=' + position;
				}
				
				var price = $('#price-price-block .price-normal').attr('data-content');
		
				if(typeof(price) === 'undefined') price = $('#price-price-block .price-new').attr('data-content');
				
				price = typeof(price) != 'undefined' ? price : 0;
				
				
				$.fancybox.open({
					src  : 'index.php?route=product/instant_add&product_id=' + product_id + '&quantity=' + quantity +'&price=' + price +send_value ,
					type : 'iframe',
					opts : {
						closeClickOutside : true,
						iframe : { css : { width : '320px' } },
						beforeLoad: function() {
							$(".fancybox-container").css("zIndex", 999999993);
						}
					}
				});
			}
			
			function closePopFancybox(){
				try { 
					$.fancybox.close(); 
					$.fancybox.destroy();
				} catch (e) { }
				if( is.desktop() ) {
					setTimeout(function(){
						$("#cart > .heading a").trigger('mouseover');	
						setTimeout(function(){ refreshMiniCartScrollBar(); }, 300);
					}, 500);
				}
			}
			
			function LastPresentsOption(html,key,qty){
				$("#lg_option_"+key).prepend(html);
				$('.last_free_presents').trigger('change');
				$('.free_present_qty').trigger('change');
			}
			
			function TriggerMyCartList(){
				if( is.not.desktop() ){
					updateCartProductCount();
					setTimeout(function(){
						$("#shopping-cart-list .badge").removeClass("animated");
						$("#shopping-cart-list .badge").addClass("animated");
						$("#shopping-cart-list .badge").addClass("bounce");
					}, 800);
				} else {
					setTimeout(function(){
						$("#cart > .heading a").trigger('mouseover');	
						setTimeout(function(){ refreshMiniCartScrollBar(); }, 300);
					}, 500);
				}
			}
			/*
			function removeCartByProductID(product_id) {
				if( is.existy(product_id) ) {
				$.ajax({
					url: 'index.php?route=module/cart&remove=' + product_id + "%3Anull%3A-1%3A0",
					type: 'post',
					dataType: 'json',
					success: function(json) {
						TriggerMyCartList();
					}
				});
				}
			}*/
			
			function updateQuantityByProductID(product_id, quantity) {
				quantity = typeof(quantity) != 'undefined' ? quantity : 1;
				$.ajax({
					url: 'index.php?route=checkout/cart/updateProductQuantity',
					type: 'post',
					data: { 'quantity':quantity, 'key': product_id+'%3Anull%3A-1%3A0' },
					dataType: 'json',
					success: function(json) {
						TriggerMyCartList();
					}
				});
			}
			
			
			function bulk_add_to_cart() {
				$("select.bulk-add-quantity").change(function() {
					var value = $("option:selected", this).val();
					var select_idx 	= $(this).data("idx");
					var product_id 	= $(this).data("productid");
					var prevval 	= $(this).data("prevval");
					
					if( value == 0 ) { 
						$(this).next(".bulk-add-quantity").addClass("no-cart"); 
						if(prevval!=0){
							removeCartByProductID(product_id);
						}
					} else { 
						$(this).next(".bulk-add-quantity").removeClass("no-cart"); 
						
						if( value == 999 ) {
							InstantAddToCart(product_id, 999); 
							$(this).next(".bulk-add-quantity").find(".current").text("+ 9");
						} else {
							if(prevval==0){
								// 第一次加入
								InstantAddToCart(product_id, value); 
							} else {
								// 更新數量
								updateQuantityByProductID(product_id, value); 
							}
						}
					}
					$(this).data("prevval", value); 
					$(this).attr("data-prevval", value); 
				});
			}
			
			function downloadJSAtOnload() {
				
				$("#myBody").removeAttr('style');
				
				if( is.not.desktop() ) {
					$('.any-products').each(function(index,el){
						$(el).find('.grid-box').each(function(index,el2){
							$(el2).attr('style','');
						});
					});
				}
				
				try {
				getScript("https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js",function(){ });
				} catch(e) { }
				
								
				var queue = $LAB.queueScript("js/core.240901.compressed.js");
				queue.queueWait(function(){ 
				
										
					$(".ajax-popup-link").unbind();
					$(".ajax-popup-link").fancybox({
						closeBtn    : true,
						closeClick  : true,
						helpers     : { 
							overlay : {closeClick: true} 
						},
						buttons : [ 'close' ],
						clickOutside : 'close',
						closeClick  : true,
						toolbar : true
					});
					
										
					var milliseconds = new Date().getTime();
					/*
					$.getJSON( "index.php?route=common/header/getLoggedInUserInfo&token=" + milliseconds + "1" + (Math.floor(Math.random() * 999) + 100), function( data ) {
						if( is.existy(data) && data.isLogged ) {
														$("#header-logged-menu > a.dropdown-toggle").prepend("<i class='fa fa-user-o'></i>");
														$("#header-logged-user").html(data.logged_user_name + data.logged_group_name);
							$("#header-mobile-user").html(data.logged_user_name + data.logged_group_name);
							$(".header-logged-menu").removeClass("hidden");
							$("#header-logged-menu").removeClass("hidden");
							$("#header-none-logged-menu").remove();
						} else {
							$(".header-logged-menu").remove();
							$("#header-logged-menu").remove();
							$(".header-none-logged-menu").removeClass("hidden");
							$("#header-none-logged-menu").removeClass("hidden");
						}
						
						if( is.not.desktop() ){
							updateCartProductCount();
							setTimeout(function(){
								$("#shopping-cart-list .badge").removeClass("animated");
								$("#shopping-cart-list .badge").addClass("animated");
								$("#shopping-cart-list .badge").addClass("bounce");
							}, 800);
						} else {
							$("#cart > .heading a").trigger('mouseover');
							$("section#cart").removeClass("active");	
							setTimeout(function(){ $("section#cart").removeClass("active"); }, 50);
						}
						
					});*/
					
					setTimeout(function(){ 
						$('.side_float_banner_wrapper').attr("style","");
						$('.banner').each(function( index ) {
							if( $(this).find("a").length == 1 ) {
								$(this).attr("style","");
							}
						});
					}, 2000);
					
					if (typeof init_inline === 'function') {
						if($("#image-additional").length){
							$.fancybox.defaults.hash = false;
						}
						setTimeout(function(){ init_inline(); }, 300);
					}

					if (typeof init_fullslideshow === 'function') { init_fullslideshow(); }
					
					$("#contact-block").removeAttr('style');
					
										if( is.not.desktop() ) {
						$('#shopping-cart-list').on('click', function() {
							openSideCart();
							return false;
						});
					}
										
					if ( $("input[name='quantity']").length > 0 ) {
						var qtyMin = $("input[name='quantity']").data("min"); 
						if(qtyMin=="" || qtyMin==undefined) qtyMin = 1;
						$("input[name='quantity']").TouchSpin({
							min: qtyMin,
							max: 99999
						});
					}
				
					$(window).resize(function() {
						if( $(window).width() < 992 ){
							$("#footer-inner-row").removeClass("offset2");
						} else {
							var data_count = $("#footer-inner-row").data("count");
							if(data_count < 1) {
								$("#footer-inner-row").addClass("offset2");	
							}
						}
					});	
					
					$("#header .flipper").each(function(){
						var imgLoad = $(this).imagesLoaded(function(){
							try { 
								if (typeof $(this).data('flipper') !== 'undefined') {
									$(this).flipper(); 
								}
							} catch(err) { }
						});
					});
					
					$('a[href*="#"]').each(function() {
						var hash = $(this).attr('href');
						if(hash=="##") return;
						if(hash=="#") return;
						if(hash=="#mobile-menu") return;
						$(this).click( function(e) {
							var url = $(this).attr('href');
							var type = url.split('#');
							var hash = '';
							if(type.length > 1)
							hash = type[1];
							if($("[name='"+hash+"']").length){
								if(hash && hash != "undefined" && hash != null && hash != undefined){
									e.preventDefault(); 
									$('html,body').animate({ scrollTop: $("[name='"+hash+"']").offset().top}, 600);
									return false;
								}
							}									
						});
					});
					
										
										
									
										
					if ( $(".masonry").length > 0 ) {
						$(".masonry").each(function(index, value) { 
							var $grid = $('.masonry').masonry();
							setTimeout(function(){ $grid.masonry('layout'); }, 2000);
						});
					}
					
					if ( $(".owl-carousel").length > 0 ) {
						$(".owl-carousel").not('[data-exclude]').each(function(index, value) { 
						
							var autoplay = is.null( $(this).attr('data-autoPlay') ) ? true : $(this).attr('data-autoPlay');
							var pagination = is.null( $(this).attr('data-pagination') ) ? false : $(this).attr('data-pagination');
							var slideSpeed = is.null( $(this).attr('data-slideSpeed') ) ? 200 : $(this).attr('data-slideSpeed');
							var paginationSpeed = is.null( $(this).attr('data-paginationSpeed') ) ? 800 : $(this).attr('data-paginationSpeed');
							var singleItem = is.null( $(this).attr('data-singleItem') ) ? true : $(this).attr('data-singleItem');
							var transitionStyle = is.null( $(this).attr('data-transitionStyle') ) ? "fade" : $(this).attr('data-transitionStyle');
							
							$(this).owlCarousel({
								autoPlay : Boolean(autoplay),
								navigation : false,
								pagination : Boolean(pagination),
								slideSpeed : slideSpeed,
								paginationSpeed : paginationSpeed,
								singleItem: Boolean(singleItem),
								transitionStyle : transitionStyle,
								stopOnHover: true,
								autoHeight: true
							});
							
						});
					}
					
										
					var vidDefer = document.getElementsByTagName('iframe');
					for (var i=0; i<vidDefer.length; i++) {
						if(vidDefer[i].getAttribute('data-src')) {
							vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
						} 
					}
					
					$(".fancybox").fancybox({
						closeBtn: false,
						padding : 1,
						helpers			: {
							overlay : {
								closeClick : true,
								speedOut   : 200,
								showEarly  : true,
								css        : {},
								locked     : true
							},
							title		: { type : 'inside' },
							buttons		: {}
						}
					});	
					
										
					if( is.not.desktop() ){
						$("#footer-inner-row").removeClass("offset2");
					} 
					
					if ( $('#bestseller-products .flexslider').length > 0 ) {
						$('#bestseller-products .flexslider').each(function(index, value) {
							$(this).flexslider({
								animation: "slide",
								animationLoop: true,
								itemWidth: 182,
								itemMargin: 3,
								minItems: 2,
								maxItems: 6,
								animationSpeed: 700,
								touch: true,
								slideshow: false,								slideshowSpeed: 5000							});
						});
					}
					if ( $('#featured-products .flexslider').length > 0 ) {
						$('#featured-products .flexslider').each(function(index, value) { 
							$(this).flexslider({
								animation: "slide",
								animationLoop: true,
								itemWidth: 182,
								itemMargin: 3,
								minItems: 2,
								maxItems: 6,
								animationSpeed: 700,
								touch: true,
								slideshow: false,								slideshowSpeed: 5000							});
						});
					}
					if ( $('#latest-products .flexslider').length > 0 ) {
						$('#latest-products .flexslider').each(function(index, value) { 
							$(this).flexslider({
								animation: "slide",
								animationLoop: true,
								itemWidth: 182,
								itemMargin: 3,
								minItems: 2,
								maxItems: 6,
								animationSpeed: 700,
								touch: true,
								slideshow: false,								slideshowSpeed: 5000							});
						});
					}
					if ( $('#related-products .flexslider').length > 0 ) {
						$('#related-products .flexslider').each(function(index, value) { 
							$(this).flexslider({
								animation: "slide",
								animationLoop: true,
								itemWidth: 182,
								itemMargin: 3,
								minItems: 2,
								maxItems: 6,
								animationSpeed: 700,
								touch: true,
								slideshow: false,								slideshowSpeed: 5000							});
						});
					}
					if ( $('#special-products .flexslider').length > 0 ) {
						$('#special-products .flexslider').each(function(index, value) { 
							$(this).flexslider({
								animation: "slide",
								animationLoop: true,
								itemWidth: 182,
								itemMargin: 3,
								minItems: 2,
								maxItems: 6,
								animationSpeed: 700,
								touch: true,
								slideshow: false,								slideshowSpeed: 5000							});
						});
					}

					if ( $('#comingsoon-products .flexslider').length > 0 ) {
						$('#comingsoon-products .flexslider').each(function(index, value) {
							$(this).flexslider({
								animation: "slide",
								animationLoop: true,
								itemWidth: 182,
								itemMargin: 3,
								minItems: 2,
								maxItems: 6,
								animationSpeed: 700,
								touch: true,
								slideshow: false,								slideshowSpeed: 5000							});
						});
					}
					
					jQuery('.flexslider').each( function() {
						var $slider = jQuery(this);
						var $slides = jQuery(this).children().children('.slides');
						if ( -1 === jQuery.inArray( $slider.data('flexslider').vars.animation, [ 'slide', 'swing' ] ) )
							return;
						$slides.bind( 'mousewheel', function( e ) {
							e.preventDefault();
							if ( jQuery(this).hasClass('dragging') )
								return;
							if ( e.originalEvent.deltaY > 0 ) {
								$slider.flexslider('next');
							}
							if ( e.originalEvent.deltaY < 0 ) {
								$slider.flexslider('prev');
							}
							return false;
						} );
					} );
					
					if ( $('.any-products').length > 0 ) {
						$(window).resize(function() {
							
							$('.any-products').each(function(index, value) { 
								var margin_vertical = $(this).data("marginVertical");
								if( is.mobile() ){
									$(this).find(".products-box").removeClass(".products-box").addClass("product-box");
								} else {
									if(margin_vertical){
										$(this).find(".product-box").removeClass(".product-box").addClass("products-box");
									}
								}
							});
							
							if(is.mobile()){
								$(".any-products").find(".grid-box").attr("style","");
								adjustBoxHeights();
							}
							
						});
					}
					
					if ( $('.banner-carousel').length > 0 ) {
						$('.banner-carousel').each(function(index, value) { 
							var slideSpeed = is.null( $(this).attr('data-slideSpeed') ) ? 600 : $(this).attr('data-slideSpeed');
							if( slideSpeed == undefined ) { slideSpeed = 600; }
							var el = "#" + $(this).attr("id");
							var items = $(this).data("item");
							
							var lilen = $(el+" li").length;
							var sliderLoop = true;
							if(lilen==items){sliderLoop = false;}
							
							var autoplay = parseInt($(this).data("autoplay"));
							var boolAutoplay = false;
							if( autoplay ) boolAutoplay = true;
							$(el).removeClass("hidden");
							$(el).show();
							$(el).imagesLoaded( function() {
								var el = "#" + $(this).attr("id");
								$(el+" img[data-lazy-src]").each(function(index, value) { 
									var loadimg = $(this).attr('data-lazy-src');
									$(this).attr('src', loadimg);
								});
								var slider = $(el).lightSlider({
									auto: boolAutoplay,
									pauseOnHover: true,
									pager: false,
									item:items,
									loop: sliderLoop,
									easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
									speed: slideSpeed,
									onSliderLoad: function() {
										$(el).removeClass("hidden");
										$(el).show();
										$(el).css("height", "auto");
									} 
								});
								slider.refresh();
							});
						});
					}
					
					
					if ( $('.slideshow-container-appear li').length > 0 ) {
						$('.slideshow-container-appear').each(function(index, value) { 
							var el = "#" + $(this).attr("id");
							var full = $(this).data("full");
							if(full){
								$(this).appendTo('#content-top');
							}
							
							if(is.mobile()){
								$(el).find("li.desktop").remove();
								$(el).find("li.mobile:first").show();	
							} else {
								$(el).find("li.mobile").remove();
								$(el).find("li.desktop:first").show();	
							}						
							
							$(el).imagesLoaded( function(e) {
								
								if(is.mobile()){
									$(e).closest("li.mobile").attr("style","width:100%");
								} else {
									$(e).closest("li.desktop").attr("style","width:100%");
								}
								
								var controlNav = $(e).closest(".slideshow-container-appear").data("controlnav");
								var directionNav = $(e).closest(".slideshow-container-appear").data("directionnav");
								var el = "#" + $(e).attr("id");
								var delay = $(e).closest(".slideshow-container-appear").data("delay");
								if(delay<300) delay = 300;
								
								adaptiveHeight = true;
								if( is.mobile() ){
									//controlNav = false;
									//directionNav = false;
									adaptiveHeight = false;
								}
								
								var slideshow_img_h = 0;
								$(e).closest(".slideshow-container-appear li.mobile img").each(function(index, value) { 
									var img_h = $(this).data("height");
									if( (img_h > 0) && (slideshow_img_h > 0) && (img_h != slideshow_img_h) ) {
										slideshow_img_h = 0;
									} else {
										slideshow_img_h = img_h;
									}
								});
								
								if( is.mobile() && slideshow_img_h == 0 ){
									$(e).closest(".slideshow-container-appear").flexslider({
										animation: "fade",
										slideDirection: "horizontal",
										animationLoop: true,
										pauseOnHover: true,
										pauseOnAction: false,
										smoothHeight: false, 
										slideshowSpeed: delay,
										initDelay: 0, 
										slideshow: true,
										mousewheel: false,
										controlNav: controlNav,
										directionNav: directionNav, 
										prevText: "",
										nextText: "",
										start: function(slider) {
											var el = "#" + $(this).attr("id");
											$(el).removeClass('loading');
										}
									});
								} else {
									var slider = $(e).closest(".slides").lightSlider({
										auto:true,
										loop:true,
										pauseOnHover:true,
										adaptiveHeight:true,
										item:1,
										slideMargin:0,
										easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
										speed:600,
										pause:delay,
										controls:directionNav,
										pager:controlNav
									}); 
									slider.refresh();
									setTimeout(function(){
									slider.play(); 
									slider.goToNextSlide(); 
									slider.goToPrevSlide();
									slider.goToPrevSlide(); 
									slider.refresh();
									}, 700);
								}
								
							});
							
						});
					}
					
					if( $('.side_float_banner .flipper').length > 0 ) {
						try {
							$('.side_float_banner .flipper').flipper();
						} catch(err) { }
					}
					
					if( $(".flexslider").find("img").length > 0 ) {
						$(".flexslider").find("img").trigger('appear');
					}
					
										
										
					$('[data-toggle="tooltip"]').tooltip();
					
					setTimeout(function(){ 
						$(window).trigger('resize'); 
					}, 300);
					
					$(".flex-direction-nav").remove();
					
					adjustBoxHeights();
					
										
					$("#menu-btn").show();
					$("#menu-btn").addClass('animated flash');
					
					setTimeout(function(){
					$("#mobile-navbar").removeAttr('style');
					}, 1000);
					
$("#facebook-page-container").html('<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffruitlife2021/&tabs&width=500&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=162172840650014" width="500" height="214" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>');});
				
				queue.runQueue();
				
												(function(d, s, id) {
				  var js, fjs = d.getElementsByTagName(s)[0];
				  if (d.getElementById(id)) return;
				  js = d.createElement(s); js.id = id;
				  				  js.src = "https://connect.facebook.net/zh_TW/sdk.js";
				  				  fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
				
				if (window.location.hash == '#_=_') {
					window.location.hash = ''; // for older browsers, leaves a # behind
					history.pushState('', document.title, window.location.pathname + window.location.search);
				}
				
			}
			function sanitizeTargetBlank(){
				$('a[rel~=external]').prop('target', '_blank');
				$('a[target="_blank"]').each(function(){
					var a = $(this);
					if(location.hostname !== this.hostname){
						var originalRel = (this.rel === undefined) ? '' : this.rel;
						var newRel = originalRel.split(" ");
						if (originalRel.toLowerCase().indexOf('noopener') === -1){
							newRel.push('noopener');
						}
						if (originalRel.toLowerCase().indexOf('noreferrer') === -1){
							newRel.push('noreferrer');
						}
						if (originalRel.toLowerCase().indexOf('nofollow') === -1){
							newRel.push('nofollow');
						}
						a.attr('rel', newRel.join(" ").trim() );
					}
				});
			}
			function create_mark(name) {
				if (window.performance.mark === undefined) {
					console.log("performance.mark Not supported");
					return;
				}
				window.performance.mark(name);
			}
			function initCoreJS() {
				$LAB.setGlobalDefaults({AlwaysPreserveOrder:true});
				jQuery.ajaxPrefilter(function(s) {
					if ( s.crossDomain ) {
						s.contents.script = false;
					}
				});
				$(function() { $('body').removeClass('fade-out'); });
				sanitizeTargetBlank();
				var def_img_idx = 1;
				[].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
					if( def_img_idx <= 12 ) {
						if (img.getAttribute('data-src') === null) { } else if (img.getAttribute('data-src') === '') {} else {
							img.setAttribute('src', img.getAttribute('data-src'));
							img.onload = function() {
								img.removeAttribute('data-src');
								if (img.style.opacity !== undefined) {
									img.style.opacity = 1;
								}
							};
						}
					}
					def_img_idx++;
				});
				if ( $('.slideshow .flexslider').length > 0 ) { 
					$('.slideshow .flexslider').each(function(index, value) { 
						var el = "#" + $(this).attr("id");
						var full = $(this).data("full");
						if(full){
							$(this).find("img").css({'width' : '100%', 'height' : 'auto' });
							$(this).closest("div.slideshow").appendTo('#content-top');
						}
					});
				}
				$LAB.script("https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/5.0.0/imagesloaded.pkgd.min.js")
					  .script("https://cdnjs.cloudflare.com/ajax/libs/is_js/0.9.0/is.min.js").wait(function(){
						  initDeferImages();
						loadJS();
						downloadJSAtOnload();
						create_mark('mark_fully_loaded');
						if( $('.wow').eq(0).length ) {
							getScript("https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js",function(){
								new WOW().init();
							});
						}
						if( $('img[usemap]').eq(0).length ) {
							getScript("https://cdnjs.cloudflare.com/ajax/libs/jQuery-rwdImageMaps/1.6/jquery.rwdImageMaps.min.js",function(){
								try { $('img[usemap]').rwdImageMaps(); } catch (e) { }
							});
						}
												getScript("https://cdnjs.cloudflare.com/ajax/libs/data-layer-helper/0.1.0/data-layer-helper.min.js",function(){ });
												
					  });
						//230117 fix flipper hover
						if($(".grid-box, .product-row").find(".flipper").length){
							$(".grid-box, .product-row").find(".flipper").hover(function(){
								oldSrc = $(this).attr("src");
								$(this).attr("src",$(this).attr("data-flipper"));
							},function(){
								$(this).attr("src",oldSrc);
							});
						}
			}
			
			initCoreCSS();
			setTimeout(function(){ 
				initCoreJS();
				/*
				$.getJSON( "index.php?route=account/account/get_user_track&token=" + (Math.floor(Math.random() * 999) + 100), function( data ) { 
					if( data.user_id ) { ga_userId = data.user_id; } 
					if( data.uuid ) {
						try {
							if ('localStorage' in window && window['localStorage'] !== null){
								localStorage.removeItem("qdm_user_uuid");
								localStorage.setItem("qdm_user_uuid", data.uuid);
								qdm_user_uuid = data.uuid;
							}
						} catch (e) {}
					}
					if( data.utm_source == "affiliates" ) { ga_utm_source = data.utm_source; }
						
				});*/
				var vidDefer = document.getElementsByTagName('iframe');
				for (var i=0; i<vidDefer.length; i++) {
					if(vidDefer[i].getAttribute('src')) {
						vidDefer[i].setAttribute('data-src',vidDefer[i].getAttribute('src'));
					} 
				}
				document.getElementsByTagName("body")[0].style.display = "block";
			}, 60);
