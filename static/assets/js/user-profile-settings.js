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
        
        let formData = new FormData()
        if(file){
            formData.append('profile_picture',file)
        }else{
            formData.append('profile_picture',$('#profilePicture').attr('src'))
        }
        formData.append('csrfmiddlewaretoken',csrftoken)
        formData.append('full_name',$('input[name ="fullName"]').val().trim())
        formData.append('about',$('textarea[name ="about"]').val().trim())
        formData.append('country',$('input[name ="country"]').val().trim())
        formData.append('job_title',$('input[name ="job"]').val().trim())
        formData.append('company_name',$('input[name ="company"]').val().trim())
        formData.append('email',$('input[name ="email"]').val().trim())
        formData.append('phone_number',$('input[name ="phone_number"]').val().trim())
        formData.append('address',$('input[name ="address"]').val().trim())
        formData.append('twitter_link',$('input[name ="twitter"]').val().trim())
        formData.append('facebook_link',$('input[name ="facebook"]').val().trim())
        formData.append('instagram_link',$('input[name ="instagram"]').val().trim())
        formData.append('linkedin_link',$('input[name ="linkedin"]').val().trim())

        $.ajax({
            type:'post',
            url:'/user/settings/',
            headers:{'X-CSRFToken':csrftoken},
            dataType:'json',
            mimeType:'multipart/form-data',
            contentType:false,
            processData:false,
            beforeSend:function(xhr){
                xhr.setRequestHeader('X-CSRFToken',csrftoken)
            },
            data:formData,

            success:function(response){

                //header avatar changing
                $('#userAvatar').attr('src',response.profile_picture)
                
                // updating overview profile content
                $('#twitter').attr('href',response.twitter_link)
                $('#facebook').attr('href',response.facebook_link)
                $('#instagram').attr('href',response.instagram_link)
                $('#linkedin').attr('href',response.linkedin_link)
                $('#overviewProfileImage').attr('src',response.profile_picture)
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
                alertify.set('notifier','position','top-right')
                alertify.success('Profile settings updated.')
            },
        })
    })


})
