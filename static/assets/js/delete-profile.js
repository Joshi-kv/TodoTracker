$(document).ready(() => {
    $('#removeBtn').on('click',(e) => { 
        let requestedUser = $('#removeBtn').attr('data-user')
        $.ajax({
            type:'get',
            url:'/user/remove-profile-picture/',
            dataType:'json',
            data:{
                requested_user:requestedUser
            },
            success:function(response){
                if(response.status == 'success'){
                    $('#userAvatar').attr('src',response.profile_image)
                    $('#overviewProfileImage').attr('src',response.profile_image)
                    $('#profilePicture').attr('src',response.profile_image)
                    alertify.set('notifier','position','top-right')
                    alertify.error('Profile picture deleted.')
                }
            }
        })


    })
})