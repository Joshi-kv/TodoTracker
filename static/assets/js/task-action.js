$(document).ready(() =>{
    //function to load selected task details
    $(document).on('click','#editBtn',function(){
        let taskId = $(this).attr('data-edit')
        let modalId = $('#updateModal').attr('edit-modal',`${taskId}`)
        $.ajax({
            type:'get',
            url:'/update-view/',
            dataType:'json',
            data:{'task_id':taskId},
            success:function(response){
                let task = response.task
                $('#taskUpdateTitle').val(task.task_title)
                $('#taskUpdateDescription').val(task.task_description)
                $('#taskUpdateDuedate').val(task.task_duedate)
                $('#taskUpdatePriority').val(task.task_priority)
                $('#taskUpdateStatus').val(task.task_status)
            }

        })
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

    //update form submission
    $('#updateTaskForm').on('submit',(e)=>{
        e.preventDefault()
        let taskId = $('#updateModal').attr('edit-modal')
        $.ajax({
            type:'post',
            url:'/update-task/',
            dataType:'json',
            data:{
                'csrfmiddlewaretoken':csrftoken,
                'task_id':taskId,
                'task_title':$('input[name="updateTitle"]').val(),
                'task_description':$('textarea[name="updateDescription"]').val(),
                'task_duedate':$('input[name="updateDuedate"]').val(),
                'task_priority':$('select[name="updatePriority"]').val(),
                'task_status':$('select[name="updateStatus"]').val(),
            },
            success:function(response){
                console.log(response)
                if(response.status === 'updated'){
                    let table = $('#taskTable').DataTable()
                    table.clear().draw()
                    const url = 'http://127.0.0.1:8000/tasks/'
                    fetch(url)
                    .then(response => response.json())
                    .then((data) => {
                        data.tasks.forEach((task) =>{
                            let table = $('#taskTable').DataTable()
                            table.row.add([
                                `${task.task_title}`,
                                `${task.task_description}`,
                                `${task.task_duedate}`,
                                `${task.task_priority}`,
                                `${task.task_status}`,
                                `
                                <button class="btn btn-danger" id="editBtn" data-bs-target="#updateModal" data-bs-toggle="modal" data-edit="${task.task_id}"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-primary my-1" id="deleteBtn" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                                `
                              ]).draw()
                              
                        })
                    })
                }
                alertify.set('notifier','position','top-right')
                alertify.success('Task edited successfully')
            },
        })
        $('#updateModal').modal('toggle')
    })
})