$(document).ready(() =>{
    //function to load selected task details
    $(document).on('click','#editBtn',function(){
        let taskId = $(this).attr('data-edit')
        $.ajax({
            type:'get',
            url:'/update-task/',
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


    //update form submission
    $('#updateTaskForm').on('submit',(e)=>{
        e.preventDefault()
        let taskId = $('#editBtn').attr('data-edit')
        $.ajax({
            type:'post',
            url:'/update-task/',
            dataType:'json',
            data:{
                'task_id':taskId,
                'task_title':$('input[name="updateTitle"]').val(),
                'task_description':$('textarea[name="updateDescription"]').val(),
                'task_duedate':$('input[name="updateDuedate"]').val(),
                'task_priority':$('select[name="updatePriority"]').val(),
                'task_status':$('select[name="updateStatus"]').val(),
            },
            success:function(response){
                console.log(response)
            },
        })
    })
})