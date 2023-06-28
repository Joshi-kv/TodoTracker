$(document).ready(() =>{
    // $('#uploadProfile').change((e)=>{
    //     console.log(e.target.files[0])
    // })
    $('#userSettingsForm').validate({
        onkeyup:false,
        rules:{
            email:{
                checkEmail:true,
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
            phone_number:{
                checkPhoneNumber:true,
            }
        },
        messages:{
            email:{
                checkEmail:'Please enter a valid email address!',
                remote:'Entered email address already registered!'
            },
            phone_number:{
                checkPhoneNumber:'Please enter valid 10 digits mobile number'

            }
        },
        submitHandler:function(form){
            // let uploadedProfileImage = $('#uploadProfile').files[0]
            // let reader = new FileReader()
            // let profile_picture = reader.readAsDataURL(uploadedProfileImage)

            $.ajax({
                type:form.method,
                url:'/user/settings/',
                data:{
                    csrfmiddlewaretoken:getCookie('csrftoken'),
                    // profile_image:profile_picture,
                    full_name : $('input[name ="fullName"]').val().trim(),
                    about : $('textarea[name ="about"]').val().trim(),
                    country: $('input[name ="country"]').val().trim(),
                    job_title : $('input[name ="job"]').val().trim(),
                    company_name : $('input[name ="company"]').val().trim(),
                    email : $('input[name ="email"]').val().trim(),
                    phone_number : $('input[name ="phone_number"]').val().trim(),
                    address : $('input[name ="address"]').val().trim(),
                    twitter_link : $('input[name ="twitter"]').val().trim(),
                    facebook_link : $('input[name ="facebook"]').val().trim(),
                    instagram_link : $('input[name ="instagram"]').val().trim(),
                    linkedin_link : $('input[name ="linkedin"]').val().trim(),

                },
                success:function(response){
                    console.log(response.full_name)
                }
            })

        },
        errorElement:'div',
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

    // validator for phone number
    $.validator.addMethod('checkPhoneNumber',function(value){
        return /^\d{10}$/.test(value)
    })


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