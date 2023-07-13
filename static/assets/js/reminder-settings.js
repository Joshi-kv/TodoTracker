$(document).ready(() => {
    $('#reminderSettingsForm').on('submit',function(e){
        e.preventDefault()
        let reminderCheckbox = $('#reminder').prop('checked')
        let reminder_option = null
        if(reminderCheckbox == false){
            reminder_option = 'turnoff'
        }else{
            reminder_option = 'trunon'
        }
        console.log(reminder_option)
        $.ajax({
            type:'post',
            url:'/user/reminder-settings/',
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                reminder:reminder_option
            },
            success:function(response){
                console.log(response)
                if(response.status=='success' && response.reminder=='Enabled'){
                    $('#reminder').setAttribute('checked')
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

})
