//Codigo del checkout

(function() {
   //Primero, variables para el submit   
   var fName = null;           var elNom=$("#js-verNombre");
   var fSurname = null;        var elApell=$("#js-verApellidos");
   
   var fAddr = null;           var elCalle=$("#js-verAddr");
   var fCity = null;           var elCiudad=$("#js-verCity");
   var fPostcode = null;       var elCP=$("#js-verCP");
   var fState = null;          var elProv=$("#js-verProv");
   var fCountry = null;        var elPais=$("#js-verPais");
   
   var fMail = null;           var elMail=$("#js-verMail");
   var fCoupon = null;         var elCupon=$("#js-verCupon");
   var fCard = null;
   
   var cartProducts = null;
   
   var selPago=$("#js-selPago");
   var selDir=$("#js-selAddr");
   
   
   var genericAjax = function (url, data, type, callBack) {
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType : 'json',
            headers: {
               "Access-Control-Allow-Origin": "*"
            },
            xhrFields: { withCredentials: true }
        })
        .done(function( json ) {
            console.log('ajax ok');
            callBack(json);
        })
        .fail(function( xhr, status, errorThrown ) {
            console.log('ajax fail');
        })
        .always(function( xhr, status ) {
            console.log('Running ajax script');
        });
    };
   
  function cartHasItems(){
    genericAjax('ajax/getcartamtajax', null, 'get', function(json) {
        return json.count;
    });
}
   
   
   
   
   //2, funciones de selects ajax
   
   selDir.on("change" , function (event) {
      idDir = selDir.val();
      if (idDir != null && idDir != '' ) {
         
         var parametros = {
            addressid      : idDir.trim(),
         };
         
         genericAjax('ajax/getaddrfromid', parametros, 'get', function(json) {
                if(json.added) {
                  refreshAddrHTML(json.address);
                  
                } else {
                    console.log('Couldnt get address details.');
                }
         });
         
      }

   });
   
   function refreshAddrHTML(addr) {
      elCalle.val(addr.calle);
      elCP.val(addr.cpostal);
      elCiudad.val(addr.ciudad);
      elProv.val(addr.provincia);
      elPais.val(addr.pais);
      
   };
   
   
    elCalle.on("click", function(e) {
        selDir.val('');
    });
    elCP.on("click", function(e) {
        selDir.val('');
    });
    elCalle.on("click", function(e) {
        selDir.val('');
    });
    elCiudad.on("click", function(e) {
        selDir.val('');
    });
    elProv.on("click", function(e) {
        selDir.val('');
    });
    elPais.on("click", function(e) {
        selDir.val('');
    });

   
   //3, comprobar sobre la marcha
   
   elNom.on("keyup", function (e) {
      fName = !isEmptyField($(e.target).val());
      setErrStyle(fName, e.target);
   });
   
   elApell.on("keyup", function (e) {
      fSurname = !isEmptyField($(e.target).val());
      setErrStyle(fSurname, e.target);
   });
   
   elCalle.on("keyup", function (e) {
      fAddr = !isEmptyField($(e.target).val());
      setErrStyle(fAddr, e.target);
   });
   
   elCiudad.on("keyup", function (e) {
      fCity = !isEmptyField($(e.target).val());
      setErrStyle(fCity, e.target);
   });
   
   elCP.on("keyup", function (e) {
      fPostcode = !isEmptyField($(e.target).val());
      setErrStyle(fPostcode, e.target);
   });
   
   elProv.on("keyup", function (e) {
      fState = !isEmptyField($(e.target).val());
      setErrStyle(fState, e.target);
   });
   
   elPais.on("change", function (e) {
      fCountry = isValidCountryCode($(e.target).val());
   });
   
   elMail.on("change", function (e) {
       fMail = isValidEmail($(e.target).val());
       setErrStyle(fMail, e.target);
   });
   
   elMail.on("change", function (e) {
       fMail = isValidEmail($(e.target).val());
       setErrStyle(fMail, e.target);
   });
   
   
   //4, funciones comprobaciones
   
   function setErrStyle(data, target) {
       if (data == false) {
          $(target).addClass('inputerror');
      } else {
          $(target).removeClass('inputerror');
      }
   };
   
   
   
   
   
   
   
   function verifyCard() {
       if (selPago.val() == null || isNaN(selPago.val())) {
           return false;
       } else {
           return true;
       }
       
   };
   
   //Order
   
   $("#checkoutForm").submit(function (e) {
       
            
            fName = !isEmptyField(elNom.val());
               setErrStyle(fName, "#js-verNombre");
               
               fSurname = !isEmptyField(elApell.val());
               setErrStyle(fSurname, "#js-verApellidos");
               
               fAddr = !isEmptyField(elCalle.val());
               setErrStyle(fAddr, "#js-verAddr");
               
               fCity = !isEmptyField(elCiudad.val());
               setErrStyle(fCity, "#js-verCity");
               
               fPostcode =  !isEmptyField(elCP.val());
               setErrStyle(fPostcode, "#js-verCP");
               
               fState = !isEmptyField(elProv.val());
               setErrStyle(fState, "#js-verProv");
               
               fCountry = isValidCountryCode(elPais.val());
               setErrStyle(fCountry, "#js-verPais");
               
               //fCoupon = 
               //fCard = verifyCard();
               
               cartProducts = cartHasItems();
            
            if (fName==false || 
                fSurname==false ||
                fAddr==false ||
                fCity==false ||
                fPostcode==false ||
                fState==false ||
                fCountry==false ||
                //!fCoupon ||
                //fCard==false ||
                cartProducts<=0
                ) {
                    
                     e.preventDefault();
                     location.reload();
                     return false;
    
            } else {
                return true;
            }

   });
   
   
   
   
   
   
   
})();