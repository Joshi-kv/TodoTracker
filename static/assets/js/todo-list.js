let table;
let taskLength;
$(document).ready(() =>{
    listTable()
})

//function to list table
function listTable(){
    // fetching tasks on page load
    const url = 'http://127.0.0.1:8000/tasks/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        data.tasks.forEach((task) =>{
            table = $('#taskTable').DataTable();
            let convertedTaskDuedate = moment(task.task_duedate).format('DD/MM/yy')
            let taskId = task.task_id
            let taskRow = table.row.add([
                `${task.task_title}`,
                `${task.task_description}`,
                `${convertedTaskDuedate}`,
                `${task.task_priority}`,
                `${task.task_status}`,
                `
                <button class="btn btn-danger" id="editBtn" data-bs-target="#updateModal" data-bs-toggle="modal" data-edit="${task.task_id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-primary my-1" id="deleteBtn" data-bs-target="#deleteModal" data-bs-toggle="modal" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                `
            ]).node()
            $(taskRow).attr('data-task-id',taskId)
            table = $('#taskTable').DataTable();
            table.draw()
            taskLength = data.tasks
            hidePagination(table,data.tasks)

            //custom filtering
            $('select[name="filterStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(4).search(status).draw()
                hidePagination(table,table.data().count())
            })
            $('select[name="filterPriority"]').on('change',function(){
                let priority = $(this).val()
                table.column(3).search(priority).draw()
                hidePagination(table,table.data().count())
            })

            $('input[name="filterDate"]').on('change',function(){
                let date = $(this).val()
                convertedDate = moment(date).format('DD/MM/yy')
                table.column(2).search(convertedDate).draw()
                hidePagination(table,table.data().count())
            })

        })
        // table.on('search.dt',function(){
        //     hidePagination(table,table.data().count())
        // })

        // $('input[type="search"]').on('keyup',function(){
        //     hidePagination(table,table.data().count())
        // })
    })
}

//function to hide pagination dynamically 
function hidePagination(table,tasks){

    if(tasks.length > 10 ){
        $('#taskTable_length').show()
        $('.pagination').show()
    }else{
        $('#taskTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="taskTable_length"]').on('change',() =>{
        console.log($('select[name="taskTable_length').val())
        if(tasks.length > $('select[name="taskTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}

//function to clear filter
function clearFilters() {
    table.column(4).search('').draw(); // Clear status filter
    table.column(3).search('').draw(); // Clear priority filter
    table.column(2).search('').draw(); // Clear date filter
  }

$('#clearFilterBtn').on('click',function(){
    $('#filterStatus').val('')
    $('#filterPriority').val('')
    $('#filterDate').val('')
    hidePagination(table,taskLength)
   clearFilters()
})

