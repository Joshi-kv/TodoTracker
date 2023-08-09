let path = window.location.href.replace(/\/+$/, '');
let taskId = path.substring(path.lastIndexOf('/') +1 )

$(document).ready(() =>{
    //task updation functions start
    //function to load selected task details
    $(document).on('click','#editSubTaskBtn',function(){
        let subTaskId = $(this).attr('data-sub-task-edit')
        let modalId = $('#updateSubTaskModal').attr('sub-task-edit-modal',`${subTaskId}`)
        $.ajax({
            type:'get',
            url:`/task/update-sub-task-view/${taskId}`,
            dataType:'json',
            data:{'sub_task_id':subTaskId},
            success:function(response){
                let sub_task = response.sub_task
                $('#subTaskUpdateTitle').val(sub_task.sub_task_title)
                $('#updateSubTaskPriority').val(sub_task.sub_task_priority)
                $('#updateSubTaskStatus').val(sub_task.sub_task_status)
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
    $('#updateSubTaskForm').on('submit',(e)=>{
        e.preventDefault()
        let subTaskId = $('#updateSubTaskModal').attr('sub-task-edit-modal')
        let subTaskTitle = $('input[name="subTaskUpdateTitle"]').val()
        let subTaskPriority = $('select[name="updateSubTaskPriority"]').val()
        let subTaskStatus = $('select[name="updateSubTaskStatus"]').val()
        if (subTaskTitle && subTaskPriority && subTaskStatus){
            $.ajax({
                type:'post',
                url:`/task/update-sub-task/${taskId}/`,
                dataType:'json',
                data:{
                    'csrfmiddlewaretoken':csrftoken,
                    'sub_task_id':subTaskId,
                    'sub_task_title':$('input[name="subTaskUpdateTitle"]').val(),
                    'sub_task_priority':$('select[name="updateSubTaskPriority"]').val(),
                    'sub_task_status':$('select[name="updateSubTaskStatus"]').val(),
                },
                success:function(response){
                    if(response.status === 'success'){
                        let table = $('#subTaskTable').DataTable();
                        const rowIndex = table.row(`tr[data-sub-task-id="${response.sub_task.sub_task_id}"]`).index();

                        table.row(rowIndex).data([
                            `${response.sub_task.sub_task_title}`,
                            `${response.sub_task.sub_task_priority}`,
                            `${response.sub_task.sub_task_status}`,
                            `
                            <div class="d-flex">
                                <div class="mx-3">
                                    <button class="btn btn-danger btn-sm" id="editSubTaskBtn" data-bs-target="#updateSubTaskModal" data-bs-toggle="modal" data-sub-task-edit="${response.sub_task.sub_task_id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-primary btn-sm " id="deleteSubTaskBtn" data-bs-target="#deleteModal" data-bs-toggle="modal" data-sub-task-delete="${response.sub_task.sub_task_id}"><i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            `
                        ]).draw(false)
                    }
                    alertify.set('notifier','position','top-right')
                    alertify.warning('Task edited successfully')
                },
            })

            $('#updateSubTaskModal').modal('toggle')
        }else{
            alertify.set('notifier','position','top-right')
            alertify.error('Please fill all the fields')
        }
    })

    //task update functions end 

    //task delete functions start
    $(document).on('click','#deleteSubTaskBtn',function(){
        let subTaskId = $(this).attr('data-sub-task-delete')
        let deleteModalId = $('#deleteSubTaskModal').attr('sub-task-delete',subTaskId)
    })
    $('#deleteSubTaskModal').on('submit',(e) => {
        e.preventDefault()
        let subTaskId = $('#deleteSubTaskModal').attr('sub-task-delete')
        $.ajax({
            type:'post',
            url:`/task/delete-sub-task/${taskId}/`,
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                sub_task_id:subTaskId
            },
            success:function(response){
                if(response.status === 'success'){
                    let total = response.total_sub_tasks
                    
                    let table = $('#subTaskTable').DataTable()
                    let deletedRow = table.row(`tr[data-sub-task-id=${subTaskId}]`).index()
                    table.row(deletedRow).remove().draw(false)
                    changePagination(table,total)
                    
                }
                alertify.set('notifier','position','top-right')
                alertify.error('Task deactivated!')
            },
        })
        $('#deleteSubTaskModal').modal('toggle')
    })


})

//function to hide pagination dynamically 
function changePagination(table,total){

        
    if(total > 10 ){
        $('#subTaskTable_length').show()
        $('.pagination').show()
    }else{
        $('#subTaskTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="subTaskTable_length"]').on('change',() =>{
        console.log($('select[name="subTaskTable_length').val())
        if(total > $('select[name="subTaskTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}