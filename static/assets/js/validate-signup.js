$(document).ready(()=>{
    $('#signup-form').validate({
        rules:{
            name:{
                required:true
            },
            email:{
                required:true,
                checkEmail:true,
                remote:{
                    url:'/user/check-email/',
                    type:'get',
                    dataType:'json',
                    dataFilter:function(data){
                        let response = JSON.parse(data)
                        if(response.is_available === false){
                            return false
                        }else{
                            return true
                        }
                    }
                }
            },
            username:{
                required:true,
                remote:{
                    url:'/user/check-username/',
                    type:'get',
                    dataType:'json',
                    dataFilter:function(data){
                        let response = JSON.parse(data)
                        if(response.is_available === false){
                            return false
                        }else{
                            return true
                        }
                    }
                }
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
                required:'Please enter your email address!',
                remote:'Entered email already registered!'
            },
            username:{
                required:'Please enter your username!',
                remote:'Entered username is already registered!'
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
        submitHandler:function(form){
            $.ajax({
                type:form.method,
                url:'/user/register/',
                data:{
                    csrfmiddlewaretoken:getCookie('csrftoken'),
                    name:$('#yourName').val().trim(),
                    username:$('#yourUsername').val().trim(),
                    email:$('#yourEmail').val().trim(),
                    password:$('#yourPassword').val().trim()
                },
                success:function(response){
                    if(response.success === true){
                        window.location.href = '/user/login/'
                    }else{
                        window.location.href = '/user/register/'
                        $('#signupError').html(`${response.error}`)
                    }
                }
            })
            //form.submit()
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