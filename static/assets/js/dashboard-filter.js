$(document).ready(function(){
    
    function getEventTarget(e) {
        return e.target || e.srcElement; 
    }
    
    //filter total task
    var totalTaskFilterList = document.getElementById('totalTaskFilterList')
    totalTaskFilterList.onclick = function(e){
        var target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-total-tasks',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#totalTask').html(response.filtered_total_task)
            }
        })
    }

    //filter completed task
    var completedTaskFilterList = document.getElementById('completedTaskFilterList')
    completedTaskFilterList.onclick = function(e) {
        var target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-completed-tasks',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#completedTask').html(response.filtered_complete_task)
            }
        })
    }

    //filter pending tasks
    var pendingTaskFilterList = document.getElementById('pendingTaskFilterList')
    pendingTaskFilterList.onclick = function(e){
        let target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-pending-tasks',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#pendingTask').html(response.filtered_pending_task)
            }
        })
    }
})