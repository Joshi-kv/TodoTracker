let table;
let taskLength; 
$(document).ready(() =>{
    let pathname = window.location.href.replace(/\/+$/, '');
    let task_id = pathname.substring(pathname.lastIndexOf('/') +1 )


    // fetching tasks on page load
    const url = `http://127.0.0.1:8000/task/sub-task-list/${task_id}/`
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        $.fn.dataTable.moment( "DD/MM/YYYY" )
        table = $('#subTaskTable').DataTable({
            "ordering":false,
            'info':false,
        })
        hidePagination(table,table.rows().count())
        data.sub_tasks.forEach((sub_task) =>{
            if(sub_task.is_staff === true){
                let subTaskId = sub_task.task_id
                let subTaskRow = table.row.add([
                    `${sub_task.sub_task_title}`,
                    `${sub_task.sub_task_priority}`,
                    `${sub_task.sub_task_status}`,
                ]).node()
                $(subTaskRow).attr('data-sub-task-id',subTaskId)
                table = $('#subTaskTable').DataTable();
                table.draw()
                taskLength = data.sub_tasks.length
                hidePagination(table,taskLength)
            }else{
                let subTaskId = sub_task.sub_task_id
                let subTaskRow = table.row.add([
                    `${sub_task.sub_task_title}`,
                    `${sub_task.sub_task_priority}`,
                    `${sub_task.sub_task_status}`,
                    `
                    <div class="d-flex">
                        <div class="mx-3">
                            <button class="btn btn-danger btn-sm" id="editSubTaskBtn" data-bs-target="#updateSubTaskModal" data-bs-toggle="modal" data-sub-task-edit="${sub_task.sub_task_id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-primary btn-sm " id="deleteSubTaskBtn" data-bs-target="#deleteSubTaskModal" data-bs-toggle="modal" data-sub-task-delete="${sub_task.sub_task_id}"><i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    `
                ]).node()
                $(subTaskRow).attr('data-sub-task-id',subTaskId)
                table = $('#subTaskTable').DataTable();
                table.draw()
                taskLength = data.sub_tasks.length
                hidePagination(table,taskLength)
            }

            //custom filtering
            $('select[name="filterSubTaskStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(2).search(status).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(status == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterSubTaskPriority"]').on('change',function(){
                let priority = $(this).val()
                table.column(1).search(priority).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(priority == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })            

        })
    
        //dynamically hiding pagination on search results
        table.on('search.dt',function(){
            hidePagination(table,table.rows({search:'applied'}).count())
        })
    })

})





//function to hide pagination dynamically 
function hidePagination(table,tasks){
    if(tasks > 10 ){
        $('#subTaskTable_length').show()
        $('.pagination').show()
    }else{
        $('#subTaskTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="subTaskTable_length"]').on('change',() =>{
        if(tasks > $('select[name="subTaskTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}

//function to clear filter
function clearFilters() {
    table.column(2).search('').draw() // Clear status filter
    table.column(1).search('').draw() // Clear priority filter
    table.draw() 
  }

//function to clear filter
$('#clearFilterBtn').on('click',function(){
    $('#filterSubTaskStatus').val('')
    $('#filterSubTaskPriority').val('')
    if(table.rows().count() > 10 ){
        $('#subTaskTable_length').show()
        $('.pagination').show()
    }else{
        $('#subTaskTable_length').hide()
        $('.pagination').hide()
    }
   clearFilters()
})

