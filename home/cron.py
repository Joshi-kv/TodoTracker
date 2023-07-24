from django.core.mail import EmailMessage
from core import settings
from . models import Todo,Notification
import datetime
from django.template.loader import get_template
from django.db.models import Q
from django.contrib.auth.models import User
from users.models import UserProfile

#function to schedule task to send pending task remainder
def update_pending_task() : 
    current_datetime = datetime.datetime.today()  
    users = User.objects.all()
    pending_tasks = None
    
    for user in users : 
        pending_tasks = Todo.objects.filter(user=user,task_duedate__lt=current_datetime,).exclude(Q(task_status='Completed') | Q(task_status="Pending"))
        if pending_tasks : 
            for pending_task in pending_tasks : 
                pending_task.task_status = 'Pending'
                pending_task.save()
                
                notification = Notification.objects.create(
                    user=pending_task.user,
                    task_title = pending_task.task_title,
                    task_description = pending_task.task_description,
                    task_duedate = pending_task.task_duedate,
                    
                )
            
                notification.save()
                
            context={
                'pending_tasks':pending_tasks
            }
            
            print(context)
            

            
            print('task pending')
            
            #sending pending task reminder to only notification enabled users
            if UserProfile.objects.filter(user=user,enable_notification=True) :
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
                # email.send()

