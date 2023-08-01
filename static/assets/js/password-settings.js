$(document).ready(() =>{
    
    // validation for change password
    $('#passwordChangeForm').validate({
       rules:{
        current_password:{
            required:true,
        },
        new_password:{
            required:true,
            passwordCheck:true,
        },
        renew_password:{
            required:true,
            equalTo:'#newPassword',
        }
       },
       messages:{
        current_password:{
            required:'Please enter your old password!'
        },
        new_password:{
            required:'Please enter your new password!'
        },
        renew_password:{
            required:'Please retype your new password!',
            equalTo:'Password do not match!'
        }
       },
       submitHandler:function(form){
        //ajax request to change password
        $.ajax({
            type:form.method,
            url:'/user/change-password/',
            dataType:'json',
            data:{
                csrfmiddlewaretoken:getCookie('csrftoken'),
                old_password:$('#oldPassword').val().trim(),
                new_password:$('#newPassword').val().trim()
            },
            success:function(response){
                if(response.success == false){
                    $('#passwordError').html('Entered password is invalid!')
                }else{
                    alertify.set('notifier','position','top-right')
                    alertify.success('Password changed successfully')
                }
            }
        })
        form.reset()
        return false
       },
       errorElement: "div",
       errorClass: "invalid-feedback",
       highlight: function(element) {
           $(element).addClass("is-invalid").removeClass("is-valid");
       },
       unhighlight: function(element) {
           if($(element).attr('name')=='email'){
               $(element).addClass('is-valid').removeClass('is-invalid')
           }else{
               $(element).removeClass('is-invalid')
           }
       },
       errorPlacement : function(error,element){
           error.addClass(' text-danger')
           error.insertBefore(element)
       }, 
    })

    //validator for password
    $.validator.addMethod('passwordCheck',function(value){
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}|[\]\\:;'<>,./?]).{8,}$/.test(value)
    },
    
    `
    The password should meet some minimum requirements.<br>
    <ul class="password-requirements">
    <li>The password must contain minimum 8 characters</li>
    <li>The password must contain at least one uppercase letter </li>
    <li>The password must contain at least one lowercase letter</li>
    <li>The password must contain at least one digit</li>
    <li>The password must contain at least one special character</li>
    </ul>
    `
    )


    // fetching csrf token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
})