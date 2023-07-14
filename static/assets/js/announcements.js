$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/announcements-list/'
    fetch(url) 
    .then(response => response.json())
    .then((data) => {
        let announcemtDiv = $('#newsDiv')
        if(data.announcements.length > 0){
                data.announcements.forEach((announcement) => {
                let convertedDate = moment(announcement.published_date).format('DD-MM-yy')   
                let convertedTime = moment(announcement.published_time,'HH:mm').format('hh:mm A')                 
                let announcemtContent = 
                
                `
                <div class="col-lg-6">

                <div class="card">
                <div class="card-body">
                    <a href="/announcement/${announcement.announcement_slug}/"><h5 class="card-title">${announcement.announcement_title}</h5></a>
                    <span>published by <b>${announcement.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
                    <img class="newsImage mt-3" src="${announcement.announcement_image}" alt="" >
                </div>
                </div>
                </div>
    
                `
                announcemtDiv.append(announcemtContent)
            })
        }else{
            let announcementContent = 
            `
            <div  class="no-news-content my-5 d-flex justify-content-center">
            <div>
            <h4>No news created</h4>
            </div>
            </div>
            `
            announcemtDiv.append(announcementContent)
        }
    })
})