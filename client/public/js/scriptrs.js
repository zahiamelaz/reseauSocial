/* index.html page1 */
$(document).ready(function(){
    valide=true;
    $('#submit').click(function(){
        if($('#username').val()== ""){
            $('#username').css('border-color','red');
            $('.error').css('color','red');
            $('#username').next('.error').fadeIn('fast').text('Champ obligatoire');
            valide= false;
        }
        if($('#email').val()== ""){
         $('#email').css('border-color','red');
         $('#email').next('.error').fadeIn('fast').text('Champ obligatoire');
         valide= false;
        }
        if($('#email2').val()== ""){
            $('#email2').css('border-color','red');
            $('#email2').next('.error2').fadeIn('fast').text('Champ obligatoire');
            valide= false;
           }
        if($('#password').val()== ""){
            $('#password').css('border-color','red');
            $('#password').next('.error').fadeIn('fast').text('Champ obligatoire');
            valide= false;
           }
           if($('#password2').val()== ""){
            $('#password2').css('border-color','red');
            $('#password2').next('.error2').fadeIn('fast').text('Champ obligatoire');
            valide= false;
           }
           return valide;
    });   
    $('.inputreg').keyup(function(){

       if(!$('#username').val().match(/^(?=.*?[A-Z])(?=.*?[a-z]).{4,15}$/)){
            $('#username').css('border-color','red');
            $('.error').css('color','red');
            $('#username').next('.error').fadeIn('fast').text('Doit contenir que des lettres en majuscule ,en miniscule et 4 à 15 caracteres');
            valide= false;  
            }
            else{
            $('#username').css('border-color','green');
            $('#username').next('.error').fadeOut();
            valide= true;
            }
            
      if(!$('#email').val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            $('#email').css('border-color','red');
            $('.error').css('color','red');
            $('#email').next('.error').fadeIn('fast').text('L\'email doit contenir un @ et un point');
            valide= false;  
        }else{
        $('#email').css('border-color','green');
        $('#email').next('.error').fadeOut();
        valide= true;
        }
    
       if(!$('#password').val().match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,15}$/)){
            $('#password').css('border-color','red');
            $('.error').css('color','red');
            $('#password').next('.error').fadeIn('fast').text('doit contenir au moins 1miniscule, 1majuscule, 1chiffre et 4 à 15 caracteres');
            valide= false;  
        }else{
        $('#password').css('border-color','green');
        $('#password').next('.error').fadeOut();
        valide= true;
        }
   
        return valide ;
    });
    $('.inputlog').keyup(function(){

         if(!$('#email2').val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
             $('#email2').css('border-color','red');
             $('.error2').css('color','red');
             $('#email2').next('.error2').fadeIn('fast').text('L\'email doit contenir un @ et un point');
             valide= false;  
         }else{
         $('#email2').css('border-color','green');
         $('#email2').next('.error2').fadeOut();
         valide= true;
         }
         if(!$('#password2').val().match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{4,15}$/)){
             $('#password2').css('border-color','red');
             $('.error2').css('color','red');
             $('#password2').next('.error2').fadeIn('fast').text('doit contenir au moins 1miniscule,1majuscule,1chiffre et 4 à 15 caracteres');
             valide= false;  
         }else{
         $('#password2').css('border-color','green');
         $('#password2').next('.error2').fadeOut();
         valide= true;
         }
         return valide ;
    });
    });

