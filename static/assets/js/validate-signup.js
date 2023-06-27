$(document).ready(()=>{
    $('#signup-form').validate({
        rules:{
            name:{
                required:true
            },
            email:{
                required:true,
                checkEmail:true,
            },
            username:{
                required:true
            },
            password:{
                required:true,
                passwordCheck:true,
            },
            confirm_password:{
                required:true,
                equalTo:'#yourPassword'
            },
            terms:{
                required:true
            }

            
        },
        messages:{
            name:{
                required:'Please enter your name!'
            },
            email:{
                required:'Please enter your email address!'
            },
            username:{
                required:'Please enter your username!'
            },
            password:{
                required:'Please enter your password!'
            },
            confirm_password:{
                required:'Please confirm your password!',
                equalTo:'Password do not match!'
            },
            terms:{
                required:'Please agree terms to proceed'
            }
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

    //validator for email
    $.validator.addMethod('checkEmail',function(value){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    `
    Please enter a valid email address!
    `
    )

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
})