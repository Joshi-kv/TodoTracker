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

    //filter in progress tasks
    var inprogressTaskFilterList = document.getElementById('inprogressTaskFilterList')
    inprogressTaskFilterList.onclick = function(e){
        let target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-inprogress-tasks',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){

                $('#inProgressTask').html(response.filtered_inprogress_task)
            }
        })
    }

    //filter upcoming tasks
    var upcomingTaskFilterList = document.getElementById('upcomingTaskFilterList')
   upcomingTaskFilterList.onclick = function(e){
        let target = getEventTarget(e)
        $.ajax({
            type:'get',
            url:'/filter-upcoming-tasks',
            dataType:'json',
            data:{
                'option':target.innerHTML
            },
            success:function(response){
                $('#upcomingTask').html(response.filtered_upcoming_task)
            }
        })
    }


        //filter total projects
        var totalProjectFilterList = document.getElementById('totalProjectFilterList')
        totalProjectFilterList.onclick = function(e){
            var target = getEventTarget(e)
            $.ajax({
                type:'get',
                url:'/filter-total-projects',
                dataType:'json',
                data:{
                    'option':target.innerHTML
                },
                success:function(response){
                    $('#totalProjects').html(response.filtered_total_project)
                }
            })
        }

        //filter completed projects
        var completedProjectFilterList = document.getElementById('completedProjectFilterList')
        completedProjectFilterList.onclick = function(e){
            var target = getEventTarget(e)
            $.ajax({
                type:'get',
                url:'/filter-completed-projects',
                dataType:'json',
                data:{
                    'option':target.innerHTML
                },
                success:function(response){
                    $('#completedProjects').html(response.filtered_completed_project)
                }
            })
        }

        //filter pending projects
        var pendingProjectFilterList = document.getElementById('pendingProjectFilterList')
        pendingProjectFilterList.onclick = function(e){
            var target = getEventTarget(e)
            $.ajax({
                type:'get',
                url:'/filter-pending-projects',
                dataType:'json',
                data:{
                    'option':target.innerHTML
                },
                success:function(response){
                    $('#pendingProjects').html(response.filtered_pending_project)
                }
            })
        }

        //filter on hold projects
        var onHoldProjectFilterList = document.getElementById('onHoldProjectFilterList')
        onHoldProjectFilterList.onclick = function(e){
            var target = getEventTarget(e)
            $.ajax({
                type:'get',
                url:'/filter-on-hold-projects',
                dataType:'json',
                data:{
                    'option':target.innerHTML
                },
                success:function(response){
                    $('#onHoldProjects').html(response.filtered_on_hold_project)
                }
            })
        }

        //filter canceled projects
        var canceledProjectFilterList = document.getElementById('canceledProjectFilterList')
        canceledProjectFilterList.onclick = function(e){
            var target = getEventTarget(e)
            $.ajax({
                type:'get',
                url:'/filter-canceled-projects',
                dataType:'json',
                data:{
                    'option':target.innerHTML
                },
                success:function(response){
                    $('#canceledProjects').html(response.filtered_canceled_project)
                }
            })
        }
})