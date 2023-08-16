let table;
let taskLength;
$(document).ready(() =>{
    // fetching tasks on page load
    const url = 'http://127.0.0.1:8000/project-list/'
    fetch(url)
    .then(response => response.json())
    .then((data)=> {
        console.log(data)
        table = $('#projectTable').DataTable({
            "ordering":false,
            'info':false,
            'empty':false
        })
        if(data.projects.length > 0) {
            $('.dataTables_empty').hide(    )
            data.projects.forEach((project) => {
                let convertedStartdate = moment(project.project_startdate).format('DD/MM/YYYY')
                let convertedEnddate = moment(project.project_enddate).format('DD/MM/YYYY')
                let projectRow = table.row.add([
                    `${project.project_title}`,
                    `${convertedStartdate}`,
                    `${convertedEnddate}`,
                    `${project.duration}`,
                    `${project.estimated_hours}`,
                    `${project.project_type}`,
                    `${project.project_status}`,
                    `
                    <button class="btn btn-danger btn-sm " id="deleteProjectBtn" data-bs-toggle="modal" data-bs-target="#deleteProjectModal" data-delete-project=${project.project_id}>
                    <i class="fas fa-trash"></i></button>
                    <button class="btn btn-primary btn-sm "><a class="text-white" href="">
                    <i class="fas fa-eye"></i></a>
                    </button>
                    `
    
                ]).node()
                $(projectRow).attr('id',`project-row-${project.project_id}`)
                $('#projectTable tbody').append(projectRow)
                
            })
        }else{

        }
    })
        
})

