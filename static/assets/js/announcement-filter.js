$(document).ready(() => {
    $('select[name="filterBy"]').on('change',function(e){
        $.ajax({
            url:'/announcement-filter-filterby',
            dataType:'json',
            data:{
                filter_option:e.target.value
            },
            success:function(response){
                $('#newsDiv').empty()
                console.log(response)
                if(response.result.length > 0){
                    response.result.forEach((announcement) => {
                        let convertedDate = moment(announcement.published_on).format('DD-MM-yy')   
                        let convertedTime = moment(announcement.published_time,'HH:mm').format('hh:mm A')                 
                        let announcementContent = 
                        
                        `
                        <div class="col-lg-6 mt-5">
        
                        <div class="card">
                        <div class="card-body">
                            <a href="/announcement/${announcement.announcement_slug}/"><h5 class="card-title">${announcement.announcement_title}</h5></a>
                            <span>published by <b>${announcement.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
                            <img class="newsImage mt-3" src="${announcement.announcement_image}" alt="" >
                        </div>
                        </div>
                        </div>
            
                        `
                        $('#newsDiv').append(announcementContent)
                    })
                }else{
                    let announcementContent = 
                    `
                    <div  class="no-news-content my-5 d-flex justify-content-center">
                    <div>
                    <h4>No announcements</h4>
                    </div>
                    </div>
                    `
                    $('#newsDiv').append(announcementContent)
                }
            }
        })
    })
})