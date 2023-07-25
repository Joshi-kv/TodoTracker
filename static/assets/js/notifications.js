$(document).ready(function() {

    updateNotifications()

    $('#clearAllBtn').click(function(){
        $.ajax({
            url:'/clear-notifications',
            type:'GET',
            success:function(data){
                if(data.status == 'success'){
                    updateNotifications()
                }
            }
        })
    })
})

function updateNotifications(){
    const url = 'http://127.0.0.1:8000/pending-notifications/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        console.log(data);
        if(data.notification_count > 0){
            $('#clearAllBtn').show()
            data.notifications.forEach((notification) => {
                let notificationContent = 
                `
                <li class="notification-item">
                    <div>
                    <p><b>"${notification.task_title}"</b> task is pending</p>
                    </div>
                </li>
                <li>
                    <hr class="dropdown-divider">
                </li>
                `
                $('#notifications').append(notificationContent)
            })
            if(data.notification_count > 1){
                $('#notification-count').html('you have '+ data.notification_count +' notifications');
            }else{
                $('#notification-count').html('You have 1 notification');
            }
        }else{
            $('#count-badge').html('')
            $('#clearAllBtn').hide()
            $('#notification-count').html('no notifications');
        }

        if(data.notification_count == 0){
            $('#count-badge').html('')
        }else if(data.notification_count <= 5 && data.notification_count != 0){
            $('#count-badge').html(data.notification_count)
        }else{
            $('#count-badge').html('5+')
        }
    })
}