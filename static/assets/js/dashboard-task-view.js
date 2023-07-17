$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/dashboard-task/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        data.tasks.forEach((task) => {
            let taskDiv = $('#dashboardTasks')
            let convertedDate = moment(task.duedate).format('DD/MM/yy')
            // $('#badge').addClass('badge')
            // $('#badge').addClass('bg-success')
            let taskContent =
            `
            <tr>
                <td>${task.title}</td>
                <td>${task.description}</td>
                <td>${convertedDate}</td>
                <td><span id="badge">${task.status}</span></td>
            </tr>
            
            `
            taskDiv.append(taskContent)
        })
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
                response.tasks.forEach((task) => {
                    let convertedDate = moment(task.duedate).format('DD/MM/yy')
                    let taskDiv = $('#dashboardTasks')
                    let taskContent = 
                    `
                    <tr>
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${convertedDate}</td>
                        <td><span >${task.status}</span></td>
                    </tr>
                    
                    `
                    taskDiv.append(taskContent)
                })
            }
        })
    }
    $('#taskClearFilter').on('click',function(){
        $('#dashboardTasks').empty()
        const url = 'http://127.0.0.1:8000/dashboard-task/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            data.tasks.forEach((task) => {
                let taskDiv = $('#dashboardTasks')
                let convertedDate = moment(task.duedate).format('DD/MM/yy')
                let taskContent = 
                `
                <tr>
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${convertedDate}</td>
                    <td><span >${task.status}</span></td>
                </tr>
                
                `
                taskDiv.append(taskContent)
            })
        })
    })
})