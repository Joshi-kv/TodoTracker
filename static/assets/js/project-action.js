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

    const csrftoken = getCookie('csrftoken')

    $(document).on('click','#editProjectBtn',function(){
        let projectId = $(this).attr('data-edit-project')
        console.log(projectId)
        let editModalId = $('#editProjectModal').attr('edit-project',projectId)
        $.ajax({
            type:'get',
            url:'/update-project/',
            dataType: 'json',
            data:{
                project_id:projectId,
            },
            success:function(response){
                if(response.status == 'success'){
                    let project = response.project;
                    $('#editProjectStatus').val(project.project_status)
                    $('#editProjectType').val(project.project_type)
                }
            }
        })
    })

    //update form submission
    $('#editProjectForm').on('submit',(e)=>{
        e.preventDefault()
        let projectId = $('#editProjectModal').attr('edit-project')
        let project_type = $('#editProjectType').val()
        let project_status = $('#editProjectStatus').val()
        if (project_type && project_status){
            $.ajax({
                type:'post',
                url:'/update-project/',
                dataType:'json',
                data:{
                    'csrfmiddlewaretoken':csrftoken,
                    'project_id':projectId,
                    'project_type':project_type,
                    'project_status':project_status,
                },
                success:function(response){
                    if(response.status === 'updated'){
                        let editedProject = response.project
                        let table = $('#projectTable').DataTable()
                        let projectId = editedProject.project_id
                        console.log(projectId)
                        let convertedStartdate = moment(editedProject.project_start_date).format('DD/MM/YYYY')
                        let convertedEnddate = moment(editedProject.project_end_date).format('DD/MM/YYYY')
                        const rowIndex = table.row(`tr[id=project-row-${editedProject.project_id}]`).index();
                        table.row(rowIndex).data([
                            `${editedProject.project_title}`,
                            `${editedProject.project_description}`,
                            `${convertedStartdate}`,
                            `${convertedEnddate}`,
                            `${editedProject.duration}`,
                            `${editedProject.estimated_hours}`,
                            `${editedProject.project_type}`,
                            `${editedProject.project_status}`,
                            `
                                <div class="d-flex justify-content-around">
                                <button class="btn btn-success btn-sm m-1" id="editProjectBtn" data-bs-toggle="modal" data-bs-target="#editProjectModal" data-edit-project=${editedProject.project_id}>
                                <i class="fas fa-edit"></i></button>
                                <button class="btn btn-danger btn-sm m-1" id="deleteProjectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" data-delete-project=${editedProject.project_id}>
                                <i class="fas fa-trash"></i></button>
                                <button class="btn btn-primary btn-sm m-1"><a class="text-white" href="/project-detail/${editedProject.project_id}">
                                <i class="fas fa-eye"></i></a>
                                </button>
                                </div>
                            `
                        ]).draw(false)
                    }
                    alertify.set('notifier','position','top-right')
                    alertify.warning('Task edited successfully')
                },
            })

            $('#editProjectModal').modal('toggle')
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