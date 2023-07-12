$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/activity-logs/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        console.log(data)
        if(data.activity.length > 0){

            data.activity.forEach((item) => { 
                let currentDate = new Date()
                let convertedCurrentDate = moment(currentDate).format('yy-MM-DD')
                let activity_time = item.activity_time
                let convertedTime = moment(activity_time,'HH:mm').format('hh:mm')
                let activity = item.activity
                let activity_date = item.activity_date
    
                let activityContentDiv = $('.activity')
                let activityContent = 
                `
                <div class="activity-item d-flex" id=${activity_date}>
                    <div class="activite-label">${convertedTime},<br><span>${activity_date}<br></span><br></div><br>
                    <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                    <div class="activity-content">
                    ${activity}
                    </div>
                </div>
    
                `
                if(activity_date != convertedCurrentDate){
                    activityContentDiv.append(activityContent)

                }else{
                    activityContentDiv.prepend(activityContent)
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

    //filter recent logs
    function getEventTarget(e) {
        return e.target || e.srcElement; 
    }
    
    var filterList = document.getElementById('recentLog');
    filterList.onclick = function(event) {
        var target = getEventTarget(event);
        $.ajax({
            type:'get',
            url:'/recent-logs-filter',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                let activityContentDiv = $('.activity')
                activityContentDiv.empty()
                if(response.filtered_recent_logs.length > 0){
                    response.filtered_recent_logs.forEach((item) => {
                        let activity_time = item.activity_time
                        let currentDate = new Date()
                        let convertedCurrentDate = moment(currentDate).format('yy-MM-DD')
                        let convertedTime = moment(activity_time,'HH:mm').format('hh:mm')
                        let activity = item.activity
                        let activity_date = item.activity_date
            
                        let activityContentDiv = $('.activity')
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
                            if(activity_date != convertedCurrentDate){
                                activityContentDiv.append(activityContent)
            
                            }else{
                                activityContentDiv.prepend(activityContent)
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
            }
        })
    };

    //clear filter 
    $('#recentLogClearFilter').on('click',function(){
        $('.activity').empty()
        const url = 'http://127.0.0.1:8000/activity-logs/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            if(data.activity.length > 0){
    
                data.activity.forEach((item) => { 
                    let currentDate = new Date()
                    let convertedCurrentDate = moment(currentDate).format('yy-MM-DD')
                    let activity_time = item.activity_time
                    let convertedTime = moment(activity_time,'HH:mm').format('hh:mm')
                    let activity = item.activity
                    let activity_date = item.activity_date
        
                    let activityContentDiv = $('.activity')
                    let activityContent = 
                    `
                    <div class="activity-item d-flex" id=${activity_date}>
                        <div class="activite-label">${convertedTime},<br><span>${activity_date}<br></span><br></div><br>
                        <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                        <div class="activity-content">
                        ${activity}
                        </div>
                    </div>
        
                    `
                    if(activity_date != convertedCurrentDate){
                        activityContentDiv.append(activityContent)
    
                    }else{
                        activityContentDiv.prepend(activityContent)
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
})