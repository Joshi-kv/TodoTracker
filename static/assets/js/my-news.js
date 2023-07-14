$(document).ready(() => {
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

                <div class="card">
                <div class="card-body">
                    <a href="/${news.news_slug}/"><h5 class="card-title">${news.news_title}</h5></a>
                    <span class="text-secondary small">published on ${convertedDate}&nbsp;${convertedTime}</span>
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