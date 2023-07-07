from django.core.mail import EmailMessage
from core import settings
from . models import Todo
import datetime

def update_pending_task() : 
    current_datetime = datetime.datetime.now()
    
    pending_task = Todo.objects.filter(task_duedate__lt=current_datetime,)
    
    # subject = 'Testing'
    # message = 'Testing apscheduler'
    # from_mail = settings.DEFAULT_FROM_EMAIL
    # to_mail = 'joshikoithanath40@gmail.com'
    
    # email = EmailMessage(
    #     subject,
    #     message,
    #     from_email=from_mail,
    #     to=[to_mail]
    # )
    print('Mail send')
    # email.send()