let table;
let taskLength;
$(document).ready(() =>{




    // fetching tasks on page load
    const url = 'http://127.0.0.1:8000/tasks/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        $.fn.dataTable.moment( "DD/MM/YYYY" );
        table = $('#taskTable').DataTable({
            "order":[2,'asc'],
            "columnDefs": [{
                "targets": [0,1,5], 
                "orderable": false 
            }, {
                "targets": 2, 
                "orderable": true 
            }]
           
        })
        data.tasks.forEach((task) =>{
            let convertedTaskDuedate = moment(task.task_duedate).format('DD/MM/YYYY')
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

            //filter daterange
            $('#dateSearch').on('click',function(){
                $.ajax({
                    url:'/date-range-filter',
                    type:'get',
                    dataType:'json',
                    data:{
                        start_date:$('#startDate').val(),
                        end_date:$('#endDate').val(),
                    },
                    success:function(response){
                        let date = []
                        response.tasks.forEach((task) => {
                            table = $('#taskTable').DataTable()                        
                            let convertedDueDate = moment(task.task_duedate).format('DD/MM/YYYY')
                            date.push('(?=.*' + convertedDueDate + ')');
                        })
                        table.column(2).search(date.join('|'),true,false,true).draw()
                        if(date){
                            if(date.length > 10 ){
                                $('#taskTable_length').show()
                                $('.pagination').show()
                            }else{
                                $('#taskTable_length').hide()
                                $('.pagination').hide()
                            }
                        }else{
                            hidePagination(table,table.data().count())
                        }
                    }
                })
            })

        })
    })
})





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
    $('#startDate').val('')
    $('#endDate').val('')
    // hidePagination(table,table.rows().count())
    if(table.rows().count() > 10 ){
        $('#taskTable_length').show()
        $('.pagination').show()
    }else{
        $('#taskTable_length').hide()
        $('.pagination').hide()
    }
   clearFilters()
})

