$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/activity-logs/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        console.log(data)
        if(data.activity.length > 0){

            data.activity.forEach((item) => { 
                let activity_time = item.activity_time
                let convertedTime = moment(activity_time,'HH:mm').format('hh:mm')
                let activity = item.activity
                let activity_date = item.activity_date
    
                let activityContentDiv = $('.activity')
                if(data.activity.length > 0){
                    let activityContent = 
                    `
                    <div class="activity-item d-flex">
                        <div class="activite-label">${convertedTime},<br><span>${activity_date}<br></span><br></div><br>
                        <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                        <div class="activity-content">
                        ${activity}
                        </div>
                    </div>
        
                    `
                    activityContentDiv.append(activityContent)
                }
            })
            
        }else{
            let activityContentDiv = $('.activity')
            let activityContent = 
            `
            <div class="activity-item d-flex">
                <div class="activity-content">
                    No recent activities
                </div>
            </div>

            `
            activityContentDiv.append(activityContent)
        }
    })
})