$(document).ready(() => {

      // fetching all recent logs of current user
      const url = 'http://127.0.0.1:8000/activity-logs/';
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          if (data.activity.length > 0) {
            let slicedData = [data.activity.slice(0,5)];
            slicedData.forEach((data) => {
              data.forEach((item) => {
                let currentDate = new Date();
                let convertedCurrentDate = moment(currentDate).format('DD-MM-YYYY');
                let activity_time = item.activity_time;
                let convertedTime = moment(activity_time, 'HH:mm').format('hh:mm a');
                let activity = item.activity;
                let activity_date = item.activity_date;
                let convertedActivityDate = moment(activity_date).format('DD-MM-YYYY');
                let activityContentDiv = $('.activity')
                let activityContent;
                if(item.staff_status == 'project_manager' && item.username){
                  activityContent = `
                    <div class="activity-item d-flex" id=${activity_date}>
                      <div class="activite-label">${convertedTime},<br><span>${convertedActivityDate}<br></span><br></div><br>
                      <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                      <div class="activity-content">
                        ${activity} - (${item.username})
                      </div>
                    </div>
                  `
                }else{
                  activityContent = `
                    <div class="activity-item d-flex" id=${activity_date}>
                      <div class="activite-label">${convertedTime},<br><span>${convertedActivityDate}<br></span><br></div><br>
                      <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                      <div class="activity-content">
                        ${activity}
                      </div>
                    </div>
                  `
                }
    
                if (convertedActivityDate != convertedCurrentDate) {
                  activityContentDiv.append(activityContent);
                } else {
                  activityContentDiv.append(activityContent);
                }
              });
            });
          } else {
            let activityContentDiv = $('.activity');
            let activityContent = `
              <div class="activity-item d-flex">
                <div class="activity-content">
                  No recent activities
                </div>
              </div>
            `;
            activityContentDiv.append(activityContent);
          }
        });
    });
    

  //function to filter recent activities
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
              $('#filterOptionRecent').html(target.innerHTML)
              if(response.filtered_recent_logs.length > 0){
                  response.filtered_recent_logs.forEach((item) => {
                      let activity_time = item.activity_time
                      let activity = item.activity
                      let activity_date = item.activity_date
                      let convertedActivityDate = moment(activity_date).format('DD-MM-YYYY')
                      let currentDate = new Date()
                      let convertedCurrentDate = moment(currentDate).format('DD-MM-YYYY')
                      let convertedTime = moment(activity_time,'HH:mm').format('hh:mm a')
          
                      let activityContentDiv = $('.activity')
                          let activityContent = 
                          `
                          <div class="activity-item d-flex">
                              <div class="activite-label">${convertedTime},<br><span>${convertedActivityDate}<br></span><br></div><br>
                              <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                              <div class="activity-content">
                              ${activity}
                              </div>
                          </div>
              
                          `
                          if(convertedActivityDate != convertedCurrentDate){
                              activityContentDiv.append(activityContent)
          
                          }else{
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
          }
      })
  };

  //function to clear filter 
  $('#recentLogClearFilter').on('click',function(){
      $('.activity').empty()
      $('#filterOptionRecent').html('')
      const url = 'http://127.0.0.1:8000/activity-logs/'
      fetch(url)
      .then(response => response.json())
      .then((data) => {
        if(data.activity.length > 0){
            let slicedData = [data.activity.slice(0,5)]
            slicedData.forEach((data) => {
                data.forEach((item) =>{
                    let currentDate = new Date()
                    let convertedCurrentDate = moment(currentDate).format('DD-MM-YYYY')
                    let activity_time = item.activity_time
                    let convertedTime = moment(activity_time,'HH:mm').format('hh:mm a')
                    let activity = item.activity
                    let activity_date = item.activity_date
                    let convertedActivityDate = moment(activity_date).format('DD-MM-YYYY')
                    let activityContentDiv = $('.activity')
                    let activityContent;
                    if(item.staff_status == 'project_manager' && item.username){
                      activityContent = `
                        <div class="activity-item d-flex" id=${activity_date}>
                          <div class="activite-label">${convertedTime},<br><span>${convertedActivityDate}<br></span><br></div><br>
                          <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                          <div class="activity-content">
                            ${activity} - (${item.username})
                          </div>
                        </div>
                      `
                    }else{
                      activityContent = `
                        <div class="activity-item d-flex" id=${activity_date}>
                          <div class="activite-label">${convertedTime},<br><span>${convertedActivityDate}<br></span><br></div><br>
                          <i class='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                          <div class="activity-content">
                            ${activity}
                          </div>
                        </div>
                      `
                    }
        
                    if (convertedActivityDate != convertedCurrentDate) {
                      activityContentDiv.append(activityContent);
                    } else {
                      activityContentDiv.append(activityContent);
                    }
                  });
                });
              } else {
                let activityContentDiv = $('.activity');
                let activityContent = `
                  <div class="activity-item d-flex">
                    <div class="activity-content">
                      No recent activities
                    </div>
                  </div>
                `;
                activityContentDiv.append(activityContent);
              }
  })
})