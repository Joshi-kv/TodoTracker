$(document).ready(() =>{
    $('#feedbackForm').validate({
        rules:{
            feedbackUserName:{
                required:true
            },
            feedbackUserEmail:{
                required:true,
                checkEmail:true,
            },
            feedbackSubject:{
                required:true,
            },
            feedbackMessage:{
                required:true,
            }
        },
        messages:{
            feedbackUserName:{
                required:'Please enter your name'
            },
            feedbackUserEmail:{
                required:'Please enter your email address',
                checkEmail:'Please enter a valid email address'
            },
            feedbackSubject:{
                required:'Please enter the subject'
            },
            feedbackMessage:{
                required:'Please enter the message'
            }
        },
        errorElement:'div',
        errorClass:'invalid-feedback',
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

    //feedback form submitting
    $('#feedbackForm').on('submit',(e) => {
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/feedback-submission/',
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                feedback_username:$('input[name="feedbackUserName"]').val(),
                feedback_useremail:$('input[name="feedbackUserEmail"]').val(),
                feedback_subject:$('input[name="feedbackSubject"]').val(),
                feedback_message:$('textarea[name="feedbackMessage"]').val()
            },
            beforeSend:function(){
                $('.loading').show()
            },
            // success:function(response){
            //     if(response){
            //         alertify.set('notifier','position','top-right')
            //         alertify.success('Thank you for the feedback. Will contact you soon ')
            //     }
            // },
            complete:function(response){
                alertify.set('notifier','position','top-right')
                alertify.success('Thank you for the feedback. Will contact you soon ')
                $('.loading').hide()
                $('#feedbackForm')[0].reset()
            }

        })

    })
})