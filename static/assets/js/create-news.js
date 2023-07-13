$(document).ready(() => {
    $('#addNewsForm').validate({
        rules:{
           newsTitle:{
            required:true
           },
           newsImage:{
            required:true,
            accept:'image/*'
           },
           newsDescription:{
            required:true
           },
           newsCategory:{
            required:true
           } 
        },
        errorElement: "div",
        highlight: function(element) {
            console.log(element)
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            if($(element).attr('file')){
                $('#file-error').hide()
            }
            $(element).removeClass('is-invalid')
        },
        errorPlacement : function(error,element){
            if(element.attr('name') == 'newsImage'){
                if(element.val() == ''){
                    error.addClass('text-danger')
                }else{
                    error.remove()
                }
            }
            error.addClass(' text-danger')
            error.insertBefore(element)
        },
    })
})