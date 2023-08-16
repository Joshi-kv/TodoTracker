let path_name = window.location.href.replace(/\/+$/, '');
let projectId = path_name.substring(path_name.lastIndexOf('/') +1 )

$(document).ready(function() {
    $('#listForm').validate({
        rules:{
            list_name:{
                required:true,
            },
            list_description:{
                required:true,
            }
        },
        errorElement: "div",
        errorClass: "invalid-feedback",
        highlight: function(element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid')
        },
        errorPlacement : function(error,element){
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

    $('#listForm').on('submit', function(e){
        e.preventDefault()
        let list_name = $('#listName').val()
        let list_description = $('#listDescription').val()
        let formData = new FormData()
        formData.append('csrfmiddlewaretoken', csrftoken)
        formData.append('list_name', list_name)
        formData.append('list_description', list_description)
        if(list_name && list_description){
            $.ajax({
                type: 'POST',
                url: `/project/create-list/${projectId}/`,
                dataType: 'json',
                contentType:false,
                processData:false,
                beforeSend:function(xhr){
                    xhr.setRequestHeader('X-CSRFToken',csrftoken)
                },
                data: formData,
                success:function(response){
                        let table = $('#listTable').DataTable()
                        let list = response.list                        
                        let listId = list.list_id
                        let newRow = table.row.add([
                            `${list.list_name}`,
                            `${list.list_description}`,
                            `
                            <div class="d-flex">
                                <button class="btn btn-sm btn-primary mx-2" id="listUpdateBtn" data-list-edit="${list.list_id}" data-bs-toggle="modal" data-bs-target="#listUpdateModal" >
                                <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger mx-2" id="deleteListBtn" data-list-delete="${list.list_id}" data-bs-toggle="modal" data-bs-target="#deleteListModal" >
                                <i class="fas fa-trash"></i>
                                </button>
                                <button class="btn btn-sm btn-info mx-2">
                                <a href="" class="text-white"><i class="fas fa-list"></i></a>
                                
                                </button>
                                <button class="btn btn-sm btn-warning mx-2">
                                <a href="/project/lists/issues/${project_id}/" class="text-white"><i class="fas fa-triangle-exclamation"></i></a>

                                </button>
                            </div>
                            `
                        ]).node();
                        $(newRow).attr('data-list-id',listId)
                        $('#listTable tbody').prepend(newRow)
                        $('.dataTables_empty').remove()
                        alertify.set('notifier', 'position', 'top-right');
                        alertify.success('New project added successfully');
            }
        })
        $('#listModal').modal('toggle')
        $('#listForm')[0].reset()
        }

    })
})