$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/dashboard-task/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        if(data.tasks.length > 0){
            $('#taskTableHeading').show()
        data.tasks.forEach((task,index) => {

                let taskDiv = $('#dashboardTasks')
                let convertedDate = moment(task.duedate).format('DD/MM/yy')
                // $('#badge').addClass('bg-primary')
                // $('.badge').addClass('bg-primary')
                // // $('#badge').addClass('text-white')
                // // $('.badge').addClass('bg-success')
                // // $('#badge').addClass('bg-success')
                let taskContent =
                `
                <tr>
                    <td>${index+1}</td>
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${convertedDate}</td>
                    <td><span id="badge">${task.status}</span></td>
                </tr>
                
                `
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
                if(response.tasks.length > 0){
                    response.tasks.forEach((task,index) => {
                        let convertedDate = moment(task.duedate).format('DD/MM/yy')
                        let taskDiv = $('#dashboardTasks')
                        let taskContent = 
                        `
                        <tr>
                            <td>${index+1}</td> 
                            <td>${task.title}</td>
                            <td>${task.description}</td>
                            <td>${convertedDate}</td>
                            <td><span >${task.status}</span></td>
                        </tr>
                        
                        `
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
        const url = 'http://127.0.0.1:8000/dashboard-task/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            if(data.tasks.length > 0){
                data.tasks.forEach((task,index) => {
                    let taskDiv = $('#dashboardTasks')
                    let convertedDate = moment(task.duedate).format('DD/MM/yy')
                    let taskContent = 
                    `
                    <tr>
                        <td>${index+1}</td>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${convertedDate}</td>
                        <td><span >${task.status}</span></td>
                    </tr>
                    
                    `
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