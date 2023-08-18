

$(document).ready(() => {

    let pathname = window.location.href
    let params = new URL(pathname).searchParams;
    let id = params.get('id');

    //task creation form validation
    $('#taskForm').validate({
        rules: {
            title: {
                required: true,
            },
            description: {
                required: true,
            },
            project:{
                required: true,
            },
            assignee:{
                required:true
            },
            list:{
                required: true,
            },
            duedate: {
                required: true,
            },
            status: {
                required: true,
            },
            priority: {
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
    $('#taskForm').on('submit', (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrftoken);
        formData.append('task_title', $('input[name="title"]').val());
        formData.append('project_id',$('input[name="project_id"]').val());
        formData.append('list',$('select[name="list"]').val());
        formData.append('assignee',$('select[name="assignee"]').val());
        formData.append('task_description', $('textarea[name="description"]').val());
        formData.append('task_duedate', $('input[name="duedate"]').val());
        formData.append('task_status', $('select[name="status"]').val());
        formData.append('task_priority', $('select[name="priority"]').val());

        let title = $('input[name="title"]').val()
        let description = $('textarea[name="description"]').val()
        let duedate =  $('input[name="duedate"]').val()
        let status = $('select[name="status"]').val()
        let priority = $('select[name="priority"]').val()
        let project_id = $('input[name="project_id"]').val()
        let list = $('select[name="list"]').val()
        // let assignee = $('select[name="assignee"]').val()

        if(title && description && duedate && status && priority && list ){
            $.ajax({
                type: 'post',
                url: `/create-task/?id=${id}/`,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                data: formData,
                success: function(response) {
                    if (response.status === 'success') {
                        let task = response.task;
                        let total = response.total
                        let table = $('#taskTable').DataTable()
                        let convertedTaskDuedate = moment(task.task_duedate).format('DD/MM/YYYY');
                        let taskId = task.task_id
                        let newRow = table.row.add([
                            `${task.task_title}`,
                            `${task.task_description}`,
                            `${convertedTaskDuedate}`,
                            `${task.task_priority}`,
                            `${task.task_status}`,
                            `
                            <div class="d-flex">
                                <div class="mx-3">
                                    <button class="btn btn-danger btn-sm" id="editBtn" data-bs-target="#updateModal" data-bs-toggle="modal" data-edit="${task.task_id}"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-primary btn-sm " id="deleteBtn" data-bs-target="#deleteModal" data-bs-toggle="modal" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                                    <button class="btn btn-primary btn-sm ">
                                    <a class="text-white" href="/project/task-detail/${taskId}/"><i class="fas fa-eye"></i></a>
                                    </button>
                                </div>
                            </div>
                            `
                        ]).node();
                        $(newRow).attr('data-task-id',taskId)
                        table.draw()
                        alertify.set('notifier', 'position', 'top-right');
                        alertify.success('New task added successfully');
        
                        // Call changePagination with the updated total number of tasks
                        pagination(table,total)
                        
                    }
                    if(response.status === 'error'){
                        alertify.set('notifier', 'position', 'top-right');
                        alertify.error('You cannot create task under this project.The project is either on hold or has been completed');  
                    }
                    //custom filtering
                    $('select[name="filterStatus"]').on('change',function(){
                        let status = $(this).val()
                        table.column(4).search(status).draw()
                        showPagination(table,table.data().count())
                    })
                    $('select[name="filterPriority"]').on('change',function(){
                        let priority = $(this).val()
                        table.column(3).search(priority).draw()
                        showPagination(table,table.data().count())
                    })
            
                    $('input[name="filterDate"]').on('change',function(){
                        let date = $(this).val()
                        convertedDate = moment(date).format('DD/MM/YYYY')
                        table.column(2).search(convertedDate).draw()
                        showPagination(table,table.data().count())
                    })
                },
    
            });
            $('#basicModal').modal('toggle');
            $('#taskForm')[0].reset();
        }
    });

    $('#close').on('click',function(e){
        e.preventDefault()
        $('#taskForm')[0].reset()
    })

});


function pagination(table,tasks){
    if (tasks > 10) {
        $('#taskTable_length').show();
        $('.pagination').show();
    } else {
        $('#taskTable_length').hide();
        $('.pagination').hide();
    }
}

// function to hide pagination dynamically 
function showPagination(table,tasks) {
    if (tasks.length > 10) {
        $('#taskTable_length').show();
        $('.pagination').show();
    } else {
        $('#taskTable_length').hide();
        $('.pagination').hide();
    }

    $('select[name="taskTable_length"]').on('change', () => {
        if (tasks > $('select[name="taskTable_length"]').val()) {
            $('.pagination').show();
        } else {
            $('.pagination').hide();
        }
    });
}