$(document).ready(() =>{
    console.log($('#profilePicture'));
    $('#userSettingsForm').validate({
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
                required:false,
            },
            twitter:{
                url:true
            },
            facebook:{
                url:true,
            },
            instagram:{
                url:true,
            },
            linkedin:{
                url:true,
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
            let uploadedProfileImage = $('#uploadProfile')[0].files[0]
            let profile_picture = uploadedProfileImage.name
            // let fd = new FormData()
            // fd.append('file',uploadedProfileImage)
            // console.log(fd)
            $.ajax({
                
                type:form.method,
                url:'/user/settings/',
                mimeType:'multipart/form-data',
                data:{
                    csrfmiddlewaretoken:getCookie('csrftoken'),
                    profile_picture:profile_picture,
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


                    // updating overview profile content
                    $('#overviewFullNameMain').html(response.full_name)
                    $('#overviewJobTitleMain').html(response.job_title)
                    $('#overviewFullName').html(response.full_name)
                    $('#overviewPhoneNumber').html(response.phone_number)
                    $('#overviewEmailAddress').html(response.email)

                    if(response.about == ''){
                        $('#overviewAbout').html('No details provided.')
                    }else{
                        $('#overviewAbout').html(response.about)
                    }

                    if(response.company == ''){
                        $('#overviewCompanyName').html('Company details not provided.')
                    }else{
                        $('#overviewCompanyName').html(response.company)
                    }

                    if(response.job_title == ''){
                        $('#overviewJobTitle').html('No details provided.')
                    }else{
                        $('#overviewJobTitle').html(response.job_title)
                    }

                    if(response.country == ''){
                        $('#overviewCountryName').html('No details provided.')
                    }else{
                        $('#overviewCountryName').html(response.country)
                    }

                    if(response.address == ''){
                        $('#overviewAddress').html('No details provided.')
                    }else{
                        $('#overviewAddress').html(response.address)
                    }

                    //updating edit profile page content
                    $('#fullName').val(response.full_name)
                    $('#about').val(response.about)

                },
            })
            
            return false
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

