$(document).ready(() => {
    const url = 'http://127.0.0.1:8000/general-news-list/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        let newsDiv = $('#newsDiv')
        if(data.news.length > 0){
            console.log(data)
                data.news.forEach((news) => {
                let convertedDate = moment(news.published_on).format('DD-MM-yy')   
                let convertedTime = moment(news.published_time,'HH:mm').format('hh:mm A')                 
                let newsContent = 
                
                `
                <div class="col-lg-6">

                <div class="card">
                <div class="card-body">
                    <a href=""><h5 class="card-title">${news.news_title}</h5></a>
                    <span>published by <b>${news.author}</b></span><span class="text-secondary small ms-5">published on ${convertedDate}&nbsp;${convertedTime}</span>
                    <img class="newsImage mt-3" src="${news.news_image}" alt="" >
                    <p>${news.news_description}</p>
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