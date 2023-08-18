let table;
let taskLength; 
$(document).ready(() =>{
    let pathname = window.location.href
    let params = new URL(pathname).searchParams;
    let id = params.get('id');
    let filterOption = params.get('filter');
    let url;
    if(id){
        url = `http://127.0.0.1:8000/tasks-list/?id=${id}`
    }else{
        url = `http://127.0.0.1:8000/tasks-list/`
    }

    // fetching tasks on page load
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        console.log(data)
        // $.fn.dataTable.moment( "DD/MM/YYYY" )
        table = $('#taskTable').DataTable({
           
            "order":[3,'asc'],//sorting data based on ascending order order of date and month
            "columnDefs": [{
                "targets": [0,1,2,4,5,6], 
                "orderable": false 
            }, {
                "targets": 3, 
                "orderable": true 
            },{
                "targets":2,
                "visible":false
            }
        ]
           
        })
        hidePagination(table,table.rows().count())
        data.tasks.forEach((task) =>{
            let convertedTaskDuedate = moment(task.task_duedate).format('DD/MM/YYYY')
                let taskId = task.task_id
                let taskRow = table.row.add([
                    `${task.task_title}`,
                    `${task.task_description}`,
                    `${task.assignee}`,
                    `${convertedTaskDuedate}`,
                    `${task.task_priority}`,
                    `${task.task_status}`,
                    `
                    <div class="d-flex justify-content-center">
                        <div >
                            <button class="btn btn-primary btn-sm" id="editBtn" data-bs-target="#updateModal" data-bs-toggle="modal" data-edit="${task.task_id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm " id="deleteBtn" data-bs-target="#deleteModal" data-bs-toggle="modal" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                            <button class="btn btn-info btn-sm  text-white">
                            <a class="text-white" href="/project/task-detail/${taskId}/"><i class="fas fa-eye"></i></a>
                            </button>
                        </div>
                    </div>
                    `
                ]).node()
                $(taskRow).attr('data-task-id',taskId)
                table = $('#taskTable').DataTable();
                table.draw()
                taskLength = data.tasks.length
                hidePagination(table,taskLength)

                if(filterOption){
               
                    if(filterOption == 'totaltasks'){
                     $('select[name="filterStatus"]').val('').change()
                         table.column(5).search('').draw()
                         hidePagination(table,table.rows({search:'applied'}).count())
                    }else{
                     $('select[name="filterStatus"]').val(filterOption).change()
                     table.column(5).search(filterOption).draw()
                     hidePagination(table,table.rows({search:'applied'}).count()) 
                    }
                 }else{
                     $('select[name="filterStatus"]').val('Pending').change()
                     table.column(5).search('Pending').draw()
                     hidePagination(table,table.rows({search:'applied'}).count())
                 }
            
            //custom filtering
            $('select[name="filterAssignee"]').on('change',function(){
                let assignee = $(this).val()
                table.column(2).search(assignee).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(assignee == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(5).search(status).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(status == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterPriority"]').on('change',function(){
                let priority = $(this).val()
                table.column(4).search(priority).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(priority == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })            


            //filter date range
            $('#dateSearch').off().on('click',function(){
                $.ajax({
                    url:'/date-range-filter',
                    type:'get',
                    dataType:'json',
                    data:{
                        project_id:project_id,
                        start_date:$('#startDate').val(),
                        end_date:$('#endDate').val(),
                    },
                    success:function(response){
                        if(response.tasks.length > 0){
                            let date = []
                            response.tasks.forEach((task) => {
                                table = $('#taskTable').DataTable()                        
                                let convertedDueDate = moment(task.task_duedate).format('DD/MM/YYYY')
                                date.push('(?=.*' + convertedDueDate + ')');
                            })
                            table.column(3).search(date.join('|'),true,false,true).draw()
                            if(date){
                                hidePagination(table,table.rows({search:'applied'}).count())
                            }else{
                                hidePagination(table,table.rows({search:'applied'}).count())
                            }
                            $('#no-data').hide()
                            $('tbody').show()
                        }else{
                            alertify.set('notifier', 'position', 'top-right');
                            alertify.error('No projects created under this date range');
                        }
                    }
                })
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
        $('#taskTable_length').show()
        $('.pagination').show()
    }else{
        $('#taskTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="taskTable_length"]').on('change',() =>{
        if(tasks > $('select[name="taskTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}

//function to clear filter
function clearFilters() {
    table.column(4).search('').draw() // Clear status filter
    table.column(5).search('').draw() // Clear priority filter
    table.column(3).search('').draw() // Clear assignee filter
    table.column(2).search('').draw() // Clear date filter
    table.draw() 
  }

//function to clear filter
$('#clearFilterBtn').on('click',function(){
    $('#filterStatus').val('')
    $('#filterPriority').val('')
    $('#filterAssignee').val('')
    $('#startDate').val('')
    $('#endDate').val('')
    $('#no-data').hide()
    $('tbody').show()
    if(table.rows().count() > 10 ){
        $('#taskTable_length').show()
        $('.pagination').show()
    }else{
        $('#taskTable_length').hide()
        $('.pagination').hide()
    }
   clearFilters()
})

