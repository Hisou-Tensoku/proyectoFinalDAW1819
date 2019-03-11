
// Where category ==, margen precio, talla, color

    var categ = null;
    var dest = null;
    var filt = null;
    var orden = null;
    var size = null;
    var prange = null;

    function getDataArr(pagina = null) {
        var data = {
            'orden' : orden, 
            'categ' : categ,
            'dest'  : dest,
            'search': filt,
            'pagina': pagina,
            'size'  : size,
            'prange': prange
        }
        
        return data;
    }
    
    //Generating pure html
    function generateSizeHTML(){
        
        var string = `<li>
                        <input class="js-sizeLoad" type="checkbox" name="shop-size-sm32" value="smaller-32" />
                        <label for="shop-size-sm32">< Size 32</label>
                      </li>`;
        
        for (var i = 32; i<46; i++) {
            
            string += '<li><input class="js-sizeLoad" type="checkbox" name="shop-size-'+i+'-'+i+1+'" value="'+i+'-'+(i + 1)+'" /><label for="shop-size-'+i+'-'+i+1+'">Sizes '+i+'-'+(i + 1)+'</label></li>';
            
        }
        string += `<li>
                        <input class="js-sizeLoad" type="checkbox" name="shop-size-lg46" value="46-larger" />
                        <label for="shop-size-lg46">> Size 46</label>
                      </li>`;
        
        $('#js-sizeList').append(string);
        
        
        $('.js-sizeLoad').change(function() {
            size = [];
            $('#js-sizeList input:checked').each(function() {
                var split = $(this).val().split("-");
                var rangeArr = [split[0],split[1]];
                size.push(rangeArr);
            });
            
            genericAjax('ajax/getstoreitems', getDataArr(), 'get', function(json) {
                procesarTienda(json.items);
                procesarPaginas(json.pages);
                procesarCuentas(json.searchinfo);
            });
        });
        
        
    }
    
    generateSizeHTML();
    
    
    //Generating pure html
    function generatePriceListHTML(){
        var html = '<li><input class="js-priceLoad" type="checkbox" name="shop-price-sm100" value="smaller-100" /><label for="shop-price-sm100">100€-</label></li>';
        html += '<li><input class="js-priceLoad" type="checkbox" name="shop-price-100-200" value="100-200" /><label for="shop-price-100-200">100€ to 200€</label></li>';
        html += '<li><input class="js-priceLoad" type="checkbox" name="shop-price-200-300" value="200-300" /><label for="shop-price-200-300">200€ to 300€</label></li>';
        html += '<li><input class="js-priceLoad" type="checkbox" name="shop-price-lg300" value="300-larger" /><label for="shop-price-lg300">300€+</label></li>';
        $('#js-priceList').append(html);
        
        $('.js-priceLoad').change(function() {
            prange = [];
            $('#js-priceList input:checked').each(function() {
                var split = $(this).val().split("-");
                var rangeArr = [split[0],split[1]];
                prange.push(rangeArr);
            });
            
            genericAjax('ajax/getstoreitems', getDataArr(), 'get', function(json) {
                procesarTienda(json.items);
                procesarPaginas(json.pages);
                procesarCuentas(json.searchinfo);
            });
        });
        
    }
    
    generatePriceListHTML();

    //Cats and dests
    $('.js-filterLoad').change(function() {
        categ = [];
        $('#js-categList input:checked').each(function() {
            categ.push($(this).val());
        });
        genericAjax('ajax/getstoreitems', getDataArr(), 'get', function(json) {
            procesarTienda(json.items);
            procesarPaginas(json.pages);
            procesarCuentas(json.searchinfo);
        });
    });
    
    $('.js-destLoad').change(function() {
        dest = [];
        $('#js-destList input:checked').each(function() {
            dest.push($(this).val());
        });
        genericAjax('ajax/getstoreitems', getDataArr(), 'get', function(json) {
            procesarTienda(json.items);
            procesarPaginas(json.pages);
            procesarCuentas(json.searchinfo);
        });
    });


    //Search form
    $('#js-srcIn').on("keyup", searchFunc);
    $("#js-srcBtn").on('click', searchFunc);
    
    function searchFunc(e) {
        filt = $("#js-srcIn").val().trim();
        
        genericAjax('ajax/getstoreitems', getDataArr(), 'get', function(json) {
            procesarTienda(json.items);
            procesarPaginas(json.pages);
            procesarCuentas(json.searchinfo);
        });
    }
    
    //Order select
    orden = $('#js-orderSel').find(":selected").val().trim();
    function orderFunc(e) {
        orden = $('#js-orderSel').find(":selected").val().trim();
        
        genericAjax('ajax/getstoreitems', getDataArr(), 'get', function(json) {
            procesarTienda(json.items);
            procesarPaginas(json.pages);
            procesarCuentas(json.searchinfo);
        });
    }
    
    $('#js-orderSel').on('change', orderFunc);
    
    
    //HTML Content
    function getHTMLItemList(item) {
        
        var stock = 0;
        $.each(item.tallas, function(key, value) {
            stock += value.stock;
        });

        var stracc = '<div class="col-md-6 col-sm-6"><div class="home-product text-center position-relative overflow-hidden margin-ten no-margin-top">';
        
            if (item.id != null && item.fotos[0] != null) { stracc += `<a href="product?pid=${item.id}"><img src="${item.fotos[0].ruta}" alt=""/></a>`; }
            else {  stracc += `<a href="product?pid=${item.id}"><img src="/assets/shoes/aaa_no_shoe.jpg" alt=""/></a>`; };
        
        
        //METER LA FOTO DEL PRODUCTO
        
        
        if (item.id != null) { stracc += `<span class="product-name text-uppercase"><a href="product?pid=${item.id}">${item.marca} ${item.modelo}</a></span>`; }
        if (item.ppu != null) { stracc += `<span class="price black-text">${item.ppu}</span>`; }
        
        if (stock == 0) { stracc += '<span class="onsale onsale-style-2">NO STOCK</span>'; };
        
        
        if (stock>0) {
                stracc += '<div class="quick-buy"><div class="product-share row">';
                stracc += `<select class="col-md-3 col-sm-6 col-md-offset-3" id="js-tallaSelect" data-shoeid="${item.id}">`;
                $.each(item.tallas, function(key, value) {
                    if (value.stock > 0) {
                        stracc += `<option value="${value.numero}">${value.numero}</option>`;
                    }
                });
                stracc += '</select>';
                
            if (item.ppu != null) { stracc += `<button data-pid="${item.id}" class="highlight-button-dark btn btn-small no-margin-left quick-buy-btn js-quickAdd col-md-3 col-sm-6 center-block" title="Add to Cart"><i class="fa fa-shopping-cart"></i></button>`; }
            stracc += '</div></div>'; 
        }
        
            

            stracc += '</div></div>'; 

        return stracc;
    }
    
    function getHTMLNoItems() {
        
        var stracc = '<div class="col-md-12"><div class="home-product text-center position-relative overflow-hidden margin-ten no-margin-top">';
        stracc += '<h3>No products found</h3>';
        stracc += '</div></div>'; 
        
        return stracc;
    }

    //Proceso de datos

    var procesarTienda = function (items) {
        var listaitems = '';
        if (items != null && !$.isEmptyObject(items)) {
            $.each(items, function(key, value) {
                listaitems += getHTMLItemList(value);
            });
        } else {
            listaitems = getHTMLNoItems();
        }
        
        
        $('#js-itemTable').html(listaitems);
        // $(listaitems).appendTo('#js-itemTable').fadeIn(1000);
        
        $(".js-quickAdd").on("click", smallAdd); //No encapsular
        
        
    };

    var procesarPaginas = function (paginas) {
        console.log(paginas);
        
            var stringPrev = '';
        if (paginas.pagina > 0) {
            stringPrev  = '<a href="#" class="btnPagina" data-pagina="'+paginas.anterior+'"><img src="public_html/images/arrow-pre-small.png" alt=""/></a>';
        }
        
        var stringRange = '';
        if (paginas.rango != null && paginas.rango.length>0) {
            $.each(paginas.rango, function(key, value) {
                if(paginas.pagina == value) {
                    stringRange += '<a href="#" class="btnNoPagina active">'+value+'</a>';
                } else {
                    stringRange += '<a href="#" class="btnPagina" data-pagina="'+value+'">'+value+'</a>';
                }
            });
        }
        
        var stringNext = '';
         if (paginas.pagina > 0) {
            stringNext = '<a href="#" class="btnPagina" data-pagina="'+paginas.siguiente+'"><img src="public_html/images/arrow-next-small.png" alt=""/></a>';
        }

        var finalString = stringPrev + stringRange + stringNext;
        $('#js-paginateStore').html(finalString);
        $('.btnPagina').on('click', function(e) {
            e.preventDefault();
            var p = $(this).data('pagina');
            getCiudades(p); 
        });
        $('.btnNoPagina').on('click', function(e) {
            e.preventDefault();
        });
    };

    function procesarCuentas(numbers) {
        if (numbers.total == 0) {
            var html = '';
        } else {
            var html = 'Starting at item '+numbers.firstitem+' out of '+numbers.total+' total results';
        }
        
        $('#js-shopNumbers').html(html);
    }





    //Refrescar (paginacion y eso)
    var getCiudades = function (pagina) {
        genericAjax('ajax/getstoreitems', getDataArr(pagina), 'get', function(json) {
            
            procesarTienda(json.items);
            procesarPaginas(json.pages);
            procesarCuentas(json.searchinfo);
        });
    };
    
    //Inicializar _ LOAD THE BULLSHIT:)
    initialAjax();
    
    function initialAjax() {
        genericAjax('ajax/getstoreitems', null, 'get', function(json) {
            //if(json.login) {
                //$('#verListaDeValores').show();
                //usuario = json.usuario;
                procesarTienda(json.items);
                procesarPaginas(json.pages);
                procesarCuentas(json.searchinfo);
            //}
        });
    }
    

    function smallAdd(e) {
        var addid = jQuery(this).data('pid');
        var size = jQuery(e.target).prev().val();
        
        genericAjax('ajax/addtocartajax',{'pid' : addid, 'size' : size}, 'get', function(json) {
            console.log(json.success);
            updateNavCart();
            
        });
        
    }

    //General AJAX
    function genericAjax(url, data, type, callBack) {
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType : 'json',
        })
        .done(function( json ) {
            console.log('ajax done');
            callBack(json);
        })
        .fail(function( xhr, status, errorThrown ) {
            console.log('ajax fail');
        })
        .always(function( xhr, status ) {
            console.log('ajax always');
        });
    };
