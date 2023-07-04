$(document).ready(() =>{
    // fetching tasks on page load
    const url = 'http://127.0.0.1:8000/tasks/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        data.tasks.forEach((task) =>{
            let table = $('#taskTable').DataTable()
            table.row.add([
                `${task.task_title}`,
                `${task.task_description}`,
                `${task.task_duedate}`,
                `${task.task_priority}`,
                `${task.task_status}`,
                `
                <button class="btn btn-danger" id="editBtn" data-edit="${task.task_id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-primary my-1" id="deleteBtn" data-delete="${task.task_id}"><i class="fas fa-trash"></i></button>
                `
              ]).draw()
            //   $('taskTable').node().id=`${task.task_id}`;
        })
    })
})