$(document).ready(() => {

    //fetching
    const url = 'http://127.0.0.1:8000/dashboard-project/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {

        if(data.projects.length > 0){
            $('#projectTableHeading').show()
        data.projects.forEach((project,index) => {
            let projectDiv = $('#dashboardProjects')
            let status;
                switch(project.project_status){
                    case 'Pending' : 
                        status = 'pending-project'
                        break;

                    case 'On Hold':
                        status = 'onhold'
                        break;
                    case 'Canceled' :
                        status = 'canceled'
                        break;
                    case 'Completed' :
                        status = 'completed'
                        break;
                    default :
                        status = ''
                        break
                }

                let projectContent = 


                `
                <tr>
                    <td>${index+1}</td>
                    <td>${project.project_title}</td>
                    <td>${project.project_description}</td>
                    <td>${project.project_assignee}</td>
                    <td>${project.project_duration}</td>
                    <td><p class="visual-indicator ${status}">${project.project_status}</p></td>
                </tr>
                
                `
                $('#projectTableHeading').show()
                projectDiv.append(projectContent)
            })

        }else{
            $('#projectTableHeading').hide()
            let projectDiv = $('#dashboardProjects')
            let projectContent =
            `
            <tr>
                <td class="col-span-5 text-center">No tasks added</td>
            </tr>
            
            `
            projectDiv.append(projectContent)  
        }
    })

    function getEventTarget(e) {
        return e.target || e.srcElement; 
    }
    
    //ajax request for filter projects
    var projectFilter = document.getElementById('projectFilter')
    projectFilter.onclick = function(e){
        var target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-dashboard-project',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#dashboardProjects').empty()
                $('#filterOption').html(target.innerHTML)
                if(response.projects.length > 0){
                    response.projects.forEach((project,index) => {
                        let projectDiv = $('#dashboardProjects')
                        let status;
                        switch(project.project_status){
                            case 'Pending' : 
                                status = 'pending-project'
                                break;
        
                            case 'On Hold':
                                status = 'onhold'
                                break;
                            case 'Canceled' :
                                status = 'canceled'
                                break;
                            case 'Completed' :
                                status = 'completed'
                                break;
                            default :
                                status = ''
                                break
                        }
    
                        let projectContent = 
    
    
                        `
                        <tr>
                            <td>${index+1}</td>
                            <td>${project.project_title}</td>
                            <td>${project.project_description}</td>
                            <td>${project.project_assignee}</td>
                            <td>${project.project_duration}</td>
                            <td><p class="visual-indicator ${status}">${project.project_status}</p></td>
                        </tr>
                        
                        `
                        $('#projectTableHeading').show()
                        projectDiv.append(projectContent)
                    })
    
                }else{
                    $('#projectTableHeading').hide()
                    let projectDiv = $('#dashboardProjects')
                    let projectContent =
                    `
                    <tr>
                        <td class="col-span-5 text-center">No tasks added</td>
                    </tr>
                    
                    `
                    projectDiv.append(projectContent)  
                }
            }
        })
    }

    //function to clear filters
    $('#projectClearFilter').on('click',function(){
        $('#dashboardProjects').empty()
        $('#filterOption').html('Recent')
        const url = 'http://127.0.0.1:8000/dashboard-project/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            if(data.projects.length > 0){
                data.projects.forEach((project,index) => {
                    let projectDiv = $('#dashboardProjects')
                    let status;
                    switch(project.project_status){
                        case 'Pending' : 
                            status = 'pending-project'
                            break;
    
                        case 'On Hold':
                            status = 'onhold'
                            break;
                        case 'Canceled' :
                            status = 'canceled'
                            break;
                        case 'Completed' :
                            status = 'completed'
                            break;
                        default :
                            status = ''
                            break
                    }

                    let projectContent = 


                    `
                    <tr>
                        <td>${index+1}</td>
                        <td>${project.project_title}</td>
                        <td>${project.project_description}</td>
                        <td>${project.project_assignee}</td>
                        <td>${project.project_duration}</td>
                        <td><p class="visual-indicator ${status}">${project.project_status}</p></td>
                    </tr>
                    
                    `
                    $('#projectTableHeading').show()
                    projectDiv.append(projectContent)
                })

            }else{
                $('#projectTableHeading').hide()
                let projectDiv = $('#dashboardProjects')
                let projectContent =
                `
                <tr>
                    <td class="col-span-5 text-center">No tasks added</td>
                </tr>
                
                `
                projectDiv.append(projectContent)  
            }
        })
    })
})