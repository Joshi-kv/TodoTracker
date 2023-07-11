$(document).ready(() =>{
    // fetching tasks on page load
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
                <button class="btn btn-primary my-1" id="deleteBtn" data-bs-target="#deleteModal" data-bs-toggle="modal" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                `
            ]).draw()
            if(data.tasks.length <= $('select[name="taskTable_length"]').val() ){
                $('.pagination').hide()
            }else{
                $('.pagination').show()
            }
            
            // $('#taskTable').on('change',(e) =>{
            //     console.log('change')
            // })

            // if(data.tasks.length <= 10){
            //     $('.dataTables_length').hide()
            // }else{
            //     $('.dataTables_length').show()
            // }
            // if(data.tasks.length <= $('select[name="taskTable_length"]').val() ){
            //     $('.pagination').hide()
            // }else{
            //     $('.pagination').show()
            // }
            $('select[name="taskTable_length"]').on('change',() =>{
                console.log($('select[name="taskTable_length').val())
                if(data.tasks.length <= $('select[name="taskTable_length"]').val() ){
                    $('.pagination').hide()
                }else{
                    $('.pagination').show()
                }
            })
            $('select[name="filterStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(4).search(status).draw()
            })
            $('select[name="filterPriority"]').on('change',function(){
                let priority = $(this).val()
                table.column(3).search(priority).draw()
            })
        })
    })
})