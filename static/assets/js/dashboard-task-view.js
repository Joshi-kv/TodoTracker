
$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/dashboard-task/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {

        if(data.tasks.length > 0){
            $('#taskTableHeading').show()
        data.tasks.forEach((task,index) => {
                let status;
                let taskDiv = $('#dashboardTasks')
                let convertedDate = moment(task.duedate).format('DD/MM/YYYY')

                switch(task.status){
                    case 'Pending' : 
                        status = 'pending'
                        break;

                    case 'In progress':
                        status = 'in-progress'
                        break;
                    case 'Upcoming' :
                        status = 'upcoming'
                        break;
                    case 'Completed' :
                        status = 'completed'
                        break;
                    default :
                        status = ''
                        break
                }

                let taskContent =
                `
                <tr>
                    <td>${index+1}</td>
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${convertedDate}</td>
                    <td><p class = 'visual-indicator ${status}' >${task.status}</p></td>
                </tr>
                
                `
                $('#taskTableHeading').show()
                taskDiv.append(taskContent)
            })
        }else{
            $('#taskTableHeading').hide()
            let taskDiv = $('#dashboardTasks')
            let taskContent =
            `
            <tr>
                <td class="col-span-5 text-center">No tasks added</td>
            </tr>
            
            `
            taskDiv.append(taskContent)  
        }
    })

    function getEventTarget(e) {
        return e.target || e.srcElement; 
    }
    
    //filter total task
    var taskFilter = document.getElementById('taskFilter')
    taskFilter.onclick = function(e){
        var target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-dashboard-task',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#dashboardTasks').empty()
                $('#filterOption').html(target.innerHTML)
                if(response.tasks.length > 0){
                    response.tasks.forEach((task,index) => {
                        let convertedDate = moment(task.duedate).format('DD/MM/YYYY')
                        let taskDiv = $('#dashboardTasks')
                        let status;
                        switch(task.status){
                            case 'Pending' : 
                                status = 'pending'
                                break;
        
                            case 'In progress':
                                status = 'in-progress'
                                break;
                            case 'Upcoming' :
                                status = 'upcoming'
                                break;
                            case 'Completed' :
                                status = 'completed'
                                break;
                            default :
                                status = ''
                                break
                        }
                        let taskContent = 
                        `
                        <tr>
                            <td>${index+1}</td> 
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td>${convertedDate}</td>
                            <td><p class="visual-indicator ${status}">${task.status}</p></td>
                        </tr>
                        
                        `
                        
                        $('#taskTableHeading').show()
                        taskDiv.append(taskContent)
                    })

                }else{
                    $('#taskTableHeading').hide()
                    let taskDiv = $('#dashboardTasks')
                    let taskContent =
                    `
                    <tr>
                        <td class="col-span-5 text-center">No tasks added</td>
                    </tr>
                    
                    `
                    taskDiv.append(taskContent)    
                }
            }
        })
    }
    $('#taskClearFilter').on('click',function(){
        $('#dashboardTasks').empty()
        $('#filterOption').html('Recent')
        const url = 'http://127.0.0.1:8000/dashboard-task/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            if(data.tasks.length > 0){
                data.tasks.forEach((task,index) => {
                    let taskDiv = $('#dashboardTasks')
                    let convertedDate = moment(task.duedate).format('DD/MM/YYYY')
                    let status;
                    switch(task.status){
                        case 'Pending' : 
                            status = 'pending'
                            break;
    
                        case 'In progress':
                            status = 'in-progress'
                            break;
                        case 'Upcoming' :
                            status = 'upcoming'
                            break;
                        case 'Completed' :
                            status = 'completed'
                            break;
                        default :
                            status = ''
                            break
                    }

                    let taskContent = 


                    `
                    <tr>
                        <td>${index+1}</td>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${convertedDate}</td>
                        <td><p class="visual-indicator ${status}">${task.status}</p></td>
                    </tr>
                    
                    `
                    $('#taskTableHeading').show()
                    taskDiv.append(taskContent)
                })

            }else{
                $('#taskTableHeading').hide()
                let taskDiv = $('#dashboardTasks')
                let taskContent =
                `
                <tr>
                    <td class="col-span-5 text-center">No tasks added</td>
                </tr>
                
                `
                taskDiv.append(taskContent)  
            }
        })
    })
})