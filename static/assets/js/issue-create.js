
$(document).ready(() => {

    //porject creation form validation
    $('#issueForm').validate({
        rules: {
            issue_title: {
                required: true,
            },
            issue_description: {
                required: true,
            },
            issue_assignee: {
                required: true,
            },
            issue_priority: {
                required: true,
            },
            issue_status:{
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
    $('#issueForm').on('submit', (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('csrfmiddlewaretoken', csrftoken);
        formData.append('issue_title', $('input[name="issue_title"]').val());
        formData.append('issue_description', $('textarea[name="issue_description"]').val());
        formData.append('issue_assignee', $('select[name="issue_assignee"]').val());
        formData.append('issue_status', $('select[name="issue_status"]').val());
        formData.append('issue_priority', $('select[name="issue_priority"]').val())

        let issue_title = $('input[name="issue_title"]').val()
        let issue_description = $('textarea[name="issue_description"]').val()
        let issue_assignee = $('select[name="issue_assignee"]').val()
        let issue_priority = $('select[name="issue_priority"]').val()
        let issue_status = $('select[name="issue_status"]').val()

        if(issue_title && issue_description && issue_status && issue_priority && issue_assignee ){
            $.ajax({
                type: 'post',
                url: `/lists/create-issue/${project_id}/`,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-CSRFToken', csrftoken);
                },
                data: formData,
                success: function(response) {
                    console.log(response)
                    let issue = response.issue;
                    let total = response.total
                    let table = $('#issueTable').DataTable()
                    let issueId = issue.issue_id
                    let issueRow = table.row.add([
                        `${issue.issue_title}`,
                        `${issue.issue_description}`,
                        `${issue.issue_assignee}`,
                        `${issue.issue_priority}`,
                        `${issue.issue_status}`,
                        `
                        <div class="d-flex">
                            <button class="btn btn-sm btn-primary mx-2" id="issueUpdateBtn" data-issue-edit="${issue.issue_id}" data-bs-toggle="modal" data-bs-target="#issueUpdateModal" >
                            <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger mx-2" id="deleteIssueBtn" data-issue-delete="${issue.issue_id}" data-bs-toggle="modal" data-bs-target="#deleteIssueModal" >
                            <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-sm btn-success mx-2">
                            <a href="/project/lists/issue-detail/${project_id}" class="text-white"><i class="fas fa-eye"></i></a>
                            </button>
                        </div>
                        `
                    ]).node()
                    $(issueRow).attr('data-issue-id',issueId)
                    $('#issueTable tbody').prepend(issueRow)
                    alertify.set('notifier', 'position', 'top-right');
                    alertify.success('New issue added successfully');
                    $('.dataTables_empty').remove()
    
                    // Call changePagination with the updated total number of tasks
                    projectTablePagination(table,total)
                    // //custom filtering
                    $('select[name="filterIssueStatus"]').on('change',function(){
                        let status = $(this).val()
                        table.column(4).search(status).draw()
                        showPagination(table,table.rows({search:'applied'}).count())
                    })
                    $('select[name="filterIssuePriority"]').on('change',function(){
                        let priority = $(this).val()
                        table.column(3).search(priority).draw()
                        showPagination(table,table.rows({search:'applied'}).count())
                    })
            
                    $('select[name="filterAssignee"]').on('change',function(){
                        let assignee = $(this).val()
                        table.column(2).search(assignee).draw()
                        showPagination(table,table.rows({search:'applied'}).count())
                    })
                },
    
            });
            $('#basicModal').modal('toggle');
            $('#issueForm')[0].reset();
        }
    });

    $('#close').on('click',function(e){
        e.preventDefault()
        $('#issueForm')[0].reset()
    })

});


function projectTablePagination(table,issues){
    if (issues > 10) {
        $('#issueTable_length').show();
        $('.pagination').show();
    } else {
        $('#projectTable_length').hide();
        $('.pagination').hide();
    }
}

// function to hide pagination dynamically 
function showProjectTablePagination(table,issues) {
    if (issues > 10) {
        $('#issueTable_length').show();
        $('.pagination').show();
    } else {
        $('#projectTable_length').hide();
        $('.pagination').hide();
    }

    $('select[name="issueTable_length"]').on('change', () => {
        if (issues > $('select[name="issueTable_length"]').val()) {
            $('.pagination').show();
        } else {
            $('.pagination').hide();
        }
    });
}