from django.core.mail import EmailMessage
from core import settings
from . models import Todo
import datetime
from django.template.loader import get_template
from django.template import Context
from django.db.models import Q

#function to schedule task to send pending task remainder
def update_pending_task() : 
    current_datetime = datetime.datetime.today()  
    pending_tasks = Todo.objects.filter(task_duedate__lt=current_datetime,).exclude(Q(task_status='Completed'))
    print(pending_tasks)
    

    pending_task_user = []
    pending_task_user_email = []
    pending_task_titles = []
    
    #looping through pending tasks
    for pending_task in pending_tasks : 
        #changing task status to pending
        pending_task.task_status = 'Pending'
        pending_task.save()
        pending_task_user.append(pending_task.user)
        pending_task_user_email.append(pending_task.user.email)
        pending_task_titles.append(pending_task.task_title)
        
    #removing duplicate mail using set
    pending_task_user_email = set(pending_task_user_email)
    to_mail = list(pending_task_user_email)
    print(to_mail)
    # for i in pending_tasks : 
    #     print(i)
        
    context = {
        'pending_tasks':pending_tasks
    }
    
  
    # subject = 'Pending task reminder'
    # message = get_template('email.html').render(context)
    # from_mail = settings.DEFAULT_FROM_EMAIL
    # to_mail = 'joshikoithanath40@gmail.com'
    
    # email = EmailMessage(
    #     subject,
    #     message,
    #     from_email=from_mail,
    #     to=[to_mail]
    # )
    # email.content_subtype = 'html'
    # email.send()