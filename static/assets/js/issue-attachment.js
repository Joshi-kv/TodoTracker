
let issue_id = document.getElementById('issue').innerHTML
console.log(issue_id)
$(document).ready(() => {

    function issueAttachment (){
    const url = `http://127.0.0.1:8000/attach-issue-file/${issue_id}/`
    fetch(url)
    .then(response => response.json())
    .then((data) =>{
        if(data.status === 'success'){
            data.attachments.forEach((attachment) => {
                console.log(attachment.attachment_title)
                let attachmentContent 
                if(attachment.is_staff){
                    attachmentContent = 
                    `
                    <div id="issue-${attachment.attachment_id}">
                    <a href="${attachment.attachment}" target="_blank" title="${attachment.attachment_title}">
                        ${attachment.attachment_title} 
                    </a><span class="text-danger ms-5" data=${attachment.attachment_id} id="removeAttachmentBtn"><i class="fas fa-circle-xmark" title="remove" ></i></span><br>
                    </div>
                            
                    `
                }else{
                    attachmentContent = 
                    `
                    <div id="issue-${attachment.attachment_id}">
                    <a href="${attachment.attachment}" target="_blank" title="${attachment.attachment_title}">
                        ${attachment.attachment_title} 
                    </a><br>
                    </div>
                            
                    `
                }
                
                $('#issueAttachments').prepend(attachmentContent)
            })
        }
    })
    }

    issueAttachment()

    $('#issueAttachmentForm').validate({
        rules:{
            attachment_title:{
                required:true,
            },
            attachment_file:{
                required:true,
            }
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

    $('#issueAttachmentForm').on('submit', function(e){
        e.preventDefault()
        let file = $('#attachmentFile')[0].files[0]
        let attachment_title = $('#attachmentTitle').val()
        let formData = new FormData()
        formData.append('csrfmiddlewaretoken', csrftoken)
        formData.append('attachment_file', file)
        formData.append('attachment_title', attachment_title)
        if(file && attachment_title){
            $.ajax({
                type: 'POST',
                url: `/attach-issue-file/${issue_id}/`,
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
                   if(response.status === 'success'){
                    $('#issueAttachments').empty()
                    response.attachments.forEach((attachment) => {
                        let attachmentContent 
                        if(attachment.is_staff){
                            attachmentContent = 
                            `
                            <div id="issue-${attachment.attachment_id}">
                            <a href="${attachment.attachment}" target="_blank" title="${attachment.attachment_title}">
                                ${attachment.attachment_title} 
                            </a><span class="text-danger ms-5" data=${attachment.attachment_id} id="removeAttachmentBtn"><i class="fas fa-circle-xmark" title="remove" ></i></span><br>
                            </div>
                                    
                            `
                        }else{
                            attachmentContent = 
                            `
                            <div id="issue-${attachment.attachment_id}">
                            <a href="${attachment.attachment}" target="_blank" title="${attachment.attachment_title}">
                                ${attachment.attachment_title} 
                            </a><br>
                            </div>
                                    
                            `
                        }
                        $('#issueAttachments').prepend(attachmentContent)
                        
                    })
                }
            }
        })
        alertify.set('notifier','position','top-right')
        alertify.success('Attachment added successfully')
        $('#issueAttachmentModal').modal('toggle')
        $('#issueAttachmentForm')[0].reset()
        }

    })

    $(document).on('click','#removeAttachmentBtn',function(e) {
        let id = $(this).attr('data')

        $.ajax({
            type:'POST',
            url:`/remove-issue-attachment/${id}/`,
            dataType:'json',
            data:{csrfmiddlewaretoken:csrftoken},
            success:function(data) {
                if(data.status == 'success'){
                    $('#issueAttachments').empty()
                    issueAttachment()
                    alertify.set('notifier','position','top-right')
                    alertify.error('Attachment removed')
                }
            }
        })
    })
})