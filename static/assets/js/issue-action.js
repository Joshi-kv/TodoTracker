$(document).ready(() =>{

    $(document).on('click','#issueUpdateBtn',function(){
        let issueId = $(this).attr('data-issue-edit')
        let modalId = $('#issueUpdateModal').attr('data-issue-id',`${issueId}`)
        $.ajax({
            type:'get',
            url:'/update-issue-view',
            dataType:'json',
            data:{'issue_id':issueId},
            success:function(response){
                console.log(response.issue.issue_status)
                issue = response.issue
                $('#issueUpdateTitle').val(issue.issue_title)
                $('#issueUpdateDescription').val(issue.issue_description)
                $('#issueUpdateAssignee').val(issue.issue_assignee)
                $('#issueUpdateStatus').val(issue.issue_status)
                $('#issueUpdatePriority').val(issue.issue_priority)
            }

        })
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

    //update form submission
    $('#updateIssueForm').on('submit',(e)=>{
        e.preventDefault()
        let issueId = $('#issueUpdateModal').attr('data-issue-id')
        let issue_title = $('#issueUpdateTitle').val()
        let issue_description = $('#issueUpdateDescription').val()
        let issue_assignee = $('#issueUpdateAssignee').val()
        let issue_status = $('#issueUpdateStatus').val()
        let issue_priority = $('#issueUpdatePriority').val()
        if (issue_title&& issue_description && issue_assignee && issue_status && issue_priority){
            $.ajax({
                type:'post',
                url:'/update-issue/',
                dataType:'json',
                data:{
                    'csrfmiddlewaretoken':csrftoken,
                    'issue_id':issueId,
                    'issue_title':issue_title,
                    'issue_description':issue_description,
                    'issue_assignee':issue_assignee,
                    'issue_status':issue_status,
                    'issue_priority':issue_priority,
                },
                success:function(response){
                    if(response.status === 'success'){
                        let updatedIssue = response.issue
                        let table = $('#issueTable').DataTable()
                        const rowIndex = table.row(`tr[data-issue-id="${issueId}"]`).index();
                        table.row(rowIndex).data([
                            `${updatedIssue.issue_title}`,
                            `${updatedIssue.issue_description}`,
                            `${updatedIssue.issue_assignee}`,
                            `${updatedIssue.issue_priority}`,
                            `${updatedIssue.issue_status}`,
                            `
                            <div class="d-flex">
                                <button class="btn btn-sm btn-primary mx-2" id="issueUpdateBtn"  data-issue-edit="${updatedIssue.issue_id}" data-bs-toggle="modal" data-bs-target="#issueUpdateModal" >
                                <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger mx-2" data-bs-toggle="modal" data-issue-delete="${updatedIssue.issue_id}" data-bs-target="#deleteIssueModal" >
                                <i class="fas fa-trash"></i>
                                </button>
                                <button class="btn btn-sm btn-success mx-2">
                                <a href="" class="text-white"><i class="fas fa-eye"></i></a>
                                </button>
                            </div>
                            `
                        ]).draw(false)
                    }
                    alertify.set('notifier','position','top-right')
                    alertify.warning('Issue edited successfully')
                },
            })

            $('#issueUpdateModal').modal('toggle')
        }else{
            alertify.set('notifier','position','top-right')
            alertify.error('Please fill all the fields')
        }
    })

    //task update functions end 

    //task delete functions start
    $(document).on('click','#deleteIssueBtn',function(){
        let issueId = $(this).attr('data-issue-delete')
        let deleteModalId = $('#deleteIssueModal').attr('delete-issue',`${issueId}`)
    })
    $('#listDeleteForm').on('submit',(e) => {
        e.preventDefault()
        let issueId = $('#deleteIssueModal').attr('delete-issue')
        $.ajax({
            type:'post',
            url:`/delete-issue/${project_id}/`,
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                issue_id:issueId
            },
            success:function(response){
                if(response.status === 'success'){
                    let total = response.total
                    
                    let table = $('#issueTable').DataTable()
                    let deletedRow = table.row(`tr[data-issue-id=${issueId}]`).index()
                    table.row(deletedRow).remove().draw(false)
                    changePagination(table,total)
                    
                }
                alertify.set('notifier','position','top-right')
                alertify.error('Issue deleted!')
            },
        })
        $('#deleteIssueModal').modal('toggle')
    })


})

//function to hide pagination dynamically 
function changePagination(table,total){

        
    if(total > 10 ){
        $('#issueTable_length').show()
        $('.pagination').show()
    }else{
        $('#issueTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="issueTable_length"]').on('change',() =>{
        console.log($('select[name="issueTable_length').val())
        if(total > $('select[name="issueTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}