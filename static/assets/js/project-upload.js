$('#projectUploadForm').validate({
    rules:{
        project_file:{
            required:true,
        },
    },
    errorElement: "div",
    errorClass: "invalid-feedback",
    highlight: function(element) {
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
let changedFile;

$('#projectFile').on('change', function(e){
    changedFile = e.target.files[0]
    console.log(changedFile)
})

$('#projectUploadForm').on('submit', function(e){
    e.preventDefault()
    let formData = new FormData()
    formData.append('csrfmiddlewaretoken', csrftoken)
    formData.append('project_file', changedFile)
    
    $.ajax({
        type: 'POST',
        url: `/check-duplicates/`,
        dataType: 'json',
        mimeType:'multipart/form-data',
        contentType:false,
        processData:false,
        beforeSend:function(xhr){
            xhr.setRequestHeader('X-CSRFToken',csrftoken)
        },
        data: formData,
        success:function(response){
            console.log(response)
            if(response.status == 'duplicates'){
                const confirmModal = new bootstrap.Modal($('#confirmModal'))
                const confirmMessage = ` <b>${response.duplicates.length}</b> entries in the file already exists.Do you want to continue?` 
                $('#confirmMessage').html(confirmMessage)
                $('#projectFile').val('')
                $('#uploadProjectModal').modal('toggle')
                confirmModal.show()
                $('#confirmUpload').click(function () {
                    confirmModal.hide();
                    uploadProjectData(formData);
                });           
            }else{
                uploadProjectData(formData);
                $('#uploadProjectModal').modal('toggle')
                $('#projectUploadForm')[0].reset()
            }
        }
    })

})

function uploadProjectData(formData){
    console.log('uploadProjectData')

    $.ajax({
        type: 'POST',
        url: `/upload-project/`,  
        data: formData,
        dataType: 'json',
        mimeType: 'multipart/form-data',
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        },
        success:function(response){
            console.log(response)
            if(response.status == 'success'){
                sessionStorage.setItem('message','Project file uploaded successfully')
                window.location = window.location.href
                
            }
        },
    })
    
}

$(document).ready(function() {
    let message = sessionStorage.getItem('message')
    if(message){
        $('#successMessage').html(
            `<i class="fa-solid fa-circle-check text-success "></i><br>
            ${message}`
        )
        $('#successMessageModal').modal('show');
        sessionStorage.removeItem('message')   
    }
})

