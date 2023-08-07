$(document).ready(() =>{
        
    //task updation functions start
    //function to load selected task details
    $(document).on('click','#editBtn',function(){
        let taskId = $(this).attr('data-edit')
        let modalId = $('#updateProjectModal').attr('edit-modal',`${taskId}`)
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
                if(task.task_status == 'Pending'){
                    let optionValue = 'Pending'
                    $("#taskUpdateStatus").append(`<option id="pending" value="${optionValue}"></option>`)
                    $('#pending').text('Pending')
                    $('#taskUpdateStatus').val(optionValue)
                }else{
                    $('#taskUpdateStatus').val(task.task_status)
                }
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
        let title = $('input[name="updateTitle"]').val()
        let description = $('textarea[name="updateDescription"]').val()
        let duedate = $('input[name="updateDuedate"]').val()
        let priority = $('select[name="updatePriority"]').val()
        let status = $('select[name="updateStatus"]').val()
        if (title && description && duedate && priority && status){
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
                    if(response.status === 'updated'){
                        let updatedTask = response.task
                        let convertedTaskDuedate = moment(updatedTask.task_duedate).format('DD/MM/YYYY')
                        let table = $('#taskTable').DataTable();
                        const rowIndex = table.row(`tr[data-task-id="${updatedTask.task_id}"]`).index();

                        table.row(rowIndex).data([
                            updatedTask.task_title,
                            updatedTask.task_description,
                            convertedTaskDuedate,
                            updatedTask.task_priority,
                            updatedTask.task_status,
                            `
                            <button class="btn btn-danger" id="editBtn" data-bs-target="#updateModal" data-bs-toggle="modal" data-edit="${updatedTask.task_id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-primary my-1" id="deleteBtn" data-bs-target="#deleteModal" data-bs-toggle="modal" data-delete="${updatedTask.task_id}"><i class="fas fa-trash"></i></button>
                            `
                        ]).draw(false)
                    }
                    alertify.set('notifier','position','top-right')
                    alertify.warning('Task edited successfully')
                },
            })

            $('#updateModal').modal('toggle')
        }else{
            alertify.set('notifier','position','top-right')
            alertify.error('Please fill all the fields')
        }
    })

    //task update functions end 

    //task delete functions start
    $(document).on('click','#deleteProjectBtn',function(){
        let projectId = $(this).attr('data-delete-project')
        let deleteModalId = $('#deleteProjectModal').attr('delete-project',projectId)
    })
    $('#projectDeleteForm').on('submit',(e) => {
        e.preventDefault()
        let projectId = $('#deleteProjectModal').attr('delete-project')
        console.log(projectId)
        $.ajax({
            type:'post',
            url:'/delete-project/',
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                project_id:projectId
            },
            success:function(response){
                console.log(response)
                if(response.status === 'success'){
                    let total = response.total
                    
                    let table = $('#projectTable').DataTable()
                    let deletedRow = table.row(`tr[data-project-id=${projectId}]`).index()
                    table.row(deletedRow).remove().draw(false)
                    changeProjectTablePagination(table,total)
                    
                }
                alertify.set('notifier','position','top-right')
                alertify.error('Project deactivated!')
            },
        })
        $('#deleteProjectModal').modal('toggle')
    })


})

//function to hide pagination dynamically 
function changeProjectTablePagination(table,total){

        
    if(total > 10 ){
        $('#projectTable_length').show()
        $('.pagination').show()
    }else{
        $('#projectTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="projectTable_length"]').on('change',() =>{
        console.log($('select[name="projectTable_length').val())
        if(total > $('select[name="projectTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}