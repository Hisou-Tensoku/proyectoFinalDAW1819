function validatePassword($password) {
    //Al menos 1 numero, 1 letra, sin espacios y 6 caracteres totales
    return /^(?=.*[0-9])(?=.*[a-z])(?=\S+$).{6,}$/.test($password);
    
}


function isValidEmail (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
};

function isValidCreditCard(numero_tarjeta) {
    var cadena = numero_tarjeta.toString();
    var longitud = cadena.length;
    var cifra = null;
    var cifra_cad=null;
    var suma=0;
    for (var i=0; i < longitud; i+=2){
        cifra = parseInt(cadena.charAt(i))*2;
        if (cifra > 9){ 
            cifra_cad = cifra.toString();
            cifra = parseInt(cifra_cad.charAt(0)) + 
            parseInt(cifra_cad.charAt(1));
        }
        suma+=cifra;
    }
    for (var i=1; i < longitud; i+=2){
        suma += parseInt(cadena.charAt(i));
        }
    
    if ((suma % 10) == 0){ 
        return true;
    } else {
        return false;
    }
}

function isValidCountryCode(thedata){
    var original = thedata;
    var caps = thedata.toUpperCase();
       
    if (thedata.length == 2 && (original === caps)) {
        return true;
    } else {
        return false;
    }
       
};

function isEmptyField($data) {
       if ($data == '' || $data == null || $data.length <=0) {
           return true;
       } else {
           return false;
       }
   };
   
function isValidCPostal($data) {
       if (!$.isNumeric($data) || $data.length <5 || $data.length >=6) {
           return false;
       } else {
           return true;
       }
   };
   
   function isValidCVV($data) {
       if (!$.isNumeric($data) || $data.length <3 || $data.length >=4) {
           return false;
       } else {
           return true;
       }
   };
   
   function isValidYearCard($data) {
       var d = new Date();
       var n = d.getFullYear();
       if (!$.isNumeric($data) || $data < n || $data >= n+20) {
           return false;
       } else {
           return true;
       }
   };
   
   function isValidMonthCard($data) {
       if (!$.isNumeric($data) || $data <= 0 || $data >= 13) {
           return false;
       } else {
           return true;
       }
   };

function onlyLetters($string) {
    //Solo letras y espacios
    
    return /^[a-zA-Z][a-zA-Z\s]*$/.test($string);
}

function formLength(strng, $mindigits = 0) {
    if (strng.length < $mindigits) {
        return false;
    } else {
        return true;
    }
    
}


function cardDate($arrdate, $char = '-') {
    var thedate = $arrdate.split($char);
    
    var year=thedate[0];
    var month=thedate[1]
    
    var status = true;
    
    if (year.length != 4 || year < 1970 || isNaN(year) || year == null || year == '') {
        status = false;
    }
    
    if (month.length > 2 || month.length < 2 || isNaN(month) || month == null || month == '' || month > 12 || month <= 0) {
        status = false;
    }
    return status;
}

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