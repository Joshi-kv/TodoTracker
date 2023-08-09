let pathname = window.location.href.replace(/\/+$/, '');
let task_id = pathname.substring(pathname.lastIndexOf('/') +1 )

$(document).ready(() => {


    //task creation form validation
    $('#subTaskForm').validate({
        rules: {
            sub_task_title: {
                required: true,
            },
            sub_task_status: {
                required: true,
            },
            sub_task_priority: {
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
    $('#subTaskForm').on('submit', (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrftoken);
        formData.append('sub_task_title', $('input[name="sub_task_title"]').val());
        formData.append('sub_task_status', $('select[name="sub_task_status"]').val());
        formData.append('sub_task_priority', $('select[name="sub_task_priority"]').val());

        let sub_task_title = $('input[name="sub_task_title"]').val()
        let sub_task_status = $('select[name="sub_task_status"]').val()
        let sub_task_priority = $('select[name="sub_task_priority"]').val()

        if(sub_task_title && sub_task_status && sub_task_priority ){
            $.ajax({
                type: 'post',
                url: `/task/create-sub-task/${task_id}/`,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                data: formData,
                success: function(response) {
                    console.log(response);
                    let sub_task = response.sub_task;
                    let sub_total = response.total
                    let table = $('#subTaskTable').DataTable()
                    let subTaskId = sub_task.sub_task_id
                    let newRow = table.row.add([
                        `${sub_task.sub_task_title}`,
                        `${sub_task.sub_task_priority}`,
                        `${sub_task.sub_task_status}`,
                        `
                        <div class="d-flex">
                            <div class="mx-3">
                                <button class="btn btn-danger btn-sm" id="editSubTaskBtn" data-bs-target="#updateSubTaskModal" data-bs-toggle="modal" data-sub-taskedit="${sub_task.sub_task_id}">
                                <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-primary btn-sm " id="deleteSubTaskBtn" data-bs-target="#deleteSubTaskModal" data-bs-toggle="modal" data-sub-task-delete="${sub_task.sub_task_id}"><i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        `
                    ]).node();
                    $(newRow).attr('data-sub-task-id',subTaskId)
                    table.draw()
                    alertify.set('notifier', 'position', 'top-right');
                    alertify.success('New task added successfully');
                },
    
            });
            $('#basicModal').modal('toggle');
            $('#subTaskForm')[0].reset();
        }
    });

    $('#close').on('click',function(e){
        e.preventDefault()
        $('#subTaskForm')[0].reset()
    })

});


function pagination(table,tasks){
    if (tasks > 10) {
        $('#subTaskTable_length').show();
        $('.pagination').show();
    } else {
        $('#subTaskTable_length').hide();
        $('.pagination').hide();
    }
}

// function to hide pagination dynamically 
function showPagination(table,tasks) {
    if (tasks.length > 10) {
        $('#subTaskTable_length').show();
        $('.pagination').show();
    } else {
        $('#subTaskTable_length').hide();
        $('.pagination').hide();
    }

    $('select[name="subTaskTable_length"]').on('change', () => {
        if (tasks > $('select[name="subTaskTable_length"]').val()) {
            $('.pagination').show();
        } else {
            $('.pagination').hide();
        }
    });
}