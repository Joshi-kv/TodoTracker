var projectId = document.getElementById("project-id").innerText;
    $(document).ready(function(){
      $('.select').chosen()

      $.validator.setDefaults({ ignore: ":hidden:not(.select)" })
      $('#assigneeAddForm').validate({
        rules:{
          projectNewAssignee:{
            required:true
          }
        },errorElement: "div",
        highlight: function(element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function(element) {
            $(element).removeClass('is-invalid')
        },
        errorPlacement: function(error, element) {
            error.addClass('text-danger');
            error.insertAfter(element);
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
      
      $('#assigneeAddForm').submit(function(e){
        e.preventDefault();
        let assignees = $('#projectNewAssignee').val()
        console.log(assignees)
        formData = new FormData()
        formData.append('csrfmiddlewaretoken',csrftoken)
        formData.append('project_id',projectId)
        formData.append('project_assignee', assignees)
        $.ajax({
          type: 'post',
          url:`/add-assignee/${projectId}/`,
          dataType: 'json',
          contentType: false,
          processData: false,
          beforeSend: function(xhr) {
              xhr.setRequestHeader('X-CSRFToken', csrftoken);
          },
          data:formData,
          success:function(response){
            if(response.status=='success'){
                $('#assignees').empty()
              response.new_assignees.forEach((assignee) => {
                console.log(assignee)
                $('#assignees').append(` <p class="ms-5" id="assignee-list">${assignee}</p>`)
              })  
            }
            $('#addAssigneeModal').modal('toggle')
            $('#projectNewAssignee').val('').trigger('chosen:updated')
            alertify.set('notifier','position','top-right')
            alertify.success('New assignees added to the project')
          }
        })
      })
      
      $('#close').click(function(){
        $('#projectNewAssignee').val('').trigger('chosen:updated')
      })
})