$(document).ready(() => {

    //fetching featured news and displaying on dashboard
    const url = 'http://127.0.0.1:8000/news-dashboard-view/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        if(data.news.length > 0){
           data.news.forEach((news) => {
            let newsDiv = $('#newsDiv')
            let newsContent;
            if(news.news_description.length > 50){
                let description = news.news_description.slice(0,50)
                newsContent = 
                `
                <div class="post-item clearfix">
                <img src="${news.news_image}" alt="">
                <h4><a href="/news/${news.news_slug}">${news.news_title}</a></h4>
                <p>${description}....</p>
                </div>
    
                `
                newsDiv.append(newsContent)

            }else{
                newsContent = 
                `
                <div class="post-item clearfix">
                <img src="${news.news_image}" alt="">
                <h4><a href="/news/${news.news_slug}">${news.news_title}</a></h4>
                <p>${news.news_description}</p>
                </div>
    
                `
                newsDiv.append(newsContent)   
            }
           })
        }else{
            let newsDiv  = $('#newsDiv')
            let newsContent = 
            `
            <div class="post-item clearfix">
            <p>No latest news</p>
            </div>
            
            `  
            newsDiv.append(newsContent)
        }
    })

    function getEventTarget(e) {
        return e.target || e.srcElement; 
    }
    
    //ajax request for filter news
    var newsFilter = document.getElementById('newsFilter')
    newsFilter.onclick = function(e){
        var target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-news',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                if(response.news.length > 0){
                    let newsDiv = $('#newsDiv')
                    newsDiv.empty()
                    response.news.forEach((news) => {
                        let newsContent;
                        if (news.news_description.length > 50){
                            let description = news.news_description.slice(0,50)
                            newsContent = 
                            `
                            <div class="post-item clearfix">
                            <img src="${news.news_image}" alt="">
                            <h4><a href="/news/${news.news_slug}">${news.news_title}</a></h4>
                            <p>${description}....</p>
                            </div>
    
                            `
                            newsDiv.append(newsContent)
                        }else{

                            newsContent = 
                            `
                            <div class="post-item clearfix">
                            <img src="${news.news_image}" alt="">
                            <h4><a href="/news/${news.news_slug}">${news.news_title}</a></h4>
                            <p>${news.news_description}</p>
                            </div>
    
                            `
                            newsDiv.append(newsContent)
                        }
                    })
                }else{
                  let newsDiv  = $('#newsDiv')
                  newsDiv.empty()
                  let newsContent = 
                  `
                  <div class="post-item clearfix">
                  <p>No latest news</p>
                  </div>
                  
                  `  
                  newsDiv.append(newsContent)
                }
            }
        })
    }
})