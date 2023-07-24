$(document).ready(function() {
    function getEventTarget(e) {
        return e.target || e.srcElement; 
    }
    
    //filter total task
    var deactivatedTaskFilter = document.getElementById('deactivatedTaskFilter')
    deactivatedTaskFilter.onclick = function(e){
        var target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-deactivated-tasks',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#deactivatedTask').empty();
                $('#option').html(target.innerHTML);
                if(response.deactivated_tasks.length > 0){
                    response.deactivated_tasks.forEach((deactivatedTask,index) => {
                        let deactivatedTaskDiv = $('#deactivatedTask')
                        let deactivatedDate = moment(deactivatedTask.deactivated_date).format('DD/MM/YYYY')
                        let deactivatedTaskContent = 
                        `
                        <tr id=${deactivatedTask.task_id}>
                            <td>${index+1}</td>
                            <td>${deactivatedTask.task_title}</td>
                            <td>${deactivatedTask.task_description}</td>
                            <td>${deactivatedDate}</td>
                            <td>${deactivatedTask.task_status}</td>
                        </tr>
                        `
                        deactivatedTaskDiv.append(deactivatedTaskContent)
                        
                    })

                }else{
                    $('#deactivatedTaskHeading').hide()
                    let deactivatedTaskDiv = $('#deactivatedTask')
                    let deactivatedTaskContent =
                    `
                    <tr>
                        <td class="col-span-5 text-center">No deactivated task</td>
                    </tr>
                    
                    `
                    deactivatedTaskDiv.append(deactivatedTaskContent) 
                }
            }
        })
    }

    //clear filter
    $('#deactivatedTaskClearFilter').on('click',function(e) {
       $('#deactivatedTask').empty()
       $('#option').html('Recent')
       $('#deactivatedTaskHeading').show()
        const url = 'http://127.0.0.1:8000/deactivated-tasks/'
        fetch(url)
        .then(response => response.json())
        .then((data) => {
            if(data.deactivated_tasks.length > 0){
                data.deactivated_tasks.forEach((deactivatedTask,index) => {
                    let deactivatedTaskDiv = $('#deactivatedTask')
                    let deactivatedDate = moment(deactivatedTask.deactivated_date).format('DD/MM/YYYY')
                    let deactivatedTaskContent = 
                    `
                    <tr id=${deactivatedTask.task_id}>
                        <td>${index+1}</td>
                        <td>${deactivatedTask.task_title}</td>
                        <td>${deactivatedTask.task_description}</td>
                        <td>${deactivatedDate}</td>
                        <td>${deactivatedTask.task_status}</td>
                    </tr>
                    `
                    deactivatedTaskDiv.append(deactivatedTaskContent)
                })
            }
        })
    })
})