$(document).ready(() => {

    //ajax request for all news live search
    let searchInput = $('input[name ="allNewsSearch"]')
    searchInput.keyup((e) =>{
         $('#newsDiv').empty()
        if(e.keyCode != 8){
            $.ajax({
                url:'/search-all-news',
                data:{
                    'query' : e.target.value
                },
                dataType : 'json',
                success:function(response){
                    if(response.status == 'success'){
                        if(response.news.length > 0){
                            response.news.forEach((data) => {
                                console.log(data)
                                
                                let convertedDate = moment(data.published_on).format('DD-MM-YYYY')   
                                let convertedTime = moment(data.published_time,'HH:mm').format('hh:mm A')  
                               
                                let newsContent = 
                                `
                                <div class="col-lg-6">
    
                                <div class="card">
                                <div class="card-body">
                                    <a href="/news/${data.news_slug}/"><h5 class="card-title">${data.news_title}</h5></a>
                                    <span>published by <b>${data.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
                                    <img class="newsImage mt-3" src="${data.news_image}" alt="" >
                                </div>
                                </div>
                                </div>
                                
                                `
                                $("#newsDiv").append(newsContent)
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
                            $('#newsDiv').append(newsContent)
                        }
                    }
                }
            })
        }else{
            const url = 'http://127.0.0.1:8000/news-list/'
            fetch(url) 
            .then(response => response.json())
            .then((data) => {
                let newsDiv = $('#newsDiv')
                if(data.news.length > 0){
                        data.news.forEach((news) => {
                        let convertedDate = moment(news.published_on).format('DD-MM-YYYY')   
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
        }
    })
    $('#allSearchForm').on('submit',function(e){
        e.preventDefault()
    })
})