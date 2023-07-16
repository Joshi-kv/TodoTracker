$(document).ready(() => {
    // $('select[name="filterCategory"]').on('change',function(e){
    //     $.ajax({
    //         url:'/all-news-filter-category',
    //         dataType:'json',
    //         data:{
    //             filter_option:e.target.value
    //         },
    //         success:function(response){
    //             $('#newsDiv').empty()
    //             if(response.result.length > 0){
    //                 response.result.forEach((news) => {
    //                     let convertedDate = moment(news.published_on).format('DD-MM-yy')   
    //                     let convertedTime = moment(news.published_time,'HH:mm').format('hh:mm A')                 
    //                     let newsContent = 
                        
    //                     `
    //                     <div class="col-lg-6">
        
    //                     <div class="card">
    //                     <div class="card-body">
    //                         <a href="/news/${news.news_slug}/"><h5 class="card-title">${news.news_title}</h5></a>
    //                         <span>published by <b>${news.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
    //                         <img class="newsImage mt-3" src="${news.news_image}" alt="" >
    //                     </div>
    //                     </div>
    //                     </div>
            
    //                     `
    //                     $('#newsDiv').append(newsContent)
    //                 })
    //             }else{
    //                 let newsContent = 
    //                 `
    //                 <div  class="no-news-content my-5 d-flex justify-content-center">
    //                 <div>
    //                 <h4>No news created</h4>
    //                 </div>
    //                 </div>
    //                 `
    //                 $('#newsDiv').append(newsContent)
    //             }
    //         }
    //     })
    // })

    // $('select[name="filterBy"]').on('change',function(e){
    //     $.ajax({
    //         url:'/all-news-filter-filterby',
    //         dataType:'json',
    //         data:{
    //             filter_option:e.target.value
    //         },
    //         success:function(response){
    //             $('#newsDiv').empty()
    //             if(response.result.length > 0){
    //                 response.result.forEach((news) => {
    //                     let convertedDate = moment(news.published_on).format('DD-MM-yy')   
    //                     let convertedTime = moment(news.published_time,'HH:mm').format('hh:mm A')                 
    //                     let newsContent = 
                        
    //                     `
    //                     <div class="col-lg-6">
        
    //                     <div class="card">
    //                     <div class="card-body">
    //                         <a href="/news/${news.news_slug}/"><h5 class="card-title">${news.news_title}</h5></a>
    //                         <span>published by <b>${news.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
    //                         <img class="newsImage mt-3" src="${news.news_image}" alt="" >
    //                     </div>
    //                     </div>
    //                     </div>
            
    //                     `
    //                     $('#newsDiv').append(newsContent)
    //                 })
    //             }else{
    //                 let newsContent = 
    //                 `
    //                 <div  class="no-news-content my-5 d-flex justify-content-center">
    //                 <div>
    //                 <h4>No news created</h4>
    //                 </div>
    //                 </div>
    //                 `
    //                 $('#newsDiv').append(newsContent)
    //             }
    //         }
    //     })
    // })

    $('select[name="filterCategory"], select[name="filterBy"]').on('change', function (e) {
        var filterCategory = $('select[name="filterCategory"]').val();
        var filterBy = $('select[name="filterBy"]').val();
      
        $.ajax({
          url: '/all-news-filter',
          dataType: 'json',
          data: {
            filterCategory: filterCategory,
            filterBy: filterBy
          },
          success:function(response){
                console.log(response)
                $('#newsDiv').empty()
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
                        $('#newsDiv').append(newsContent)
                    })
                }else{
                    let newsContent = 
                    `
                    <div  class="no-news-content my-5 d-flex justify-content-center">
                    <div>
                    <h4>No news to display</h4>
                    </div>
                    </div>
                    `
                    $('#newsDiv').append(newsContent)
                }
            }
        });
    });

    $('#clearFilter').on('click',function(){
        $('#newsDiv').empty()
        $('#filterCategory').val('')
        $('#filterBy').val('')
        const url = 'http://127.0.0.1:8000/news-list/'
        fetch(url) 
        .then(response => response.json())
        .then((data) => {
            let newsDiv = $('#newsDiv')
            if(data.news.length > 0){
                    data.news.forEach((news) => {
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