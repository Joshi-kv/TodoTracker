$(document).ready(()=>{
    //validation for login form
    $('#loginForm').validate({
        rules:{
            email:{
                required:true,
                checkEmail:true,
            },
            password:{
                required:true,
            }
        },
        messages:{
            email:{
                required:'Please enter your email address!'
            },
            password:{
                required:'Please enter your password!'
            }
        },
        submitHandler:function(form){
            $.ajax({
                type:form.method,
                url:'/user/login/',
                data:{
                    csrfmiddlewaretoken:getCookie('csrftoken'),
                    email:$('#yourEmail').val().trim(),
                    password:$('#yourPassword').val().trim()
                },
                success:function(response){
                    if(response.success === false){
                        let loginErrorDiv = $('.login-error')
                        loginErrorDiv.html('Invalid username or password!')
                    }else{
                        window.location.href = '/'
                    }
                },

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

    //validator for email
    $.validator.addMethod('checkEmail',function(value){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    },
    `
    Please enter a valid email address!
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