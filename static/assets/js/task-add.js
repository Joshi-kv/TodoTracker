$(document).ready(() =>{
    $('#taskForm').validate({
        rules:{
            title:{
                required:true,
            },
            description:{
                required:true,
            },
            duedate:{
                required:true,
            },
            status:{
                required:true,
            },
            priority:{
                required:true,
            }
        },
        errorElement: "div",
        // errorClass: "invalid-feedback",
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

    //submiting form 
    $('#taskForm').on('submit',(e) =>{
        e.preventDefault()
        let formData = new FormData()
        formData.append('csrfmiddlewaretoken',csrftoken)
        formData.append('task_title',$('input[name="title"]').val())
        formData.append('task_description',$('textarea[name="description"]').val())
        formData.append('task_duedate',$('input[name="duedate"]').val())
        formData.append('task_status',$('select[name="status"]').val())
        formData.append('task_priority',$('select[name="priority"]').val())
        $.ajax({
            type:'post',
            url:'/create-task/',
            dataType:'json',
            contentType:false,
            processData:false,
            beforSend:function(xhr){
                xhr.setRequestHeader('X-CSRFToken',csrftoken)
            },
            data:formData,
            success:function(response){
                let task = response.task
                let table = $('#taskTable').DataTable()
                table.row.add([
                    `${task.task_title}`,
                    `${task.task_description}`,
                    `${task.task_duedate}`,
                    `${task.task_priority}`,
                    `${task.task_status}`,
                    `
                    <button class="btn btn-danger" id="editBtn" data-edit="${task.task_id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-primary my-1" id="deleteBtn" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                    `
                  ]).draw()
            }

        })
        $('#basicModal').modal('toggle')
        $('#taskForm')[0].reset()
    })

})