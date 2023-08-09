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
            if(project.is_staff === true) {
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
                    <div class="d-flex">
                        <div class="mx-3 ">
                        <button class="btn btn-primary btn-sm" id="projectEditBtn" data-bs-toggle="modal"  data-bs-target="#updateProjectModal" data-project-edit=${project.project_id}>
                        <i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm mt-2" id="deleteProjectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" data-delete-project=${project.project_id}>
                        <i class="fas fa-trash"></i></button>
                        </div>
                        <div class="mx-3">
                        <button class="btn btn-info btn-sm"><a class="text-white" href="/project/tasks/${projectId}"><i class="fas fa-list"></i></a></button>
                        <button class="btn btn-warning btn-sm mt-2"><a class="text-white" href="/project/lists/${projectId}"><i class="fas fa-circle-xmark"></i></a></button>
                        </div>
                    </div>
                    `
                ]).node()
                $(projectRow).attr('data-project-id',projectId)
                table.draw()
            }else{
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
                    <div class="d-flex">
                    <button class="btn btn-info btn-sm mx-2"><a class="text-white" href="/project/tasks/${projectId}"><i class="fas fa-list"></i></a></button>
                    <button class="btn btn-danger btn-sm"><a class="text-white" href="/project/lists/${projectId}"><i class="fas fa-circle-xmark"></i></a></button>
                    </div>
                    `
                ]).node()
                $(projectRow).attr('data-project-id',projectId)
                table.draw()
            }
            projectLength = data.projects.length
            hideProjectTablePagination(table,projectLength)

            //custom filtering
            $('select[name="filterProjectStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(8).search(status).draw()
                hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                if(status == ''){
                    hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterProjectType"]').on('change',function(){
                let type = $(this).val()
                table.column(7).search(type).draw()
                hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                if(type == ''){
                    hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                }
            })            
            $('select[name="filterAssignee"]').on('change',function(){
                let assignee = $(this).val()
                table.column(2).search(assignee).draw()
                hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                if(assignee == ''){
                    hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                }
            })            
            $('input[name="project_start_date"]').on('change',function(){
                let start_date = $(this).val()
                let convertedDate = moment(start_date).format('DD/MM/YYYY')
                table.column(3).search(convertedDate).draw()
                hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                if(start_date == ''){
                    hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                }
            })            
            $('input[name="project_end_date"]').on('change',function(){
                let end_date = $(this).val()
                let convertedDate = moment(end_date).format('DD/MM/YYYY')
                table.column(4).search(convertedDate).draw()
                hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                if(end_date == ''){
                    hideProjectTablePagination(table,table.rows({search:'applied'}).count())
                }
            })            


            // //filter date range
            // $('#dateSearchProject').off().on('click',function(){
            //     $.ajax({
            //         url:'/project-date-range-filter',
            //         type:'get',
            //         dataType:'json',
            //         data:{
            //             start_date:$('#start_date').val(),
            //             end_date:$('#end_date').val(),
            //         },
            //         success:function(response){
            //             if(response.projects.length > 0){
            //                 let date = []
            //                 response.projects.forEach((project) => {
            //                     table = $('#projectTable').DataTable()                        
            //                     let convertedStartDate = moment(project.project_start_date).format('DD/MM/YYYY')
            //                     let convertedEndDate = moment(project.project_enddate).format('DD/MM/YYYY')
            //                     date.push('(?=.*' + convertedStartDate + convertedEndDate + ')');
            //                 })
            //                 table.column(3).search(date.join('|'),true,false,true).draw()
            //                 table.column().search(date.join('|'),true,false,true).draw()
            //             //     if(date){
            //             //         hidePagination(table,table.rows({search:'applied'}).count())
            //             //     }else{
            //             //         hidePagination(table,table.rows({search:'applied'}).count())
            //             //     }
            //             //     $('#no-data').hide()
            //             //     $('tbody').show()
            //             // }else{
            //             //     $('#no-data').show()
            //             //     $('tbody').hide()
            //             //     table = $('#projectTable').DataTable()  
            //             //     table.column(2).search('').draw()
            //             }
            //         }
            //     })
            // })

        })
    
        //dynamically hiding pagination on search results
        table.on('search.dt',function(){
            hideProjectTablePagination(table,table.rows({search:'applied'}).count())
        })
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

//function to clear filter
function clearFilters() {
    table.column(8).search('').draw() // Clear status filter
    table.column(7).search('').draw() // Clear type filter
    table.column(2).search('').draw() // Clear assignee filter
    table.column(3).search('').draw() // Clear start date filter
    table.column(4).search('').draw() // Clear end date filter
    table.draw() 
  }

//function to clear filter
$('#clearFilterBtn').on('click',function(){
    $('#filterProjectStatus').val('')
    $('#filterProjectType').val('')
    $('#filterAssignee').val('')
    $('#project_start_date').val('')
    $('#project_end_date').val('')
    $('#no-data').hide()
    $('tbody').show()
    if(table.rows().count() > 10 ){
        $('#projectTable_length').show()
        $('.pagination').show()
    }else{
        $('#projectTable_length').hide()
        $('.pagination').hide()
    }
   clearFilters()
})

