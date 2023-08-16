let pathname = window.location.href.replace(/\/+$/, '');
let project_id = pathname.substring(pathname.lastIndexOf('/') +1 )

$(document).ready(() =>{


    // fetching tasks on page load
    const url = `http://127.0.0.1:8000/project/lists-display/${project_id}/`
    fetch(url)
    .then(response => response.json())
    .then((data) => {
        table = $('#listTable').DataTable({
            "ordering":false
        })
        console.log(data)
        hidePagination(table,table.rows().count())
        data.lists.forEach((list) =>{
            if(list.is_staff == true){
                console.log(list)
                let listId = list.list_id
                let listRow = table.row.add([
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
                ]).node()
                $(listRow).attr('data-list-id',listId)
                table = $('#listTable').DataTable();
                table.draw()
                taskLength = data.lists.length
                hidePagination(table,taskLength)
            }else{
                console.log(list)
                let listId = list.list_id
                let listRow = table.row.add([
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
                ]).node()
                $(listRow).attr('data-list-id',listId)
                table = $('#listTable').DataTable();
                table.draw()
                taskLength = data.lists.length
                hidePagination(table,taskLength)
            }         

        })
    
        //dynamically hiding pagination on search results
        table.on('search.dt',function(){
            hidePagination(table,table.rows({search:'applied'}).count())
        })
    })

})





//function to hide pagination dynamically 
function hidePagination(table,tasks){
    if(tasks > 10 ){
        $('#listTable_length').show()
        $('.pagination').show()
    }else{
        $('#listTable_length').hide()
        $('.pagination').hide()
    }

    $('select[name="listTable_length"]').on('change',() =>{
        if(tasks > $('select[name="listTable_length"]').val() ){
            $('.pagination').show()
        }else{
            $('.pagination').hide()
        }
    })
    
}





