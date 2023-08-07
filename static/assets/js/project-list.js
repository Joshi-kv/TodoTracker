let table;
let taskLength;
$(document).ready(() =>{
    // fetching tasks on page load
    const url = 'http://127.0.0.1:8000/project-list/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        console.log(data)
        $.fn.dataTable.moment( "DD/MM/YYYY" )
        table = $('#projectTable').DataTable({
            "order":[3,'asc'],//sorting data based on ascending order order of date and month
            "columnDefs": [{
                "targets": [0,1,2,5,6,9], 
                "orderable": false 
            }, {
                "targets":[3], 
                "orderable": true 
            }]
        })
        hideProjectTablePagination(table,table.rows().count())
        data.projects.forEach((project) =>{
            let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
            let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
            let projectId = project.project_id
            let projectRow = table.row.add([
                `${project.project_title}`,
                `${project.project_description}`,
                `${project.project_assignee}`,
                `${convertedStartdate}`,
                `${convertedEnddate}`,
                `${project.duration}`,
                `${project.estimated_hours}`,
                `${project.project_type}`,
                `${project.project_status}`,
                `
                <button class="btn btn-primary btn-sm"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button><br><br>
                <button class="btn btn-info btn-sm"><a href="/todo/"><i class="fas fa-list"></i></a></button>
                <button class="btn btn-danger btn-sm"><i class="fas fa-circle-xmark"></i></button>
                `
            ]).node()
            $(projectRow).attr('data-task-id',projectId)
            table.draw()
            projectLength = data.projects.length
            hideProjectTablePagination(table,projectLength)

        //     // //custom filtering
        //     // $('select[name="filterStatus"]').on('change',function(){
        //     //     let status = $(this).val()
        //     //     table.column(4).search(status).draw()
        //     //     hidePagination(table,table.rows({search:'applied'}).count())
        //     //     if(status == ''){
        //     //         hidePagination(table,table.rows({search:'applied'}).count())
        //     //     }
        //     // })
        //     // $('select[name="filterPriority"]').on('change',function(){
        //     //     let priority = $(this).val()
        //     //     table.column(3).search(priority).draw()
        //     //     hidePagination(table,table.rows({search:'applied'}).count())
        //     //     if(priority == ''){
        //     //         hidePagination(table,table.rows({search:'applied'}).count())
        //     //     }
        //     // })            


        //     // //filter date range
        //     // $('#dateSearch').off().on('click',function(){
        //     //     $.ajax({
        //     //         url:'/date-range-filter',
        //     //         type:'get',
        //     //         dataType:'json',
        //     //         data:{
        //     //             start_date:$('#startDate').val(),
        //     //             end_date:$('#endDate').val(),
        //     //         },
        //     //         success:function(response){
        //     //             if(response.tasks.length > 0){
        //     //                 let date = []
        //     //                 response.tasks.forEach((task) => {
        //     //                     table = $('#taskTable').DataTable()                        
        //     //                     let convertedDueDate = moment(task.task_duedate).format('DD/MM/YYYY')
        //     //                     date.push('(?=.*' + convertedDueDate + ')');
        //     //                 })
        //     //                 table.column(2).search(date.join('|'),true,false,true).draw()
        //     //                 if(date){
        //     //                     hidePagination(table,table.rows({search:'applied'}).count())
        //     //                 }else{
        //     //                     hidePagination(table,table.rows({search:'applied'}).count())
        //     //                 }
        //     //                 $('#no-data').hide()
        //     //                 $('tbody').show()
        //     //             }else{
        //     //                 $('#no-data').show()
        //     //                 $('tbody').hide()
        //     //                 table = $('#taskTable').DataTable()  
        //     //                 table.column(2).search('').draw()
        //     //             }
        //     //         }
        //     //     })
        //     // })

        })
    
        // //dynamically hiding pagination on search results
        // table.on('search.dt',function(){
        //     hidePagination(table,table.rows({search:'applied'}).count())
        // })
    })

})





//function to hide pagination dynamically 
function hideProjectTablePagination(table,tasks){
    if(tasks > 10 ){
        $('#projectTable_length').show()
        $('.pagination').show()
    }else{
        $('#projectTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="projectTable_length"]').on('change',() =>{
        if(tasks > $('select[name="projectTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}

// //function to clear filter
// function clearFilters() {
//     table.column(4).search('').draw() // Clear status filter
//     table.column(3).search('').draw() // Clear priority filter
//     table.column(2).search('').draw() // Clear date filter
//     table.draw() 
//   }

// //function to clear filter
// $('#clearFilterBtn').on('click',function(){
//     $('#filterStatus').val('')
//     $('#filterPriority').val('')
//     $('#startDate').val('')
//     $('#endDate').val('')
//     $('#no-data').hide()
//     $('tbody').show()
//     if(table.rows().count() > 10 ){
//         $('#taskTable_length').show()
//         $('.pagination').show()
//     }else{
//         $('#taskTable_length').hide()
//         $('.pagination').hide()
//     }
//    clearFilters()
// })

