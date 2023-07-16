$(document).ready(() => {
    $('select[name="filterCategory"], select[name="filterBy"]').on('change', function (e) {
        var filterCategory = $('select[name="filterCategory"]').val();
        var filterBy = $('select[name="filterBy"]').val();
      
        $.ajax({
          url: '/my-news-filter',
          dataType: 'json',
          data: {
            filterCategory: filterCategory,
            filterBy: filterBy
          },
          success:function(response){
                console.log(response)
                $('#myNewsDiv').empty()
                if(response.result.length > 0){
                    response.result.forEach((news) => {
                        let convertedDate = moment(news.published_on).format('DD-MM-yy')   
                        let convertedTime = moment(news.published_time,'HH:mm').format('hh:mm A')                 
                        let newsContent = 
                        
                        `
                        <div class="col-lg-6">
        
                        <div class="card">
                        <div class="card-body">
                            <a href="/news/${news.news_slug}/"><h5 class="card-title">${news.news_title}</h5></a>
                            <span>published by <b>${news.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
                            <img class="newsImage mt-3" src="${news.news_image}" alt="" >
                        </div>
                        </div>
                        </div>
            
                        `
                        $('#myNewsDiv').append(newsContent)
                    })
                }else{
                    let newsContent = 
                    `
                    <div  class="no-news-content my-5 d-flex justify-content-center">
                    <div>
                    <h4>No news created</h4>
                    </div>
                    </div>
                    `
                    $('#myNewsDiv').append(newsContent)
                }
            }
        });
    });
      

    $('#clearFilter').on('click',function(){
        $('#myNewsDiv').empty()
        $('#filterCategory').val('')
        $('#filterBy').val('')
        const url = 'http://127.0.0.1:8000/my-news-list/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            let newsDiv = $('#myNewsDiv')
            if(data.news.length > 0){
                    data.news.forEach((news) => {
                    let convertedDate = moment(news.published_on).format('DD-MM-yy')   
                    let convertedTime = moment(news.published_time,'HH:mm').format('hh:mm A')                 
                    let newsContent = 
                    
                    `
                    <div class="col-lg-6">
                    <div class="card" id="myNews-${news.news_id}"  data-news="${news.news_id}">
                    <div class="card-body">
                        <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow" id="recentLog">
                        <li class="dropdown-header text-start">
                            <h6>Options</h6>
                        </li>
                        <li class="dropdown-item" id="newsUpdate" data-bs-toggle="modal" data-bs-target="#newsUpdateModal" data-update=${news.news_id}>Update</li>
                        <li class="dropdown-item" id="newsDelete" data-bs-toggle="modal" data-bs-target="#newsDeleteModal" data-delete=${news.news_id}>Delete</li>
                        </ul>
                        <a href="/news/${news.news_slug}/"  id="slug-${news.news_id}"><h5 class="card-title" id="title-${news.news_id}">${news.news_title}</h5></a>
                        <span class="text-secondary small">published on ${convertedDate}&nbsp;${convertedTime}</span>
                        <img class="newsImage mt-3"  src="${news.news_image}" id="image-${news.news_id}" alt="" >
                    </div>
                    </div>
                    </div>
        
                    `
                    newsDiv.append(newsContent)
                })
            }else{
                let newsContent = 
                `
                <div  class="no-news-content my-5 d-flex justify-content-center">
                <div>
                <h4>No news created</h4>
                </div>
                </div>
                `
                newsDiv.append(newsContent)
            }
        })
    })
})