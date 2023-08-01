$(document).ready(() => {

    //fucntion to fetch tasks summary
    url = 'http://127.0.0.1:8000/dashboard-count/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        $('#totalTask').html(data.total_tasks)
        $('#completedTask').html(data.completed_tasks)
        $('#pendingTask').html(data.pending_tasks)
        $('#inProgressTask').html(data.in_progress_tasks)
        $('#upcomingTask').html(data.upcoming_tasks)
    })
})