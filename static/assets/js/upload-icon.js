$(document).ready(function(){

    //function to display selected profile picture
    let uploadBtn = $('#uploadBtn')
    uploadBtn.click(function(){
        $('#uploadProfile').trigger('click')
    })
    $('#uploadProfile').change(function(e){
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e){
           $('#profilePicture').attr('src',reader.result)
        }
    })
})