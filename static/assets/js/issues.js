let pathname = window.location.href.replace(/\/+$/, '');
let project_id = pathname.substring(pathname.lastIndexOf('/') +1 )

$(document).ready(() =>{


    // fetching tasks on page load
    const url = `http://127.0.0.1:8000/lists/issues/${project_id}/`
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        table = $('#issueTable').DataTable({
            "ordering":false
        })
        console.log(data)
        hidePagination(table,table.rows().count())
        data.issues.forEach((issue) =>{
            if(issue.is_staff){
                console.log('ss')
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
                table = $('#issueTable').DataTable();
                table.draw()
                issueLength = data.issues.length
                hidePagination(table,issueLength)
            }else{
                let issueId = issue.issue_id
                let issueRow = table.row.add([
                    `${issue.issue_title}`,
                    `${issue.issue_description}`,
                    `${issue.issue_assignee}`,
                    `${issue.issue_priority}`,
                    `${issue.issue_status}`,
                    `
                    <div class="d-flex">
                        <button class="btn btn-sm btn-success mx-2">
                        <a href="/project/lists/issue-detail/${project_id}" class="text-white"><i class="fas fa-eye"></i></a>
                        </button>
                    </div>
                    `
                ]).node()
                $(issueRow).attr('data-issue-id',issueId)
                table = $('#issueTable').DataTable();
                table.draw()
                issueLength = data.issues.length
                hidePagination(table,issueLength)
            }  
            
            //custom filtering
            $('select[name="filterIssueStatus"]').on('change',function(){
                let status = $(this).val()
                table.column(4).search(status).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(status == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })
            $('select[name="filterIssuePriority"]').on('change',function(){
                console.log('priority')
                let type = $(this).val()
                table.column(3).search(type).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(type == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })            
            $('select[name="filterAssignee"]').on('change',function(){
                let assignee = $(this).val()
                table.column(2).search(assignee).draw()
                hidePagination(table,table.rows({search:'applied'}).count())
                if(assignee == ''){
                    hidePagination(table,table.rows({search:'applied'}).count())
                }
            })    

         })
    
        //dynamically hiding pagination on search results
        table.on('search.dt',function(){
            hidePagination(table,table.rows({search:'applied'}).count())
        })
    })

})





//function to hide pagination dynamically 
function hidePagination(table,issues){
    if(issues > 10 ){
        $('#issueTable_length').show()
        $('.pagination').show()
    }else{
        $('#issueTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="issueTable_length"]').on('change',() =>{
        if(tasks > $('select[name="issueTable_length"]').val() ){
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
    $('#filterIssueStatus').val('')
    $('#filterIssuePriority').val('')
    $('#filterAssignee').val('')
    if(table.rows().count() > 10 ){
        $('#issueTable_length').show()
        $('.pagination').show()
    }else{
        $('#issueTable_length').hide()
        $('.pagination').hide()
    }
   clearFilters()
})




