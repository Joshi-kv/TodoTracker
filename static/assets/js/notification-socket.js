let loc = window.location 
let start = 'ws://'
let user = document.getElementById('user').innerHTML

console.log(user)

if(loc.protocol == 'https:'){
    start = 'wss://'
}

let endpoint = start + loc.host + '/notification/'

let socket = new WebSocket(endpoint)

socket.onopen = async function(event) {
    console.log('Connected to server',event)
    let data = {
        'user':user
    }
    socket.send(JSON.stringify(data))
}

socket.onmessage = async function(event) {
    console.log('Message from server',event)
    let data = JSON.parse(event.data)
    console.log(data)
    if(data.user == user){
        let countBadge = document.getElementById('count-badge')
        alertify.set('notifier', 'position', 'top-right');
        alertify.success('There is some pending tasks');
        if(data.count > 5){
            countBadge.innerHTML = '5+'
        }else{
            countBadge.innerHTML = data.count
        }

        const url = 'http://127.0.0.1:8000/pending-notifications/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            $('#notifications').empty()
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
                
                if(data.notification_count > 1){
                    $('#notification-count').html('you have '+ data.notification_count +' notifications');
                }else{
                    $('#notification-count').html('You have 1 notification');
                }
            })
        })
    }
}


socket.onclose = async function(event) {
    console.log('Disconnected from server',event)
}