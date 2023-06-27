$(document).ready(function(){
    let uploadBtn = $('#uploadBtn')
    uploadBtn.click(function(){
        $('#uploadProfile').trigger('click')
    })
    $('#uploadProfile').change(function(){
        let val = $(this).val()
        console.log($('#profilePicture').attr('src'))
    })
})