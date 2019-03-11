    $('.modalpedidoid').on('click', function(event) {
        var dataid = $(event.target).data('pedid');
        genericAjax('ajax/getpedidodetails', { 'dataid': dataid }, 'get', function(json) {
            var stringDetalles = `<p class="h3">Identificador del pedido: ${dataid}</p>
                                <hr>
                                <table class="table text-center ">
                                    <thead>
                                        <tr>
                                            <th class="text-left text-uppercase font-weight-600 letter-spacing-2 text-small black-text">Zapato(Marca: Modelo)</th>
                                            <th class="text-left text-uppercase font-weight-600 letter-spacing-2 text-small black-text">Color</th>
                                            <th class="text-left text-uppercase font-weight-600 letter-spacing-2 text-small black-text">Cantidad</th>
                                            <th class="text-left text-uppercase font-weight-600 letter-spacing-2 text-small black-text">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
            console.log(json);
            console.log('sdfgdsgsd');
            $.each(json.items, function(key, value) {
                stringDetalles += dibujaDetalles(value);
            });
            var total = 0;
            $.each(json.items, function(key, value) {
                total += value.zapato.ppu * value.cantidad;
            });


            stringDetalles += `<tr>
                                    <td class="text-left border-top"></td>
                                    <td class="text-left border-top"></td>
                                    <td class="text-left border-top"></td>
                                    <td class="text-left border-top">${total}€</td>
                                </tr>
                            </tbody>
                        </table>`

            $('#fPedidetail').empty();
            $('#fPedidetail').append(stringDetalles);
        });
    });

    function dibujaDetalles(value) {
        return `<tr>
                    <td class="text-left"> ${value.zapato.marca} - ${value.zapato.modelo} </td>
                    <td class="text-left"> ${value.zapato.color} </td>
                    <td class="text-left"> ${value.cantidad} </td>
                    <td class="text-left"> ${value.zapato.ppu*value.cantidad}€</td>
                </tr>`;
    }



    //Modal de direcciones

    $('#modaleditaddr').on('hidden.bs.modal', function() {
        $('#addr_calle').val('');
        $('#addr_cp').val('');
        $('#addr_ciudad').val('');
        $('#addr_provincia').val('');
        $('#addr_pais').val('');
        $('#addrid').val('');
    });

    $('#modaleditaddr').on('shown.bs.modal', function(event) {
        var dataid = $(event.relatedTarget).data('dataid');
        genericAjax('ajax/getaddrdetails', { 'dataid': dataid }, 'get', function(json) {
            if (json.added) {
                console.log(json.detail);
                $('#addr_calle').val(json.detail.calle);
                $('#addr_cp').val(json.detail.cpostal);
                $('#addr_ciudad').val(json.detail.ciudad);
                $('#addr_provincia').val(json.detail.provincia);
                $('#addr_pais').val(json.detail.pais);
                $('#addrid').val(json.detail.id);

                //getHTMLCatSelect(json.res.category);

            }
            else {
                myAlert('Error getting the address', 'error') // warning, error, success (Depende de lo que pase)
                alert('Error getting address details');
            }
        });
    });

    $('#btSaveAddr').on('click', function(event) {
        var parametros = {
            addr_calle: $('#addr_calle').val().trim(),
            addr_cp: $('#addr_cp').val().trim(),
            addr_ciudad: $('#addr_ciudad').val().trim(),
            addr_provincia: $('#addr_provincia').val().trim(),
            addr_pais: $('#addr_pais').val().trim(),
            addrid: $('#addrid').val().trim(),
        };
        
        var campo1 = isEmptyField(parametros.addr_calle);
        var campo2 = isEmptyField(parametros.addr_ciudad);
        var campo3 = isEmptyField(parametros.addr_provincia);
        var campo4 = isEmptyField(parametros.addr_pais);
        var campo5 = isEmptyField(parametros.addr_cp);
        
        if (!campo1 && !campo2 && !campo3 && !campo4 && !campo5) {
                if (isValidCPostal(parametros.addr_cp)) {
                    genericAjax('ajax/editaddrdetails', parametros, 'get', function(json) {
                        if (json.added) {
                            $('#modaleditaddr').modal('hide');
            
                        }
                        else {
                            alert('Couldnt edit address.');
                        }
                    });
                } else {
                    myAlert('Codigo postal erroneo', 'warning');
                }
        } else {
            myAlert('Hay un campo vacío', 'warning');
        }

        

    });

    $('#btSaveAddr').on('click', function(event) {
        setTimeout( function(){
            genericAjax('ajax/reprintAddrs', null, 'get', function(json) {
                var stringReprint = '';
                console.log(json);
                if (json.added) {
                    $.each(json.reprintdirecciones, function(key, value) {
                        stringReprint += reprintDirecciones(value);
                    });
    
                    $('#addrstbody').empty();
                    $('#addrstbody').append(stringReprint);
                }
                else {
                    alert('Couldnt reprint address.');
                }
            });
        }, 1000);
        
    });

    $('#modaldeleteaddr').on('hidden.bs.modal', function() {
        $('#addrdel').val('');
    });

    $('#modaldeleteaddr').on('shown.bs.modal', function(event) {
        $('#addrdel').val($(event.relatedTarget).data('dataid'));
    });

    $('#btDeleteAddr').on('click', function(event) {

        genericAjax('ajax/deleteaddr', { 'deladdr': $("#addrdel").val().trim() }, 'get', function(json) {
            if (json.added) {
                $('#modaldeleteaddr').modal('hide');

            }
            else {
                alert('Couldnt delete address.');
            }
        });

    });

    $('#btDeleteAddr').on('click', function(event) {
        setTimeout( function(){
            genericAjax('ajax/reprintAddrs', null, 'get', function(json) {
                var stringReprint = '';
                console.log(json);
                if (json.added) {
                    $.each(json.reprintdirecciones, function(key, value) {
                        stringReprint += reprintDirecciones(value);
                    });
    
                    $('#addrstbody').empty();
                    $('#addrstbody').append(stringReprint);
                }
                else {
                    alert('Couldnt reprint address.');
                }
            });
        }, 1000);
    });


    $('#modalnewaddr').on('hidden.bs.modal', function() {
        $('#addr_calle').val('');
        $('#addr_cp').val('');
        $('#addr_ciudad').val('');
        $('#addr_provincia').val('');
        $('#addr_pais').val('');
        $('#addrid').val('');
    });

    $('#btNewAddr').on('click', function(event) {
        var parametros = {
            addr_calle: $('#addr_newcalle').val().trim(),
            addr_cp: $('#addr_newcp').val().trim(),
            addr_ciudad: $('#addr_newciudad').val().trim(),
            addr_provincia: $('#addr_newprovincia').val().trim(),
            addr_pais: $('#addr_newpais').val().trim(),
        };
        
        var campo1 = isEmptyField(parametros.addr_calle);
        var campo2 = isEmptyField(parametros.addr_ciudad);
        var campo3 = isEmptyField(parametros.addr_provincia);
        var campo4 = isEmptyField(parametros.addr_pais);
        var campo5 = isEmptyField(parametros.addr_cp);
        
        if (!campo1 && !campo2 && !campo3 && !campo4 && !campo5) {
                if (isValidCPostal(parametros.addr_cp)) {
                    genericAjax('ajax/createaddr', parametros, 'get', function(json) {
                        console.log(json);
                        if (json.added) {
                            $('#modalnewaddr').modal('hide');
            
                        }
                        else {
                            alert('Couldnt create address.');
                        }
                    });
                } else {
                    myAlert('Codigo postal erroneo', 'warning');
                }
        } else {
            myAlert('Hay un campo vacío', 'warning');
        }

        
    });

    $('#btNewAddr').on('click', function(event) {
        setTimeout(function(){
            genericAjax('ajax/reprintAddrs', null, 'get', function(json) {
                var stringReprint = '';
                console.log(json);
                if (json.added) {
                    $.each(json.reprintdirecciones, function(key, value) {
                        stringReprint += reprintDirecciones(value);
                    });
    
                    $('#addrstbody').empty();
                    $('#addrstbody').append(stringReprint);
                }
                else {
                    alert('Couldnt reprint address.');
                }
            });
        }, 1000);
        
    });

    function reprintDirecciones(value) {
        return `<tr class="addrrow">
                    <td class="text-left">${ value.pais }</td>
                    <td class="text-left">${ value.provincia }</td>
                    <td class="text-left">${ value.ciudad }</td>
                    <td class="text-left">${ value.cpostal }</td>
                    <td class="text-left">${ value.calle }</td>
                    <td><button class="btn-info btn btn-small" id="modaldirid" class="js-direditModal" data-toggle="modal" data-dataid="${value.id}" data-target="#modaleditaddr" role="button">Edit</button></td>
                    <td><button class="btn-danger btn btn-small" id="modaldirdel" class="js-dirdeleteModal" data-toggle="modal" data-dataid="${value.id}" data-target="#modaldeleteaddr" role="button">Delete</button></td>
                </tr>`
    }

    $('.checkcardactiva').on('change', function(event) {
        var dataid = $(event.target).data('dataid');
        genericAjax('ajax/modifycardactive', { 'dataid': dataid }, 'get', function(json) {
            if (json.added) {
                console.log('Done boi');
            }
            else {
                alert('Error getting card details');
            }
        });
    });





    //Modal de metodos de pago

    $('#modaleditcard').on('hidden.bs.modal', function() {
        $('#card_cardnum').val('');
        $('#card_cvv').val('');
        $('#card_expiry').val('');
        $('#cardid').val('');
    });

    $('#modaleditcard').on('shown.bs.modal', function(event) {
        var dataid = $(event.relatedTarget).data('dataid');
        genericAjax('ajax/getcarddetails', { 'dataid': dataid }, 'get', function(json) {
            if (json.added) {
                console.log(json.detail);
                $('#card_cardnum').val(json.detail.numerotarjeta);
                $('#card_cvv').val(json.detail.cvv);
                $('#card_expiry').val(json.detail.fechaexpiracion);
                $('#cardid').val(json.detail.id);

                //getHTMLCatSelect(json.res.category);

            }
            else {
                alert('Error getting card details');
            }
        });
    });

    // como vas con esto?¿
    //Sigue sin funcar
    $('#btSaveCard').on('click', function(event) {

        var expdate = $('#card_expiry').val().trim();
        var mySplit = expdate.split('-');

        if (isNaN(mySplit[0]) || isNaN(mySplit[1]) || mySplit.length != 2) {
            return false;
        }

        var parametros = {
            card_cardnum: $('#card_cardnum').val().trim(),
            card_cvv: $('#card_cvv').val().trim(),
            card_year: mySplit[0],
            card_month: mySplit[1],
            cardid: $('#cardid').val().trim(),
        };
        
        var campo1 = isEmptyField(parametros.card_cardnum);
        var campo2 = isEmptyField(parametros.card_cvv);
        var campo3 = isEmptyField($('#card_expiry').val().trim());
        
        if (!campo1 && !campo2 && !campo3) {
            if (isValidCreditCard(parametros.card_cardnum)) {
                if (isValidCVV(parametros.card_cvv)) {
                    if (isValidYearCard(parametros.card_year) && isValidMonthCard(parametros.card_month)) {
                        genericAjax('ajax/editcarddetails', parametros, 'get', function(json) {
                            if (json.added) {
                                $('#modaleditaddr').modal('hide');
                            }
                            else {
                                alert('Couldnt edit card.');
                            }
                        });
                    } else {
                        myAlert('Fecha incorrecta', 'warning');
                    }
                } else {
                    myAlert('CVV incorrecto', 'warning');
                }
            } else {
                myAlert('El número de tarjeta es erroneo', 'warning');
            }
        } else {
            myAlert('Hay un campo vacío', 'warning');
        }
    });

    $('#btSaveCard').on('click', function(event) {
        setTimeout(function(){
            genericAjax('ajax/reprintCards', null, 'get', function(json) {
                var stringCards = '';
                console.log(json);
                if (json.added) {
                    $.each(json.reprinttarjetas, function(key, value) {
                        stringCards += reprintTarjetas(value);
                    });
    
                    $('#cardstbody').empty();
                    $('#cardstbody').append(stringCards);
    
                    $('.checkcardactiva').on('change', function(event) {
                        var dataid = $(event.target).data('dataid');
                        genericAjax('ajax/modifycardactive', { 'dataid': dataid }, 'get', function(json) {
                            if (json.added) {
                                console.log('Done boi');
                                $('#modaleditcard').modal('hide');
                            }
                            else {
                                alert('Error getting card details');
                            }
                        });
                    });
                }
                else {
                    alert('Couldnt reprint address.');
                }
            });
        }, 1000);
        
    });



    $('#modaldeletecard').on('hidden.bs.modal', function() {
        $('#carddel').val('');
    });

    $('#modaldeletecard').on('shown.bs.modal', function(event) {
        $('#carddel').val($(event.relatedTarget).data('dataid'));
    });

    $('#btDeleteCard').on('click', function(event) {

        genericAjax('ajax/deletecard', { 'delcard': $("#carddel").val().trim() }, 'get', function(json) {
            if (json.added) {
                $('#modaldeletecard').modal('hide');
            }
            else {
                alert('Couldnt delete card.');
            }
        });

    });

    $('#btDeleteCard').on('click', function(event) {
        setTimeout(function() {
            genericAjax('ajax/reprintCards', null, 'get', function(json) {
                var stringCards = '';
                console.log(json);
                if (json.added) {
                    $.each(json.reprinttarjetas, function(key, value) {
                        stringCards += reprintTarjetas(value);
                    });

                    $('#cardstbody').empty();
                    $('#cardstbody').append(stringCards);

                    $('.checkcardactiva').on('change', function(event) {
                        var dataid = $(event.target).data('dataid');
                        genericAjax('ajax/modifycardactive', { 'dataid': dataid }, 'get', function(json) {
                            if (json.added) {
                                console.log('Done boi');
                            }
                            else {
                                alert('Error getting card details');
                            }
                        });
                    });
                }
                else {
                    alert('Couldnt reprint address.');
                }
            });
        }, 1000);

    });


    $('#modalnewcard').on('hidden.bs.modal', function() {
        $('#card_newcardnum').val('');
        $('#card_newcvv').val('');
        $('#card_newexpiry').val('');

    });

    $('#btNewCard').on('click', function(event) {
        var expdate = $('#card_newexpiry').val().trim();
        var mySplit = expdate.split('-');

        if (isNaN(mySplit[0]) || isNaN(mySplit[1]) || mySplit.length != 2) {
            return false;
        }

        var parametros = {
            card_cardnum: $('#card_newcardnum').val().trim(),
            card_cvv: $('#card_newcvv').val().trim(),
            card_expiry: $('#card_newexpiry').val().trim(),
            card_year: mySplit[0],
            card_month: mySplit[1],
        };
        
        var campo1 = isEmptyField(parametros.card_cardnum);
        var campo2 = isEmptyField(parametros.card_cvv);
        var campo3 = isEmptyField($('#card_newexpiry').val().trim());
        
        if (!campo1 && !campo2 && !campo3) {
            if (isValidCreditCard(parametros.card_cardnum)) {
                if (isValidCVV(parametros.card_cvv)) {
                    if (isValidYearCard(parametros.card_year) && isValidMonthCard(parametros.card_month)) {
                        genericAjax('ajax/createcard', parametros, 'get', function(json) {
                            console.log(json.fecha);
                            if (json.added) {
                                $('#modalnewcard').modal('hide');
                
                            }
                            else {
                                alert('Couldnt create card.');
                            }
                        });
                    } else {
                        myAlert('Fecha incorrecta', 'warning');
                    }
                } else {
                    myAlert('CVV incorrecto', 'warning');
                }
            } else {
                myAlert('El número de tarjeta es erroneo', 'warning');
            }
        } else {
            myAlert('Hay un campo vacío', 'warning');
        }
        

    });

    $('#btNewCard').on('click', function(event) {
        setTimeout(function(){
            genericAjax('ajax/reprintCards', null, 'get', function(json) {
                var stringCards = '';
                console.log(json);
                if (json.added) {
                    $.each(json.reprinttarjetas, function(key, value) {
                        stringCards += reprintTarjetas(value);
                    });
    
                    $('#cardstbody').empty();
                    $('#cardstbody').append(stringCards);
    
                    $('.checkcardactiva').on('change', function(event) {
                        var dataid = $(event.target).data('dataid');
                        genericAjax('ajax/modifycardactive', { 'dataid': dataid }, 'get', function(json) {
                            if (json.added) {
                                console.log('Done boi');
                            }
                            else {
                                alert('Error getting card details');
                            }
                        });
                    });
                }
                else {
                    alert('Couldnt reprint address.');
                }
            });
        }, 1000); // Cambia en pos de que sea tarjeta, direccion, o eliminar o editar
                    //Sino tiraria del ctrl c y ctrl v xd
        
    });

    function reprintTarjetas(value) {
        return `<tr class="cardrow">
                    <td class="text-left">${ value.numerotarjeta }</td>
                    <td class="text-left">${ value.cvv }</td>
                    <td class="text-left">${ value.fechaexpiracion }</td>
                    <td><input type="radio" data-dataid="${value.id}" class="checkcardactiva" name="cardfav"></input></td>
                    <td><button class="btn btn-small btn-info" id="modalcardid" class="js-cardeditModal" data-toggle="modal" data-dataid="${value.id}" data-target="#modaleditcard" role="button">Edit</button></td>
                    <td><button class="btn btn-small btn-danger" id="modalcarddel" class="js-carddelModal" data-toggle="modal" data-dataid="${value.id}" data-target="#modaldeletecard" role="button">Delete</button></td>
                </tr>`
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
    
    function myAlert(text, tipo = 'alert') {

        new Noty({
            type: tipo,
            text: text,
            progressBar: true,
            layout: 'topRight',
            theme: 'mint',
            timeout: 7000,
        }).show();

    }
    