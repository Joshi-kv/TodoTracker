
$(document).ready(() => {

    //porject creation form validation
    $('#projectForm').validate({
        rules: {
            project_title: {
                required: true,
            },
            project_description: {
                required: true,
            },
            projectAssignee: {
                required: true,
            },
            start_date:{
                required: true,
            },
            end_date:{
                required: true,
            },
            project_type: {
                required: true,
            },
            project_status:{
                required: true,
            }
        },
        errorElement: "div",
        highlight: function(element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid')
        },
        errorPlacement: function(error, element) {
            error.addClass('text-danger');
            error.insertAfter(element);
        },
    });


    //calculating duration days and estimated hours
    $('#start_date, #endDate').on('change', function(){
        let start_date = $('#start_date').val();
        let end_date = $('#endDate').val();

        let startDate = new Date(start_date)
        let endDate = new Date(end_date)

        let timeDifference = endDate.getTime() - startDate.getTime();

        let duration = timeDifference / (1000 * 60 * 60 * 24)
        let estimatedHours  = duration * 24
        if(duration > 0){
            if(duration == 1){
                $('#duration').val(`${duration} day`)
            }else{
                $('#duration').val(`${duration} days`)
            } 
            $('#estimatedHours').val(`${estimatedHours} hours`)           
        }
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

    const csrftoken = getCookie('csrftoken');

    // submiting form 
    $('#projectForm').on('submit', (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrftoken);
        formData.append('project_title', $('input[name="project_title"]').val());
        formData.append('project_description', $('textarea[name="project_description"]').val());
        formData.append('start_date', $('input[name="start_date"]').val());
        formData.append('end_date', $('input[name="end_date"]').val());
        formData.append('project_assignee', $('select[name="projectAssignee"]').val());
        formData.append('project_status', $('select[name="project_status"]').val());
        formData.append('project_type', $('select[name="project_type"]').val());
        formData.append('duration',$('input[name="duration"]').val())
        formData.append('estimated_hours',$('input[name="estimatedHours"]').val())

        let project_title = $('input[name="project_title"]').val()
        let project_description = $('textarea[name="project_description"]').val()
        let start_date = $('input[name="start_date"]').val()
        let end_date = $('input[name="end_date"]').val()
        let project_assignee = $('select[name="projectAssignee"]').val()
        let duration = $('input[name="duration"]').val()
        let estimated_hours = $('input[name="estimatedHours"]').val()
        let project_type = $('select[name="project_type"]').val()
        let project_status = $('select[name="project_status"]').val()

        if(project_title && project_description && project_status && project_type && project_assignee && start_date && end_date && duration && estimated_hours){
            $.ajax({
                type: 'post',
                url: '/create-project/',
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                data: formData,
                success: function(response) {
                    console.log(response)
                    let project = response.project;
                    let total = response.total
                    let table = $('#projectTable').DataTable()
                    let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
                    let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
                    let projectId = project.project_id
                    let projectRow = table.row.add([
                        `${project.project_title}`,
                        `${project.project_description}`,
                        `${project.assignee}`,
                        `${convertedStartdate}`,
                        `${convertedEnddate}`,
                        `${project.duration}`,
                        `${project.estimated_hours}`,
                        `${project.project_type}`,
                        `${project.project_status}`,
                        `
                        <div class="d-flex">
                            <div class="mx-3 ">
                            <button class="btn btn-primary btn-sm" id="projectEditBtn" data-bs-toggle="modal" data-bs-target="#updateProjectModal" data-project-edit=${project.project_id}>
                            <i class="fas fa-edit"></i></button>
                            <button class="btn btn-danger btn-sm mt-2" id="deleteProjectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" data-delete-project=${project.project_id}>
                            <i class="fas fa-trash"></i></button>
                            </div>
                            <div class="mx-3">
                            <button class="btn btn-info btn-sm"><a href="/todo/"><i class="fas fa-list"></i></a></button>
                            <button class="btn btn-warning btn-sm mt-2"><i class="fas fa-circle-xmark"></i></button>
                            </div>
                        </div>
                        `
                    ]).node()
                    $(projectRow).attr('data-project-id',projectId)
                    table.draw()
                    alertify.set('notifier', 'position', 'top-right');
                    alertify.success('New project added successfully');
    
                    // // Call changePagination with the updated total number of tasks
                    projectTablePagination(table,total)
                    // //custom filtering
                    // $('select[name="filterStatus"]').on('change',function(){
                    //     let status = $(this).val()
                    //     table.column(4).search(status).draw()
                    //     showPagination(table,table.data().count())
                    // })
                    // $('select[name="filterPriority"]').on('change',function(){
                    //     let priority = $(this).val()
                    //     table.column(3).search(priority).draw()
                    //     showPagination(table,table.data().count())
                    // })
            
                    // $('input[name="filterDate"]').on('change',function(){
                    //     let date = $(this).val()
                    //     convertedDate = moment(date).format('DD/MM/YYYY')
                    //     table.column(2).search(convertedDate).draw()
                    //     showPagination(table,table.data().count())
                    // })
                },
    
            });
            $('#basicModal').modal('toggle');
            $('#projectForm')[0].reset();
        }
    });

    $('#close').on('click',function(e){
        e.preventDefault()
        $('#taskForm')[0].reset()
    })

});


function projectTablePagination(table,tasks){
    if (tasks > 10) {
        $('#projectTable_length').show();
        $('.pagination').show();
    } else {
        $('#projectTable_length').hide();
        $('.pagination').hide();
    }
}

// function to hide pagination dynamically 
function showProjectTablePagination(table,tasks) {
    if (tasks > 10) {
        $('#projectTable_length').show();
        $('.pagination').show();
    } else {
        $('#projectTable_length').hide();
        $('.pagination').hide();
    }

    $('select[name="projectTable_length"]').on('change', () => {
        if (tasks > $('select[name="projectTable_length"]').val()) {
            $('.pagination').show();
        } else {
            $('.pagination').hide();
        }
    });
}