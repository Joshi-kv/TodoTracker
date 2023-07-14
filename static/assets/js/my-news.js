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
                <div class="card" id="myNews"  data-news="${news.news_id}">
                <div class="card-body">
                    <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow" id="recentLog">
                    <li class="dropdown-header text-start">
                        <h6>Options</h6>
                    </li>
                    <li class="dropdown-item" id="newsUpdate" data-bs-toggle="modal" data-bs-target="#newsUpdateModal" data-update=${news.news_id}>Update</li>
                    <li class="dropdown-item" id="newsDelete" data-delete=${news.news_id}>Delete</li>
                    </ul>
                    <a href="/news/${news.news_slug}/" data-slug="slug-${news.news_id}" id="slug-${news.news_id}"><h5 class="card-title" data-title="title-${news.news_id}" id="title-${news.news_id}">${news.news_title}</h5></a>
                    <span class="text-secondary small">published on ${convertedDate}&nbsp;${convertedTime}</span>
                    <img class="newsImage mt-3" data-image="image-${news.news_id}" src="${news.news_image}" id="image-${news.news_id}" alt="" >
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

    //function show selected file
    $('#UpdateFile').change(function(e){
        console.log('file')
        let file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(e){
           $('#newsUpdateImage').attr('src',reader.result)
        }
    })

})


//function to update news
$(document).on('click','#newsUpdate',function(){
    let newsId = $(this).attr('data-update')
    let modalId = $('#newsUpdateModal').attr('news-id',`${newsId}`)
    $.ajax({
        type:'get',
        url:'/news-update-view',
        dataType:'json',
        data:{'news_id':newsId},
        success:function(response){
            console.log(response)
            if(response.status=='success'){
                $('#newsUpdateTitle').val(response.news.news_title)
                $('#newsUpdateImage').attr('src',response.news.news_image)
                $('#newsUpdateDescription').val(response.news.news_description)
                $('#newsUpdateCategory').val(response.news.news_category)
            }
        }

    })
})


// fetching csrf token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken')

$('#updateNewsForm').on('submit',function(e){
    e.preventDefault()
        let file = $('#UpdateFile')[0].files[0]
        let newsId = $('#newsUpdateModal').attr('news-id')
        let formData = new FormData()
        
        if(file){
            formData.append('news_image',file)
        }else{
            formData.append('news_image',$('newsUpdateImage').attr('src'))
        }

        formData.append('news_id',newsId)
        formData.append('csrfmiddlewaretoken',csrftoken)
        formData.append('news_title',$('input[name ="newsUpdateTitle"]').val().trim())
        formData.append('news_description',$('textarea[name ="newsUpdateDescription"]').val())
        formData.append('news_category',$('select[name ="newsUpdateCategory"]').val())


        $.ajax({
            type:'post',
            url:'/news-update/',
            headers:{'X-CSRFToken':csrftoken},
            dataType:'json',
            mimeType:'multipart/form-data',
            contentType:false,
            processData:false,
            beforeSend:function(xhr){
                xhr.setRequestHeader('X-CSRFToken',csrftoken)
            },
            data:formData,
            success:function(response){
                console.log(response)
                $(`#title-${newsId}`).html(response.news.news_title)
                $(`#slug-${newsId}`).attr('href',response.news.news_slug)
                $(`#image-${newsId}`).attr('src',response.news.news_image)
            }
        })
        $('#newsUpdateModal').modal('toggle');
})

