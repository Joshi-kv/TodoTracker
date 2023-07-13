$(document).ready(() => {
    $('#addNewsForm').validate({
        rules:{
           newsTitle:{
            required:true
           },
           newsImage:{
            required:true,
            accept:'image/*'
           },
           newsDescription:{
            required:true
           },
           newsCategory:{
            required:true
           } 
        },
        errorElement: "div",
        highlight: function(element) {
            console.log(element)
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            if($(element).attr('file')){
                $('#file-error').hide()
            }
            $(element).removeClass('is-invalid')
        },
        errorPlacement : function(error,element){
            if(element.attr('name') == 'newsImage'){
                if(element.val() == ''){
                    error.addClass('text-danger')
                }else{
                    error.remove()
                }
            }
            error.addClass(' text-danger')
            error.insertBefore(element)
        },
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

    $('#addNewsForm').on('submit',(e) =>{
        e.preventDefault()

        let file = $('#file')[0].files[0]
        
        let formData = new FormData()
        formData.append('csrfmiddlewaretoken',csrftoken)
        formData.append('news_title',$('input[name ="newsTitle"]').val().trim())
        formData.append('news_image',file)
        formData.append('news_description',$('textarea[name ="newsDescription"]').val())
        formData.append('news_category',$('select[name ="newsCategory"]').val())


        $.ajax({
            type:'post',
            url:'/create-news/',
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
                let news = response.news
                let convertedDate = moment(news.published_on).format('DD-MM-yy')   
                let convertedTime = moment(news.published_time,'HH:mm').format('hh:mm A')                 
                let newsDiv = $('#myNewsDiv')
                let newsContent = 
                
                `
                <div class="col-lg-6">

                <div class="card">
                <div class="card-body">
                    <a href=""><h5 class="card-title">${news.news_title}</h5></a>
                    <span class="text-secondary small">published on ${convertedDate}&nbsp;${convertedTime}</span>
                    <img class="newsImage mt-3" src="${news.news_image}" alt="" >
                    <p>${news.news_description}</p>
                </div>
                </div>
                </div>
    
                `
                $('.no-news-content').remove()
                newsDiv.prepend(newsContent)
            }
        })
        $('#newsAddModal').modal('toggle');
        $('#addNewsForm')[0].reset();
    })
})