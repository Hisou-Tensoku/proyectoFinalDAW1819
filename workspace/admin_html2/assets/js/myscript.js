(function() {

    var errorFields;
    var errors;
    var search = '';
    var callback;
    var currShoeId;

    // Generic Ajax Function
    var genericAjax = function(url, data, type, callBack) {
        $.ajax({
                url: url,
                data: data,
                type: type,
                dataType: 'json',
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                xhrFields: { withCredentials: true }
            })
            .done(function(json) {
                console.log('ajax ok');
                console.log(json);
                callBack(json);
            })
            .fail(function(xhr, status, errorThrown) {
                console.log('ajax fail');
            })
            .always(function(xhr, status) {
                console.log('ajax always');
            });
    }

    // Add publics or categories
    $('.add-cat-public').unbind().on('click', function(event) {
        event.preventDefault();
        var accion = $(this).data('accion');
        if (accion === '') {
            return;
        }
        var nombre = $(this).prev().val().trim();
        $(this).removeClass('errorForm');
        $(this).prev().removeClass('errorForm');

        
        if (!onlyLetters(nombre) || !formLength(nombre, 3)) {
            $(this).addClass('errorForm');
            $(this).prev().addClass('errorForm');
            return;
        }
        
        var parametros = null;
        if (accion == 'addcategory') {
            parametros = {
                'nombre': nombre
            };
        }
        if (accion == 'addpublic') {
            parametros = {
                'nombre': nombre
            };
        }

        if (parametros !== null && parametros.nombre !== '') {
            let that = $(this);

            genericAjax('ajax/' + accion, parametros, 'post', function(json) {
                if (json.add > 0) {
                    var newElement;
                    var container;
                    if (accion == 'addcategory') {
                        newElement = $(`<label>
                              <input type="checkbox" name="destinatario" value="${json.category.id}">
                               ${json.category.nombre}
                            </label>`);
                        container = $('.jsCatList');
                    }
                    else {
                        newElement = $(`<label>
                                <input type="radio" name="destinatario" value="${json.public.id}">
                                ${json.public.nombre}
                            </label>`);
                        container = $('.jsPubList');
                    }

                    //var padre = that.parent('.form-group');
                    //padre = padre.prev('.form-group');
                    that.prev().val('');
                    newElement.hide().appendTo(container).fadeIn(1000);
                }
                else {
                    that.addClass('errorForm');
                    that.prev().addClass('errorForm');
                }
            });
        }
    });

    $('.btCreateShoe').unbind().on('click', addShoeListener);

    $('#btCreateUser').unbind().on('click', addUserListener);

    $('#btSearch').unbind().on('click', function(event) {
        event.preventDefault();
        search = $('#inputSearch').val().trim();
        callback(1, search);
    });

    $('.jsBtCancel').unbind().on('click', function() {
        let modal = $(this).closest('.modal');
        modal.modal('hide');
    });

    $('#jsBtConfirmEditShoe').unbind().on('click', addShoeEditListener);
    $('#jsBtConfirmEditUser').unbind().on('click', addUserEditListener);


    function beforeModal(that, event, aftercall) {
        event.preventDefault();

        let route = that.data('ajax');
        let id = that.data('id');
        let modal = that.data('modal');
        genericAjax(route, { 'idshoe': id }, 'post', function(json) {
            if (json !== null) {
                aftercall(json, id);
                $(modal).modal('show');
            }
        });
    }

    function beforeEditModal(event) {
        event.preventDefault();

        let route = $(this).data('ajax');
        let id = $(this).data('id');
        let modal = $($(this).data('modal'));
        genericAjax(route, { 'idshoe': id }, 'post', function(json) {
            if (json !== null) {
                modal.modal('show');
                printEditShoe(json);
            }
        });
    }


    // Get data from ajax
    function getShoes(page = 1, search = null) {
        var parametros = { 'pagina': page, 'search': search };
        genericAjax('ajax/getadminshoes', parametros, 'post', function(json) {
            printTableShoes(json.items);
            printPagination(json.pages, '#js-paginateShoe', callback);
        });
    }

    function getUsers(page = 1, search = null) {
        var parametros = { 'pagina': page, 'search': search };
        genericAjax('ajax/getadminusers', parametros, 'post', function(json) {
            printTableUsers(json.items);
            printPagination(json.pages, '#js-paginateUser', callback);
        });
    }

    // Print Shoes in the Table
    function printTableShoes(items = null) {

        $('#dataTableShoe').empty();
        var dataTable = '';
        if (items.length === 0) {
            myAlert('Oops! We have not found any shoes...', 'warning');
            return;
        }

        $.each(items, function(key, value) {
            dataTable += getShoeRow(value);
        });

        let padre = $('#dataTableShoe');
        $(dataTable).hide().appendTo(padre).fadeIn(1000);
        $('#dataTableShoe .btSize').unbind().on('click', function(event) {
            beforeModal($(this), event, printSizes);
        });
        $('#dataTableShoe .btEditShoe').unbind().on('click', function(event) {
            beforeModal($(this), event, printEditShoe);
        });
        $('#dataTableShoe .btPhotos').unbind().on('click', function(event) {
            beforeModal($(this), event, printPhotos);
        });
        $('#dataTableShoe .btRemoveShoe').unbind().on('click', removeShoeListener);
    }

    function printTableUsers(items = null) {
        $('#dataTableUser').empty();
        var dataTable = '';
        if (items.length === 0) {
            $('#dataTableUser').append('<h4>Oops! We have not found any shoes...</<h4>');
            myAlert(`We have not found any shoes`, 'alert');
            return;
        }
        $.each(items, function(key, value) {
            dataTable += getUserRow(value);
        });
        let padre = $('#dataTableUser');
        $(dataTable).hide().appendTo(padre).fadeIn(400);
        $('#dataTableUser .btEditUser').unbind().on('click', function(event) {
            beforeModal($(this), event, printEditUser);
        });
    }

    function printSizes(json) {
        $('#modalEditSize #jsBtConfirmSize').off('click', addSizes);
        $('#jstableSize').empty();
        $('.jsAfterTableSize').empty();
        var dataTable = '';
        if (json.items.length === 0) {
            myAlert(`We have not found any sizes`, 'alert');
        }
        $.each(json.items, function(key, value) {
            dataTable += getSizeRow(value);
        });
        let newsz = `<input type="number" value="38" step="0.5">
                    <button href="#" class="newSize btn btn-light">Add new size</button>`;

        let padre = $('#jstableSize');
        $(dataTable).hide().appendTo(padre).fadeIn(700);
        $(newsz).hide().appendTo('.jsAfterTableSize').fadeIn(400);
        $('.newSize').on('click', function() {
            let newSize = $(this).prev().val();
            console.log(newSize);
            let unique = true;
            $('.size-number').each(function() {
                if (Math.round($(this).text() * 100) == Math.round(newSize * 100)) {
                    unique = false;
                    myAlert('You can not repeat the same size', 'error');
                }
            });
            if (unique) {
                let param = { 'numero': newSize, 'stock': 0, 'id': 0 };
                $('#jstableSize').append(getSizeRow(param));
            }
        });
        $('#modalEditSize .deleteSize').unbind().on('click', deleteRow);
        $('#modalEditSize #jsBtConfirmSize').unbind().on('click', function(event) {
            addSizes(event, json.idshoe);
        });
    }

    function deleteRow(event) {
        event.preventDefault();
        $(this).closest('tr').fadeOut(200, function() {
            $(this).closest('tr').remove();
        });
    }

    function printPhotos(json, idshoe) {
        $('#jstablePhotos').empty();
        $('#jsAfterTablePhotos input').val('');
        var dataTable = '';
        if (json.listphotos.length === 0) {
            myAlert('Oops! We have not found any photos...');
        }
        $.each(json.listphotos, function(key, value) {
            dataTable += getPhotoRow(value);
        });
        let padre = $('#jstablePhotos');
        $(dataTable).hide().appendTo(padre).fadeIn(200);

        $('.newPhoto').unbind().on('click', function() {
            let field = $(this).prev();
            let newPhoto = $(this).prev().val();
            let unique = true;
            $('.photo-link').each(function() {
                if ($(this).val() == newPhoto) {
                    unique = false;
                    myAlert('You can not repeat the same photo', 'error');
                    return;
                }
            });
            if (unique) {
                let param = { 'ruta': newPhoto, 'zapato': 0, 'id': 0 };
                $('#jstablePhotos').append(getPhotoRow(param));
                field.val('');
            }
        });
        $('#modalPhotos #jsBtConfirmPhotos').unbind().on('click', function(event) {
            addPhotos(event, idshoe);
        });
        $('#modalPhotos .deletePhoto').unbind().on('click', deleteRow);
    }

    function printEditShoe(json) {
        if (json.shoe !== null) {
            $('#jsBtConfirmEditShoe').data('id', json.shoe.id);
            $('#editBrand').val(json.shoe.marca);
            $('#editModel').val(json.shoe.modelo);
            $('#editPpu').val(json.shoe.ppu);
            $('#editColor').val(json.shoe.color);
            $('#editCover').val(json.shoe.cubierta);
            $('#editForro').val(json.shoe.forro);
            $('#editSole').val(json.shoe.suela);
            $('#editDescription').val(json.shoe.descripcion);
            $('#jsCatListEdit input[name=Category]').each(function() {
                let that = $(this);
                that.prop('checked', false);
                $.each(json.cats, function(key, item) {
                    if (that.val() == item.id) {
                        that.prop('checked', true);
                    }
                });
            })
            let pubid = json.public.id;
            console.log(pubid);
            $(`#jsPubListEdit input[name=Public][value=${pubid}]`).prop('checked', true);
        }
        else {
            myAlert('Shoe could not be loaded', 'error');
        }
    }

    function printEditUser(json) {
        if (json.user !== null) {
            $('#jsBtConfirmEditUser').data('id', json.user.id);
            $('#editNickname').val(json.user.nickname);
            $('#editName').val(json.user.nombre);
            $('#editLastNames').val(json.user.apellidos);
            $('#editMail').val(json.user.correo);
            $('#editPassword').val(json.user.clave);
            $('#editActive').prop('checked', json.user.activo ? true : false);
            $('#editAdmin').prop('checked', json.user.administrador ? true : false);
        }
        else {
            myAlert('Shoe could not be loaded', 'error');
        }
    }

    var printPagination = function(paginas, div, callback) {
        $(div).empty();
        var stringPrev = '<button href="#" class="btnPagina btn btn-light" data-pagina="' + paginas.anterior + '">&#10092;</button>';
        var stringRange = '';
        if (paginas.rango != null) {
            $.each(paginas.rango, function(key, value) {
                if (paginas.pagina == value) {
                    stringRange += '<button href="#" class="btnNoPagina active btn btn-light">' + value + '</button>';
                }
                else {
                    stringRange += '<button href="#" class="btnPagina btn btn-light" data-pagina="' + value + '">' + value + '</button>';
                }
            });
        }
        var stringNext = '<button href="#" class="btnPagina btn btn-light" data-pagina="' + paginas.siguiente + '">&#10093;</button>';
        var finalString = stringPrev + stringRange + stringNext;

        $(finalString).appendTo(div).fadeIn(1000);

        $('.btnPagina').unbind().on('click', function(e) {
            e.preventDefault();
            var p = $(this).data('pagina');
            callback(p);
        });
        $('.btnNoPagina').unbind().on('click', function(e) {
            e.preventDefault();
        });
    };

    function getShoeRow(value) {
        var element = `
            <tr class="even gradeC js-row">
                <td>${value.id}</td>
                <td>${value.marca}</td>
                <td>${value.modelo}</td>
                <td>${value.ppu}</td>
                <td>${value.color}</td>
                <td  class="text-center">
                  <a href="${value.id > 0 ? 'product?pid='+value.id : 'store'}" target="_onblank" class="btn btn-info"><i class="material-icons">store</i></a>
                </td>
                <td   class="text-center">
                    <a class="btn btn-info btn-rounded btPhotos" 
                        data-modal="#modalPhotos" 
                        data-ajax="ajax/viewphotos"
                        data-id="${value.id}" 
                        href="ajax/viewphotos?shoeid=${value.id}">
                        <i class="material-icons">camera_alt</i>
                    </a>
                </td>
                <td class="text-center"><a href="#" class="btn btn-info btn-rounded  btSize" 
                        data-modal="#modalEditSize" 
                        data-ajax="ajax/getadminsizes" 
                        data-id="${value.id}">
                        <i class="material-icons">format_list_numbered</i>
                    </a>
                </td>
                <td class="text-center"> <a href="#" class="btEditShoe btn btn-warning btn-rounded " 
                        data-modal="#modalEditShoe" 
                        data-ajax="ajax/getadminshoe"
                        data-id="${value.id}"><i class="material-icons">edit</i></a></td>
                <td class="text-center"><a href="#" class="btRemoveShoe btn btn-danger btn-rounded " 
                        data-id="${value.id}"><i class="material-icons">delete</i></a></td>
            </tr>
        `;
        return element;
    }

    function getSizeRow(value) {
        var element = `
            <tr class="even gradeC js-row">
                <td class="size-number">${value.numero}</td>
                <td>
                    <input type="number" class="size-stock" value="${value.stock}" min="0">
                    <input type="hidden" class="size-id" value="${value.id ? value.id : 0}">
                    <input type="hidden" class="shoe-id" value="${value.shoe ? value.shoe : $('.btSize').data('id')}">
                </td>
                <td>
                    <a href="#" class="deleteSize" data-id="${value.id}">&#10005;</a>
                </td>
            </tr>
        `;
        return element;
    }

    function getPhotoRow(value) {
        var element = `
            <tr class="even gradeC js-row text-center">
                <td style="width:10%;" class="size-number">
                    ${value.id}
                    <input type="hidden" class="photo-id" value="${value.id}">
                </td>
                <td style="width:10%;">${value.zapato ? value.zapato : $('.btPhotos').data('id')}</td>
                <td><input type="text" style="width:100%;" class="photo-link" value="${value.ruta}"></td>
                <td style="width:10%;"><a href="#" class="deletePhoto" data-id="${value.id}">&#10005;</a></td>
            </tr>
        `;
        return element;
    }

    function getUserRow(value) {
        var element = `
            <tr class="even gradeC js-row">
                <td>${value.id}</td>
                <td>${value.nickname}</td>
                <td>${value.nombre}</td>
                <td>${value.apellidos}</td>
                <td>${value.correo}</td>
                <td>${value.fechaalta.date}</td>
                <td>
                    <i class="material-icons">
                    ${value.activo ? 'check_box' : 'check_box_outline_blank'}
                    </i>
                </td>
                <td>
                    <i class="material-icons">
                    ${value.administrador ? 'check_box' : 'check_box_outline_blank'}
                    </i>
                </td>
                <td>
                    <a href="" class="btEditUser btn btn-warning btn-rounded" 
                            data-id="${value.id}"
                            data-modal="#modalEditShoe"
                            data-ajax="ajax/getadminuser">
                        <i class="material-icons">edit</i>
                    </a>
                </td>
            </tr>
        `;
        return element;
    }


    // Add shoe
    function addShoeListener(event) {

        event.preventDefault();
        errorFields = $('#errorFields')
        errorFields.removeClass('card-header');
        errorFields.empty();
        errors = $('<ul class="mt20"></ul>');

        // Recopilamos datos
        var newBrand = isValidText($('#newBrand'));
        var newModel = isValidText($('#newModel'));
        var newPpu = isValidNumber($('#newPpu'));
        var newColor = isValidText($('#newColor'));
        var newCover = isValidText($('#newCover'));
        var newForro = isValidText($('#newForro'));
        var newSole = isValidText($('#newSole'));
        var newPublic = valueCheck($('#formShoe input[name=Public]:checked'));
        var newCategories = isValidArray($('#formShoe input[name=Category]:checked'));
        var newDescription = $('#newDescription').val().trim();

        if (newBrand && newModel && newPpu &&
            newColor && newCover && newForro &&
            newSole && newPublic && newCategories) {
            // Creamos objeto
            var object = {

                marca: newBrand,
                modelo: newModel,
                idDestinatario: newPublic,
                ppu: newPpu,
                color: newColor,
                cubierta: newCover,
                forro: newForro,
                suela: newSole,
                descripcion: newDescription,
                arrayCategorias: newCategories,

            }
            genericAjax('ajax/addshoe', object, 'post', function(json) {
                myAlert(`#${json.addshoe} has been registered`, 'success');
                cleanForm('#formShoe');
                callback();
            });
        }
        else {
            errorFields.addClass('card-header');
            errorFields.append('<h4 class="card-title">Sorry, there are a few errors</h4>');
            errors.hide().appendTo(errorFields).fadeIn(1000);
            myAlert(`Sorry, there are a few errors`, 'error');
        }

    }

    function removeShoeListener(event) {
        event.preventDefault();
        let id = $(this).data('id');

        myAlert(`Querías borrar #${id} pero ha dejado de funcionar el método de borrado en
                la base de datos.`, 'warning');
        /*
        if (jQuery.isNumeric(id) && id > 0) {
            genericAjax('ajax/removeshoe', { 'idshoe': id }, 'post', function(json) {
                if (json.operation > 0) {
                    myAlert(`#${id} removed`, 'success');
                    getShoes();
                }
                else {
                    myAlert(`Error trying to remove #${id}`);
                }
            });
        }*/
    }

    // Add user
    function addUserListener(event) {

        event.preventDefault();
        errorFields = $('#errorFields')
        errorFields.removeClass('card-header');
        errorFields.empty();
        errors = $('<ul class="mt20"></ul>');

        // Recopilamos datos
        var newNickname = isValidText($('#newNickname'));
        var newName = isValidText($('#newName'));
        var newLastNames = isValidText($('#newLastNames'));
        var newMail = isValidEmailField($('#newMail'));
        var newPassword = isValidPassword($('#newPassword'));
        var newActive = isChecked($('#newActive'));
        var newAdmin = isChecked($('#newAdmin'));

        if (newNickname && newName && newLastNames &&
            newMail && newPassword && newActive !== null &&
            newAdmin !== null) {

            // Creamos objeto
            var object = {
                nickname: newNickname,
                nombre: newName,
                apellidos: newLastNames,
                correo: newMail,
                clave: newPassword,
                activo: newActive,
                administrador: newAdmin
            }
            genericAjax('ajax/adduser', object, 'post', function(json) {
                if (json.adduser !== 0) {
                    cleanForm('#formUser');
                    myAlert(`#${json.adduser} has been registered`, 'success');
                    getUsers();
                }
                else {
                    myAlert(`Error trying to register this user. Please, try again later.`, 'error');
                }
            });
        }
        else {
            errorFields.addClass('card-header');
            errorFields.append('<h4 class="card-title">Sorry, there are a few errors</h4>');
            errors.hide().appendTo(errorFields).fadeIn(1000);
        }
    }

    // Add sizes
    function addSizes(event, idshoe) {
        event.preventDefault();

        // Recopilamos datos
        var sizes = new Array();
        $('#jstableSize tr').each(function() {
            let numero = $(this).find('.size-number').text();
            let stock = $(this).find('.size-stock').val();
            let id = $(this).find('.size-id').val();
            let shoe = idshoe;
            if (jQuery.isNumeric(numero) && numero > 0) {
                var object = {
                    'id': id,
                    'numero': numero,
                    'stock': stock,
                    'shoe': shoe,
                };
                sizes.push(object);
            }
        })
        console.log(sizes)
        genericAjax('ajax/updateadminsizes', { 'sizes': sizes, 'idshoe': idshoe }, 'post', function(json) {
            if (json.operaciones !== null) {
                myAlert('Sizes modified correctly', 'success');
            }
            else {
                myAlert('Sizes could not be modified', 'error');
            }
        });
    }

    // Add photos
    function addPhotos(event, idshoe) {
        event.preventDefault();

        // Recopilamos datos
        var photos = new Array();
        $('#jstablePhotos tr').each(function() {
            let ruta = $(this).find('.photo-link').val();
            console.log(ruta)
            let id = $(this).find('.photo-id').val();
            console.log(id);
            if (jQuery.isNumeric(id)) {
                var object = {
                    'id': id,
                    'ruta': ruta,
                    'idshoe': idshoe,
                };
                photos.push(object);
            }
        })
        console.log(photos)
        genericAjax('ajax/updateadminphotos', { 'photos': photos, 'idshoe': idshoe }, 'post', function(json) {
            if (json.operaciones !== null) {
                myAlert('Photos modified correctly', 'success');
            }
            else {
                myAlert('Photos could not be modified', 'error');
            }
        });
    }

    function addShoeEditListener(event) {

        event.preventDefault();
        errorFields = $('#errorFieldsEdit');
        errorFields.removeClass('card-header');
        errorFields.empty();
        errors = $('<ul class="mt20"></ul>');

        // Recopilamos datos
        var idshoe = $(this).data('id');
        var newBrand = isValidText($('#editBrand'));
        var newModel = isValidText($('#editModel'));
        var newPpu = isValidNumber($('#editPpu'));
        var newColor = isValidText($('#editColor'));
        var newCover = isValidText($('#editCover'));
        var newForro = isValidText($('#editForro'));
        var newSole = isValidText($('#editSole'));
        var newPublic = valueCheck($('#formEditShoe input[name=Public]:checked'));
        var newCategories = isValidArray($('#formEditShoe input[name=Category]:checked'));
        var newDescription = $('#editDescription').val().trim();

        if (newBrand && newModel && newPpu &&
            newColor && newCover && newForro &&
            newSole && newPublic && newCategories) {
            // Creamos objeto
            var object = {

                id: idshoe,
                marca: newBrand,
                modelo: newModel,
                idDestinatario: newPublic,
                ppu: newPpu,
                color: newColor,
                cubierta: newCover,
                forro: newForro,
                suela: newSole,
                descripcion: newDescription,
                arrayCategorias: newCategories,

            }
            genericAjax('ajax/editadminshoe', object, 'post', function(json) {
                if (json.operation > 0) {
                    myAlert(`#${idshoe} has been edited`, 'success');
                    cleanForm('#formShoe');
                    callback();
                }
                else {
                    myAlert(`Error editing #${idshoe}`, 'error')
                }
            });
        }
        else {
            errorFields.addClass('card-header');
            errorFields.append('<h4 class="card-title">Sorry, there are a few errors</h4>');
            errors.hide().appendTo(errorFields).fadeIn(1000);
        }

    }

    function addUserEditListener(event) {

        event.preventDefault();
        errorFields = $('#errorFieldsEdit')
        errorFields.removeClass('card-header');
        errorFields.empty();
        errors = $('<ul class="mt20"></ul>');

        // Recopilamos datos
        var iduser = $(this).data('id');
        var editNickname = isValidText($('#editNickname'));
        var editName = isValidText($('#editName'));
        var editLastNames = isValidText($('#editLastNames'));
        var editMail = isValidEmailField($('#editMail'));
        var editPassword = $('#editPassword').val().trim() === '' ? true : isValidPassword($('#editPassword'));
        var editActive = isChecked($('#editActive'));
        var editAdmin = isChecked($('#editAdmin'));

        if (jQuery.isNumeric(iduser) && iduser > 0 &&
            editNickname && editName && editLastNames &&
            editMail && editPassword) {
            // Creamos objeto
            var object = {
                id: iduser,
                nickname: editNickname,
                clave: editPassword,
                nombre: editName,
                apellidos: editLastNames,
                correo: editMail,
                activo: editActive,
                administrador: editAdmin,
            }
            console.log(object);
            genericAjax('ajax/editadminuser', object, 'post', function(json) {
                if (json.operation > 0) {
                    myAlert(`#${iduser} has been edited`, 'success');
                    cleanForm('#formShoe');
                    callback();
                }
                else {
                    myAlert(`Error editing #${iduser}`, 'error')
                }
            });
        }
        else {
            errorFields.addClass('card-header');
            errorFields.append('<h4 class="card-title">Sorry, there are a few errors</h4>');
            errors.hide().appendTo(errorFields).fadeIn(1000);
        }

    }

    // Clean Form after adding correctly
    function cleanForm(idFormulario) {

        $(idFormulario).find('input, textarea').each(function() {
            $(this).val('');
        });

    }

    // Checks...
    function isValidText(field) {
        field.removeClass('errorForm');
        let value = field.val().trim();
        mindigits = field.data('mindigits') ? field.data('mindigits') : 0
        if (!formLength(value, mindigits)) {
            errors.append(`
                <li>${field.attr('name')} field can not be empty.</li>
            `);
            if (mindigits > 0) {
                errors.append(` At least ${mindigits} chars.</li>
                `);
            }
            field.addClass('errorForm')
            return false;
        }

        return value;

    }
    
    function isValidNumber(field) {
        field.removeClass('errorForm');
        let value = field.val().trim();
        if (!jQuery.isNumeric(value) || value <= 0) {
            errors.append(`
                <li>${field.attr('name')} field must be a number and over 0.</li>
            `);
            field.addClass('errorForm')
            return false;
        }

        return value;

    }
    
    function isValidEmailField(field) {
        field.removeClass('errorForm');
        let value = field.val().trim();
        if (!isValidEmail(value)) {
            errors.append(`
                <li>${field.attr('name')} field must be a email adress.</li>
            `);
            field.addClass('errorForm')
            return false;
        }
        return value;
    }
    
    function isValidPassword(field) {
        field.removeClass('errorForm');
        let value = field.val().trim();
        if (!validatePassword(value)) {
            errors.append(`
                <li>${field.attr('name')} field must have: 1 number, no spaces and 6 total chars.</li>
            `);
            field.addClass('errorForm')
            return false;
        }
        return value;
    }
    function isValidArray(field) {
        field.parent().removeClass('errorForm');
        var array = field.map(function(_, el) {
            return $(el).val();
            // To return an array with the values 
        }).get();
        if (array === undefined) {
            errors += `
                <li>${field.name} field can not be empty.</li>
            `;
            field.addClass('errorForm')

            return false;
        }

        return array;
    }

    function valueCheck(field) {
        let value = 0;
        if (field.is(":checked")) {
            value = field.val();
        }

        return value;
    }

    function isChecked(field) {
        let value = 0;
        if (field.is(":checked")) {
            value = 1;
        }

        return value;
    }

    function initialAjax() {
        let ajaxroute = $('.myDataTable').data('ajax').trim();
        genericAjax(ajaxroute, null, 'get', function(json) {
            switch (ajaxroute) {
                case 'ajax/getadminshoes':
                    callback = getShoes;
                    printTableShoes(json.items);
                    printPagination(json.pages, '#js-paginateShoe', callback);
                    break;
                case 'ajax/getadminusers':
                    callback = getUsers;
                    printTableUsers(json.items);
                    printPagination(json.pages, '#js-paginateUser', callback);
                default:
                    // code
            }
        });
    }
    initialAjax();

    function acorta(text, limit) {
        return text.substring(0, limit) + '...';
    }

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

    $(document).ready(function() {
        $('.loader').addClass('quit-loader');
        setTimeout(function() {
            $('.loader').remove();
        }, 500)
    });
})();
