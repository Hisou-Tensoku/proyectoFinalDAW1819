(function() {

	// Where category ==, margen precio, talla, color

	var categ = null;
	var dest = null;
	var filt = null;
	var orden = null;
	var size = null;
	var prange = null;

	function getDataArr(pagina = null) {
		var data = {
			'orden': orden,
			'categ': categ,
			'dest': dest,
			'search': filt,
			'pagina': pagina,
			'size': size,
			'prange': prange
		}

		return data;
	}


	//HTML Content
	function getHTMLItemList(item) {

		var stock = 0;
		$.each(item.tallas, function(key, value) {
			stock += value.stock;
		});

		var stracc = '<div class="col-md-4 col-sm-6"><div class="home-product text-center position-relative overflow-hidden margin-ten no-margin-top">';

		if (item.id != null && item.fotos[0] != null) { stracc += `<a href="product?pid=${item.id}"><img src="${item.fotos[0].ruta}" alt=""/></a>`; }
		else { stracc += `<a href="product?pid=${item.id}"><img src="/assets/shoes/aaa_no_shoe.jpg" alt=""/></a>`; };


		//METER LA FOTO DEL PRODUCTO
		if (item.id != null) { stracc += `<span class="product-name text-uppercase"><a href="product?pid=${item.id}">${item.marca} ${item.modelo}</a></span>`; }
		if (item.ppu != null) { stracc += `<span class="price black-text">${item.ppu}</span>`; }

		if (stock == 0) { stracc += '<span class="onsale onsale-style-2">NO STOCK</span>'; };


		/*if (stock>0) {
		        //stracc += '<div class="quick-buy"><div class="product-share row">';
		        //stracc += `<select class="col-md-3 col-sm-6 col-md-offset-3" id="js-tallaSelect" data-shoeid="${item.id}">`;
		        /*$.each(item.tallas, function(key, value) {
		            if (value.stock > 0) {
		                stracc += `<option value="${value.numero}">${value.numero}</option>`;
		            }
		        });
		        stracc += '</select>';
		        
		    if (item.ppu != null) { stracc += `<button data-pid="${item.id}" class="highlight-button-dark btn btn-small no-margin-left quick-buy-btn js-quickAdd col-md-3 col-sm-6 center-block" title="Add to Cart"><i class="fa fa-shopping-cart"></i></button>`; }
		    stracc += '</div></div>'; 
		}*/

		stracc += '</div></div>';

		return stracc;
	}

	function getHTMLPostList(item) {
		var element = `
            <div class="col-md-4 col-sm-4 col-xs-12 blog-listing no-margin-bottom wow fadeIn xs-margin-bottom-seven" data-wow-duration="600ms">
                <div class="blog-image">
                	<a href="${item.link}/">
                		<img src="${item.thumbnail_url ? item.thumbnail_url : item.image_src}" alt=""/>
                	</a>
                </div>
                <div class="blog-details">
                    <div class="blog-date">Posted by <a href="${item.author_url}">${item.author}</a> | ${item.date}</div>
                    <div class="blog-title"><a href="${item.link}">${item.name}</a></div>
                    <div class="separator-line bg-black no-margin-lr no-margin-bottom"></div>
                </div>
            </div>
        `;
        return element;
	}

	function getHTMLNoItems() {

		var stracc = '<div class="col-md-12"><div class="home-product text-center position-relative overflow-hidden margin-ten no-margin-top">';
		stracc += '<h3>No results found</h3>';
		stracc += '</div></div>';

		return stracc;
	}

	//Proceso de datos

	var procesarTienda = function(items) {
		var listaitems = '';
		if (items != null && !$.isEmptyObject(items)) {
			$.each(items, function(key, value) {
				listaitems += getHTMLItemList(value);
			});
		}
		else {
			listaitems = getHTMLNoItems();
		}
		$('#js-itemsHome').append(listaitems);
	};

	var procesarCaro = function(items) {
		var listaitems = '';
		if (items != null && !$.isEmptyObject(items)) {
			$.each(items, function(key, value) {
				listaitems += getHTMLItemList(value);
			});
		}
		else {
			listaitems = getHTMLNoItems();
		}
		console.log(listaitems);
		$('#js-expensive').append(listaitems);
		$('#js-expensive').show();
	};

	var procesarPosts = function(items) {
		var listaitems = '';
		if (items != null && !$.isEmptyObject(items)) {
			$.each(items, function(key, value) {
				listaitems += getHTMLPostList(value);
			});
		}
		else {
			listaitems = getHTMLNoItems();
		}
		console.log(listaitems);
		$('#our-blog').append(listaitems);
		$('#our-blog').show();
	};

	//Inicializar _ LOAD THE BULLSHIT:)
	initialAjax();

	function initialAjax() {
		genericAjax('ajax/getajaxitems1', null, 'get', function(json) {
			procesarTienda(json.items);
		});

		genericAjax('ajax/getajaxitemsstock', null, 'get', function(json) {
			procesarCaro(json.items);
		});
		let blog_ajax = 'https://eightbeast-project-superwave.c9users.io/blog/wp-json/miapi/lastposts';
		genericAjax(blog_ajax, null, 'get', function(json) {
			procesarPosts(json);
		})
	}

	//General AJAX
	function genericAjax(url, data, type, callBack) {
		$.ajax({
				url: url,
				data: data,
				type: type,
				dataType: 'json',
			})
			.done(function(json) {
				console.log('ajax done');
				callBack(json);
			})
			.fail(function(xhr, status, errorThrown) {
				console.log('ajax fail');
			})
			.always(function(xhr, status) {
				console.log('ajax always');
			});
	};

})();
