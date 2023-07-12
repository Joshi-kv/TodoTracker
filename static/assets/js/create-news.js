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
            $(element).removeClass('is-invalid')
        },
        errorPlacement : function(error,element){
            error.addClass(' text-danger')
            error.insertBefore(element)
        },
    })
})