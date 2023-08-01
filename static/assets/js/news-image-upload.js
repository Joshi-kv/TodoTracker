$(document).ready(function(){

    //function to display selected file on news creation
    $('#file').change(function(e){
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e){
            $('#uploadIcon').hide()
           $('#newsImage').attr('src',reader.result)
        }
    })
})