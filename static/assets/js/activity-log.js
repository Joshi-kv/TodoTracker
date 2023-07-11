$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/activity-logs/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        data.activity.forEach((item) => { 
            let activity_time = item.activity_time
            let convertedTime = moment(activity_time,'HH:mm').format('hh:mm')
            let today = new Date()
            let current_time = today.getHours()+':'+today.getMinutes()
            let convertedCurrentTime = moment(current_time,'HH:mm').format('hh:mm')
            let timeDifference = convertedTime-convertedCurrentTime
            console.log(timeDifference);
            
        
        })
    })
})