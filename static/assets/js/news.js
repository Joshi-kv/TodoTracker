$(document).ready(() => {
    url = 'http://127.0.0.1:8000/news-list/'
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        data.news.forEach((item) =>{
            console.log(item)
            let newsDiv = $('#newsDiv')
            let newsContent = 
            
            `
            <div class="col-lg-6">

            <a href="${item.url}">
            <div class="card">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <b>${item.author}</b> <span class="published ">published on -${item.publishedAt}</span>
                <img class="newsImage mt-3" src="${item.urlToImage}" alt="" >
                <p>${item.description}</p>
            </div>
            </div>
            </a>
    
            </div>

            `
            newsDiv.append(newsContent)
        })
    })
})