from django.core.mail import EmailMessage
from core import settings
from . models import Todo
import datetime
from django.template.loader import get_template
from django.db.models import Q
from django.contrib.auth.models import User

#function to schedule task to send pending task remainder
def update_pending_task() : 
    current_datetime = datetime.datetime.today()  
    users = User.objects.all()
    pending_tasks = None
    
    for user in users : 
        pending_tasks = Todo.objects.filter(user=user,task_duedate__lt=current_datetime,).exclude(Q(task_status='Completed'))
        if pending_tasks : 
            for pending_task in pending_tasks : 
                pending_task.task_status = 'Pending'
                pending_task.save()
            context={
                'pending_tasks':pending_tasks
            }
            subject = 'Pending task reminder'
            message = get_template('email.html').render(context)
            from_mail = settings.DEFAULT_FROM_EMAIL
            to_mail = user.email
            email = EmailMessage(
                subject,
                message,
                from_email=from_mail,
                to=[to_mail]
            )
            email.content_subtype = 'html'
            email.send()
            print('email send')
        print(pending_tasks)

