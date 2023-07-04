$(document).ready(() =>{

    $('#userSettingsForm').validate({
        rules:{
            phone_number:{
                required:false,
                digits:true,
                minlength:10,
                maxlength:10,
            },
            twitter:{
                url:true,
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
            phone_number:{
                digits:'Please enter 10 digits valid phone number',
                maxlength:'Please enter 10 digits valid phone number',
                minlength:'Please enter 10 digits valid phone number',
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


    // fetching csrf token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken')


    $('#userSettingsForm').on('submit',(e) =>{
        e.preventDefault()

        let file = $('#uploadProfile')[0].files[0]
    
        $.ajax({
            type:'post',
            url:'/user/settings/',
            headers:{'X-CSRFToken':csrftoken},
            dataType:'json',
            mimeType:'multipart/form-data',
            data:{
                csrfmiddlewaretoken:csrftoken,
                // profile_picture:file,
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
    })


})
