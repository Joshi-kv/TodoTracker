$(document).ready(() =>{

    $(document).on('click','#listUpdateBtn',function(){
        let listId = $(this).attr('data-list-edit')
        let modalId = $('#listUpdateModal').attr('data-list-id',`${listId}`)
        $.ajax({
            type:'get',
            url:'/update-list-view',
            dataType:'json',
            data:{'list_id':listId},
            success:function(response){
                list = response.list[0]
                $('#listUpdateName').val(list.list_name)
                $('#listUpdateDescription').val(list.list_description)
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

    //update form submission
    $('#updateListForm').on('submit',(e)=>{
        e.preventDefault()
        let listId = $('#listUpdateModal').attr('data-list-id')
        let list_name = $('#listUpdateName').val()
        let list_description = $('#listUpdateDescription').val()
        if (list_name && list_description ){
            $.ajax({
                type:'post',
                url:'/update-list/',
                dataType:'json',
                data:{
                    'csrfmiddlewaretoken':csrftoken,
                    'list_id':listId,
                    'list_name':list_name,
                    'list_description':list_description,
                },
                success:function(response){
                    if(response.status === 'success'){
                        let updatedList = response.list
                        let table = $('#listTable').DataTable()
                        const rowIndex = table.row(`tr[data-list-id="${listId}"]`).index();
                        table.row(rowIndex).data([
                            `${updatedList.list_name}`,
                            `${updatedList.list_description}`,
                            `
                            <div class="d-flex">
                                <button class="btn btn-sm btn-primary mx-2" id="listUpdateBtn" data-list-edit="${list.list_id}" data-bs-toggle="modal" data-bs-target="#listUpdateModal" >
                                <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger mx-2" id="deleteListBtn" data-list-delete="${list.list_id}" data-bs-toggle="modal" data-bs-target="#deleteListModal" >
                                <i class="fas fa-trash"></i>
                                </button>
                                <button class="btn btn-sm btn-warning mx-2">
                                <a href="/project/lists/issues/${project_id}/" class="text-white"><i class="fas fa-triangle-exclamation"></i></a>

                                </button>
                            </div>
                            `
                        ]).draw(false)
                    }
                    alertify.set('notifier','position','top-right')
                    alertify.warning('Task edited successfully')
                },
            })

            $('#listUpdateModal').modal('toggle')
        }else{
            alertify.set('notifier','position','top-right')
            alertify.error('Please fill all the fields')
        }
    })

    //task update functions end 

    //task delete functions start
    $(document).on('click','#deleteListBtn',function(){
        let listId = $(this).attr('data-list-delete')
        let deleteModalId = $('#deleteListModal').attr('delete-list',`${listId}`)
    })
    $('#listDeleteForm').on('submit',(e) => {
        e.preventDefault()
        let listId = $('#deleteListModal').attr('delete-list')
        $.ajax({
            type:'post',
            url:`/delete-list/${projectId}/`,
            dataType:'json',
            data:{
                csrfmiddlewaretoken:csrftoken,
                list_id:listId
            },
            success:function(response){
                console.log(response)
                if(response.status === 'success'){
                    let total = response.total
                    
                    let table = $('#listTable').DataTable()
                    let deletedRow = table.row(`tr[data-list-id=${listId}]`).index()
                    table.row(deletedRow).remove().draw(false)
                    changeProjectTablePagination(table,total)
                    
                }
                alertify.set('notifier','position','top-right')
                alertify.error('List deleted!')
            },
        })
        $('#deleteListModal').modal('toggle')
    })


})

//function to hide pagination dynamically 
function changeProjectTablePagination(table,total){

        
    if(total > 10 ){
        $('#listTable_length').show()
        $('.pagination').show()
    }else{
        $('#listTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="listTable_length"]').on('change',() =>{
        console.log($('select[name="listTable_length').val())
        if(total > $('select[name="listTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}