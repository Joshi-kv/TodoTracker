$('#projectUploadForm').validate({
    rules:{
        project_file:{
            required:true,
        },
    },
    errorElement: "div",
    errorClass: "invalid-feedback",
    highlight: function(element) {
        $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function(element) {
        $(element).removeClass('is-invalid')
    },
    errorPlacement : function(error,element){
        error.addClass(' text-danger')
        error.insertBefore(element)
    },
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
let changedFile;

$('#projectFile').on('change', function(e){
    changedFile = e.target.files[0]
    console.log(changedFile)
})

$('#projectUploadForm').on('submit', function(e){
    e.preventDefault()
    // let file = $('#projectFile')[0].files[0]
    // console.log(file)
    let formData = new FormData()
    formData.append('csrfmiddlewaretoken', csrftoken)
    formData.append('project_file', changedFile)
    
    $.ajax({
        type: 'POST',
        url: `/check-duplicates/`,
        dataType: 'json',
        mimeType:'multipart/form-data',
        contentType:false,
        processData:false,
        beforeSend:function(xhr){
            xhr.setRequestHeader('X-CSRFToken',csrftoken)
        },
        data: formData,
        success:function(response){
            console.log(response)
            if(response.status == 'duplicates'){
                const confirmModal = new bootstrap.Modal($('#confirmModal'))
                const confirmMessage = ` <b>${response.duplicates.length}</b> entries in the file already exists.Do you want to continue?` 
                $('#confirmMessage').html(confirmMessage)
                $('#uploadProjectModal').modal('toggle')
                $('#projectUploadForm')[0].reset()
                confirmModal.show()
                $('#confirmUpload').click(function () {
                    // table = $('#projectTable').DataTable()
                    // table.remove()
                    // Continue processing without duplicates
                    $('#projectTable').empty()
                    $('#projectTable').DataTable().destroy()
                    confirmModal.hide();
                    uploadProjectData(formData);
                });           
            }else{
                $('#projectTable').empty()
                $('#projectTable').DataTable().destroy()
                uploadProjectData(formData);
                $('#uploadProjectModal').modal('toggle')
                $('#projectUploadForm')[0].reset()
            }
        }
    })

})

function uploadProjectData(formData){

    $.ajax({
        type: 'POST',
        url: `/upload-project/`,  
        data: formData,
        dataType: 'json',
        mimeType: 'multipart/form-data',
        contentType: false,
        processData: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRFToken', csrftoken);
        },
        success:function(response){
            console.log(response)
            if(response.status == 'success'){
                // table.destroy()
                alertify.set('notifier', 'position', 'top-right');
                alertify.success('Project file uploaded successfully');
                populateProjectTable()
            }
        }
    })
}



function populateProjectTable(){
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
                targets:[1,3,4,5,6,7],
                visible:false,
            }
            
        ],
            'responsive': true,
            "ordering":false,
            'info':false,
            'empty':false
        })
        table.column
        if(data.projects.length > 0) {
          length = data.projects.length
            $('.dataTables_empty').show()
            console.log(data.projects)
            data.projects.forEach((project) => {
                if(project.is_staff){
                    let convertedCreatedDate = moment(project.created_at).format('DD/MM/YYYY')
                    let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
                    let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
                    let projectRow = table.row.add([
                        `${project.project_title}`,
                        `${project.project_description}`,
                        `${convertedCreatedDate}`,
                        `${project.assignee}`,
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
                    let convertedCreatedDate = moment(project.created_at).format('DD/MM/YYYY')
                    let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
                    let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
                    let projectRow = table.row.add([
                        `${project.project_title}`,
                        `${project.project_description}`,
                        `${convertedCreatedDate}`,
                        `${project.assignee}`,
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
                    table.column(9).search('').draw()
                    hidePagination(table,table.rows({search:'applied'}).count())
               }else{
                $('select[name="filterProjectStatus"]').val(filterOption).change()
                table.column(9).search(filterOption).draw()
                hidePagination(table,table.rows({search:'applied'}).count()) 
               }
            }else{
                $('select[name="filterProjectStatus"]').val('Pending').change()
                table.column(9).search('Pending').draw()
                hidePagination(table,table.rows({search:'applied'}).count())
            }
            $('select[name="filterAssignee"]').on('change',function(){
                let assignee = $(this).val()
                table.column(3).search(assignee).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(assignee == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterProjectStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(9).search(status).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(status == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterProjectType"]').on('change',function(){
                let type = $(this).val()
                table.column(8).search(type).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(type == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })

            //filter date range
            $('#dateSearchProject').off().on('click',function(){
                $.ajax({
                    url:'/project-date-range-filter',
                    type:'get',
                    dataType:'json',
                    data:{
                        start_date:$('#project_start_date').val(),
                        end_date:$('#project_end_date').val(),
                    },
                    success:function(response){
                        if(response.projects.length > 0){
                            let date = []
                            response.projects.forEach((project) => {
                                console.log(project)
                                table = $('#projectTable').DataTable()                        
                                let convertedCreatedDate = moment(project.created_at).format('DD/MM/YYYY')
                                date.push('(?=.*' + convertedCreatedDate + ')');
                            })
                            table.column(2).search(date.join('|'),true,false,true).draw()
                            if(date){
                                hidePagination(table,table.rows({search:'applied'}).count())
                            }else{
                                hidePagination(table,table.rows({search:'applied'}).count())
                            }
                            $('select[name="filterProjectStatus"]').val('').change()
                            table.column(9).search('').draw()
                            hidePagination(table,table.rows({search:'applied'}).count())
                            $('.dataTables_empty').hide()
                            $('tbody').show()
                        }else{
                            alertify.set('notifier', 'position', 'top-right');
                            alertify.error('No projects created under this date range');
                            // table = $('#projectTable').DataTable()  
                            // table.column(2).search('').draw()
                        }
                    }
                })
            })

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
          table.column(9).search('').draw() // Clear status filter
          table.column(7).search('').draw() // Clear type filter
          table.column(2).search('').draw() // Clear date filter
          table.column(3).search('').draw() // Clear assignee filter
          table.draw() 
      }
  
      //function to clear filter
      $('#clearFilterBtn').on('click',function(){
          $('#filterProjectStatus').val('').change()
          $('#filterProjectType').val('')
          $('#filterAssignee').val('')
          $('#project_start_date').val('')
          $('#project_end_date').val('')
          hidePagination(table,table.rows({search:'applied'}).count())
      clearFilters()
      })
}