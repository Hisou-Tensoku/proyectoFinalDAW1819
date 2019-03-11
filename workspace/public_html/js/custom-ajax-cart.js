jQuery("#addToCart").on("click", addCfunc); //No encapsular
function addCfunc(e) {

   var addid = jQuery(this).data('pid');
   var size = jQuery("#js-tallaSelect").val();

   jQuery.ajax({
      crossDomain: true,
      url: 'https://eightbeast-project-superwave.c9users.io/ajax/addtocartajax',
      type: "GET",
      data: {
         'pid': addid,
         'size': size
      },
      success: updateNavCart,
      headers: {
         "Access-Control-Allow-Origin": "*"
      },
      xhrFields: { withCredentials: true }
   });

};


updateNavCart();

//Mini-carrito del nav.
function updateNavCart() {
   //Peticion (on page load)
   jQuery.ajax({
      crossDomain: true,
      url: 'https://eightbeast-project-superwave.c9users.io/ajax/getcartajax',
      type: "GET",
      success: drawNavCart,
      headers: {
         "Access-Control-Allow-Origin": "*"
      },
      xhrFields: { withCredentials: true }
   });

}


jQuery(".removeFromCart").on("click", removeCFunc);
function removeCFunc(event) {

   var idToRemove = jQuery(event.currentTarget).data('pid');

   jQuery.ajax({
      crossDomain: true,
      url: 'https://eightbeast-project-superwave.c9users.io/ajax/removecartajax',
      type: "GET",
      data: {
         pid: idToRemove,
      },
      success: function(data) {
         jQuery(".productrow_" + idToRemove).remove();
         updateTotalPrice();
      },
      headers: {
         "Access-Control-Allow-Origin": "*"
      },
      xhrFields: { withCredentials: true }
   });
   
}

function drawNavCart(data) {
   //Dwaw the text
   
   console.log(data.items);
   
   updateCartAmt(data);
   jQuery("#cartList").empty();
   var cartItems = data.items;

   var appendString = '';

   var cartLength = jQuery(cartItems).length;
   if (cartLength >3) { cartLength = 3 }; 
   
   jQuery.each(cartItems, function(key, item) {
      console.log(item.foto);
      
      appendString += '<li class="productrow_' + item.id + '">';
      appendString += '<div class="remove removeFromCartNav" data-pid="' + item.id + '">&#215;</div>';
      appendString += '<a href="#"><img max-width="90px" alt="" src="' + item.foto + '">' + item.nombre + '</a>';
      appendString += '<span class="quantity">' + item.cantidad + ' × <span class="amount">' + item.precio + '</span></span>';
      appendString += "</li>";
      
   });
   
   
   jQuery("#cartList").append(appendString);
   
   jQuery(".removeFromCartNav").on("click", removeCFunc);
   
   updateTotalPrice();
   
}


function updateCartAmt(data) {
   jQuery(".js-cartTitle").text("(" + data.count + ") Cart");
}


function updateTotalPrice() {
   
   jQuery.ajax({
      crossDomain: true,
      url: 'https://eightbeast-project-superwave.c9users.io/ajax/getcarttotalajax',
      type: "GET",
      success: updateTotalPriceSuccess,
      headers: {
         "Access-Control-Allow-Origin": "*"
      },
      xhrFields: { withCredentials: true }
   });
   
}


function updateTotalPriceSuccess(data) {
   
   if (data.totalprice != '' || data.totalprice == null) {
      var priceStr = ""+data.totalprice+"";
   } else {
      var priceStr = "N/A";
   }
   
   jQuery(".js-cartTotal").text(priceStr);
   
}




function addCartButtons() {
   
   var html = '<a href="https://eightbeast-project-superwave.c9users.io/cart" class="btn btn-very-small-white no-margin-bottom margin-seven pull-left no-margin-lr">View Cart</a>';
   html += '<a href="https://eightbeast-project-superwave.c9users.io/checkout" class="btn btn-very-small-white no-margin-bottom margin-seven no-margin-right pull-right">Checkout</a>';
   
   jQuery("#cartButtons").html(html);
   
}
addCartButtons();