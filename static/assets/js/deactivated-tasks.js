$(document).ready(function(){
    const url = 'http://127.0.0.1:8000/deactivated-tasks/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        if(data.deactivated_tasks.length > 0){
            data.deactivated_tasks.forEach((deactivatedTask,index) => {
                let deactivatedTaskDiv = $('#deactivatedTask')
                let deactivatedDate = moment(deactivatedTask.deactivated_date).format('DD/MM/YYYY')
                let deactivatedTaskContent = 
                `
                <tr id=${deactivatedTask.task_id}>
                    <td>${index+1}</td>
                    <td>${deactivatedTask.task_title}</td>
                    <td>${deactivatedTask.task_description}</td>
                    <td>${deactivatedDate}</td>
                    <td>${deactivatedTask.task_status}</td>
                </tr>
                `
                deactivatedTaskDiv.append(deactivatedTaskContent)
            })
        }
    })
})