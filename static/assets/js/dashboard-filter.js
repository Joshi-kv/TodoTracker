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
})