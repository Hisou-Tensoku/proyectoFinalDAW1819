(function() {
    
    
    $('#registerForm').on('submit', checkForm);
    
    function checkForm(event) {
        
        var correctForm = true;
        
        var alias = $('#alias');
        var aliasval = alias.val().trim();
        if (!formLength(aliasval, 3)) {
            myAlert('Username field needs at least 3 letters or digits','error');
            correctForm = false;
        }
        
        var nombre = $('#nombre');
        var nombreval = nombre.val().trim();
        if (!onlyLetters(nombreval) || !formLength(aliasval, 3)) {
            myAlert('Name field needs at least 3 letters. Numbers not allowed','error');
            correctForm = false;
        }
        
        var apellidos = $('#apellidos');
        var apellidosval = apellidos.val().trim();
        if (!onlyLetters(nombreval) || !formLength(aliasval, 3)) {
            myAlert('Name field needs at least 3 letters. Numbers not allowed','error');
            correctForm = false;
        }
        
        var correo = $('#correo');
        var correoval = correo.val().trim();
        if (!isValidEmail(correoval)) {
            myAlert('Enter a valid email account, you will need it to validate your account','error');
            correctForm = false;
        }
        
        var clave = $('#clave');
        var claveval = clave.val().trim();
        if (!validatePassword(claveval) || claveval == '') {
            myAlert('Password rules: Letters with 1 number, no spaces and 6 total chars.','error');
            correctForm = false;
        }
        
        var repiteclave = $('#repiteclave');
        var repiteclaveval = repiteclave.val().trim();
        if (!validatePassword(repiteclaveval) || repiteclaveval == '') {
            myAlert('Password rules: Letters with 1 number, no spaces and 6 total chars.','error');
            correctForm = false;
        }
        if (repiteclaveval !== claveval) {
            myAlert('The passwords are not the same','error');
            correctForm = false;
        }
        
        if (!correctForm) {
            event.preventDefault();
        }
        
    }
    
})();