$(document).ready(() => {
    url = 'http://127.0.0.1:8000/dashboard-count/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        $('#totalTask').html(data.total_tasks)
        $('#completedTask').html(data.completed_tasks)
        $('#pendingTask').html(data.pending_tasks)
    })
})