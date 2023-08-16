$(document).ready(() =>{
        
    //task updation functions start

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

    //calculating duration days and estimated hours
    $('#projectUpdateStartDate, #projectUpdateEndDate').on('change', function(){
        let start_date = $('#projectUpdateStartDate').val();
        let end_date = $('#projectUpdateEndDate').val();

        let startDate = new Date(start_date)
        let endDate = new Date(end_date)

        let timeDifference = endDate.getTime() - startDate.getTime();

        let duration = timeDifference / (1000 * 60 * 60 * 24)
        let estimatedHours  = duration * 24
        if(duration > 0){
            if(duration == 1){
                $('#projectUpdateDuration').val(`${duration} day`)
            }else{
                $('#projectUpdateDuration').val(`${duration} days`)
            } 
            $('#projectUpdateEstimatedHours').val(`${estimatedHours} hours`)           
        }
    })

    const csrftoken = getCookie('csrftoken')

    //update form submission
    $('#updateProjectForm').on('submit',(e)=>{
        e.preventDefault()
        let projectId = $('#updateProjectModal').attr('data-project-edit')
        let project_title = $('#projectUpdateTitle').val()
        let project_description = $('#projectUpdateDescription').val()
        let project_assignee = $('#projectUpdateAssignee').val()
        let project_start_date = $('#projectUpdateStartDate').val()
        let project_end_date = $('#projectUpdateEndDate').val()
        let project_duration = $('#projectUpdateDuration').val()
        let project_estimated_hours = $('#projectUpdateEstimatedHours').val()
        let project_type = $('#updateProjectType').val()
        let project_status = $('#updateProjectStatus').val()
        if (project_title && project_description && project_assignee && project_start_date && project_end_date && project_duration && project_estimated_hours && project_type && project_status){
            $.ajax({
                type:'post',
                url:'/update-project/',
                dataType:'json',
                data:{
                    'csrfmiddlewaretoken':csrftoken,
                    'project_id':projectId,
                    'project_title':project_title,
                    'project_description':project_description,
                    'project_assignee':project_assignee,
                    'project_start_date':project_start_date,
                    'project_end_date':project_end_date,
                    'project_duration':project_duration,
                    'project_estimated_hours':project_estimated_hours,
                    'project_type':project_type,
                    'project_status':project_status,
                },
                success:function(response){
                    if(response.status === 'updated'){
                        let updatedProject = response.project
                        let table = $('#projectTable').DataTable()
                        let convertedStartdate = moment(updatedProject.project_start_date).format('DD/MM/YYYY')
                        let convertedEnddate = moment(updatedProject.project_end_date).format('DD/MM/YYYY')
                        let projectId = updatedProject.project_id
                        const rowIndex = table.row(`tr[data-project-id="${projectId}"]`).index();
                        table.row(rowIndex).data([
                            `${updatedProject.project_title}`,
                            `${updatedProject.project_description}`,
                            `${updatedProject.project_assignee}`,
                            `${convertedStartdate}`,
                            `${convertedEnddate}`,
                            `${updatedProject.project_duration}`,
                            `${updatedProject.project_estimated_hours}`,
                            `${updatedProject.project_type}`,
                            `${updatedProject.project_status}`,
                            `
                            <div class="d-flex">
                                <div class="mx-3 ">
                                <button class="btn btn-primary btn-sm" id="projectEditBtn" data-bs-toggle="modal" data-bs-target="#updateProjectModal" data-project-edit=${updatedProject.project_id}>
                                <i class="fas fa-edit"></i></button>
                                <button class="btn btn-danger btn-sm mt-2" id="deleteProjectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" data-delete-project=${updatedProject.project_id}>
                                <i class="fas fa-trash"></i></button>
                                </div>
                                <div class="mx-3">
                                <button class="btn btn-info btn-sm"><a class="text-white" href="/project/tasks/${projectId}"><i class="fas fa-list"></i></a></button>
                                <button class="btn btn-warning btn-sm mt-2"><a class="text-white" href="/project/lists/${projectId}"><i class="fas fa-circle-xmark"></i></a></button>
                                </div>
                            </div>
                            `
                        ]).draw(false)
                    }
                    alertify.set('notifier','position','top-right')
                    alertify.warning('Task edited successfully')
                },
            })

            $('#updateProjectModal').modal('toggle')
        }else{
            alertify.set('notifier','position','top-right')
            alertify.error('Please fill all the fields')
        }
    })

    //task update functions end 

    //task delete functions start
    $(document).on('click','#deleteProjectBtn',function(){
        let projectId = $(this).attr('data-delete-project')
        let deleteModalId = $('#deleteProjectModal').attr('delete-project',projectId)
    })
    $('#projectDeleteForm').on('submit',(e) => {
        e.preventDefault()
        let projectId = $('#deleteProjectModal').attr('delete-project')
        console.log(projectId)
        $.ajax({
            type:'post',
            url:'/delete-project/',
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                project_id:projectId
            },
            success:function(response){
                console.log(response)
                if(response.status === 'success'){
                    let total = response.total
                    
                    let table = $('#projectTable').DataTable()
                    let deletedRow = table.row(`tr[data-project-id=${projectId}]`).index()
                    table.row(deletedRow).remove().draw(false)
                    changeProjectTablePagination(table,total)
                    
                }
                alertify.set('notifier','position','top-right')
                alertify.error('Project deactivated!')
            },
        })
        $('#deleteProjectModal').modal('toggle')
    })


})

//function to hide pagination dynamically 
function changeProjectTablePagination(table,total){

        
    if(total > 10 ){
        $('#projectTable_length').show()
        $('.pagination').show()
    }else{
        $('#projectTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="projectTable_length"]').on('change',() =>{
        console.log($('select[name="projectTable_length').val())
        if(total > $('select[name="projectTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}