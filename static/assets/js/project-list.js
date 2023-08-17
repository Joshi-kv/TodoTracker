let table;
let length;


function format(d) {
    console.log(d)
    // `d` is the original data object for the row
    return (
        '<dl>' +
        '<dt>Start Date:</dt>' +
        '<dd>' +
        d[2] +
        '</dd>' +
        '<dt>End Date:</dt>' +
        '<dd>' +
        d[3] +
        '</dd>' +
        '<dt>Duration:</dt>' +
        '<dd>' +
        d[4] +
        '</dd>' +
        '<dt>Estimated Hours:</dt>' +
        '<dd>' +
        d[5] +
        '</dd>' +
        '<dt>Project Description:</dt>' +
        '<dd>'+
        d[1] + 
        '</dd>' +
        '</dl>'
    );
}

const urlParams = new URLSearchParams(window.location.search);
const filterOption = urlParams.get('filter');
$(document).ready(function() {
    console.log(filterOption);
      // fetching tasks on page load
    const url = 'http://127.0.0.1:8000/project-list/'
    fetch(url)
    .then(response => response.json())
    .then((data)=> {
        console.log(data)
        table = $('#projectTable').DataTable({
            columnDefs: [
                {
                  targets: 0,
                  className: 'dt-control',
            },{
                targets:[1,2,3,4,5],
                visible:false,
            }
            
        ],
        // columns:[
        //     // {data:null,"defaultContent": ""},
        //     {data:'Title'},
        //     {data:'Start Date'},
        //     {data:'End Date'},
        //     {data:'Duration'},
        //     {data:'Estimated Hours'},
        //     {data:'Type'},
        //     {data:'Status'},
        //     {data:'Action'},
        // ],
            'responsive': true,
            "ordering":false,
            'info':false,
            'empty':false
        })
        table.column
        if(data.projects.length > 0) {
          length = data.projects.length
            $('.dataTables_empty').hide()
            data.projects.forEach((project) => {
                if(project.is_staff){
                    let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
                    let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
                    let projectRow = table.row.add([
                        `${project.project_title}`,
                        `${project.project_description}`,
                        `${convertedStartdate}`,
                        `${convertedEnddate}`,
                        `${project.duration}`,
                        `${project.estimated_hours}`,
                        `${project.project_type}`,
                        `${project.project_status}`,
                        `
                        <div class="d-flex justify-content-around">
                        <button class="btn btn-success btn-sm m-1" id="editProjectBtn" data-bs-toggle="modal" data-bs-target="#editProjectModal" data-edit-project=${project.project_id}>
                        <i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm m-1" id="deleteProjectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" data-delete-project=${project.project_id}>
                        <i class="fas fa-trash"></i></button>
                        <button class="btn btn-primary btn-sm m-1"><a class="text-white" href="/project-detail/${project.project_id}">
                        <i class="fas fa-eye"></i></a>
                        </button>
                        </div>
                        `
        
                    ]).node()
                    $(projectRow).attr('id',`project-row-${project.project_id}`)
                    $('#projectTable tbody').append(projectRow)
                    hidePagination(table,length)
                    
                    // Add event listener for opening and closing details
                
                    
                }else{
                    let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
                    let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
                    let projectRow = table.row.add([
                        `${project.project_title}`,
                        `${project.project_description}`,
                        `${convertedStartdate}`,
                        `${convertedEnddate}`,
                        `${project.duration}`,
                        `${project.estimated_hours}`,
                        `${project.project_type}`,
                        `${project.project_status}`,
                        `
                        <button class="btn btn-primary btn-sm "><a class="text-white" href="/project-detail/${project.project_id}">
                        <i class="fas fa-eye"></i></a>
                        </button>
                        `
        
                    ]).node()
                    $(projectRow).attr('id',`project-row-${project.project_id}`)
                    $('#projectTable tbody').append(projectRow)
                    hidePagination(table,length)
                    
                }
                
             })
             
             table.on('click', 'td.dt-control', function (e) {
                let tr = e.target.closest('tr');
                let row = table.row(tr);
            
                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                }
                else {
                    // Open this row
                    row.child(format(row.data())).show();
                }
            });

            if(filterOption){
               
               if(filterOption == 'totalprojects'){
                $('select[name="filterProjectStatus"]').val('').change()
                    table.column(6).search('').draw()
                    hidePagination(table,table.rows({search:'applied'}).count())
               }else{
                $('select[name="filterProjectStatus"]').val(filterOption).change()
                table.column(7).search(filterOption).draw()
                hidePagination(table,table.rows({search:'applied'}).count()) 
               }
            }else{
                $('select[name="filterProjectStatus"]').val('Pending').change()
                table.column(7).search('Pending').draw()
                hidePagination(table,table.rows({search:'applied'}).count())
            }
            $('select[name="filterProjectStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(7).search(status).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(status == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterProjectType"]').on('change',function(){
                let type = $(this).val()
                table.column(6).search(type).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(type == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })

            // //filter date range
            // $('#dateSearch').off().on('click',function(){
            //     $.ajax({
            //         url:'/date-range-filter-project',
            //         type:'get',
            //         dataType:'json',
            //         data:{
            //             project_id:project_id,
            //             start_date:$('#project_start_date').val(),
            //             end_date:$('#projct_end_date').val(),
            //         },
            //         success:function(response){
            //             if(response.tasks.length > 0){
            //                 let date = []
            //                 response.tasks.forEach((task) => {
            //                     table = $('#projectTable').DataTable()                        
            //                     let convertedDueDate = moment(task.task_duedate).format('DD/MM/YYYY')
            //                     date.push('(?=.*' + convertedDueDate + ')');
            //                 })
            //                 table.column(2).search(date.join('|'),true,false,true).draw()
            //                 if(date){
            //                     hidePagination(table,table.rows({search:'applied'}).count())
            //                 }else{
            //                     hidePagination(table,table.rows({search:'applied'}).count())
            //                 }
            //                 $('#no-data').hide()
            //                 $('tbody').show()
            //             }else{
            //                 $('#no-data').show()
            //                 $('tbody').hide()
            //                 table = $('#taskTable').DataTable()  
            //                 table.column(2).search('').draw()
            //             }
            //         }
            //     })
            // })

        }else{
            $('.dataTables_empty').show()
        }
        
    })

    function hidePagination(table,length){
      if(length > 10){
        $('#projectTable_length').show()
        $('#projectTable_paginate').show()
      }else{
        $('#projectTable_length').hide()
        $('#projectTable_paginate').hide()
      }

    }
    $('select[name="projectTable_length"]').change(function(){
      selected_length = $(this).val()
      hidePagination(table, selected_length)
    })

    //function to clear filter
    function clearFilters() {
        table.column(5).search('').draw() // Clear status filter
        table.column(6).search('').draw() // Clear priority filter
        // table.column(2).search('').draw() // Clear date filter
        table.draw() 
    }

    //function to clear filter
    $('#clearFilterBtn').on('click',function(){
        $('#filterProjectStatus').val('')
        $('#filterProjectType').val('')
        hidePagination(table,table.rows({search:'applied'}).count())
    clearFilters()
    })

  })
