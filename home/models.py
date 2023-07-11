from django.db import models
from django.contrib.auth.models import User
# Create your models here.

#model for todo
class Todo(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_duedate = models.DateField()
    task_status = models.CharField(max_length=100)
    task_priority = models.CharField(max_length=10)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.task_title}'
    
#model for faq
class FAQ(models.Model) : 
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.question}'
 
#model for user feedback    
class Feedback(models.Model) : 
    user_name = models.CharField(max_length=256)
    user_email = models.CharField(max_length=300)
    subject = models.CharField(max_length=500)
    message = models.TextField()
    message_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) : 
        return f'{self.subject}'

#modal to save activity log
class ActivityLog(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    activity = models.CharField(max_length=500)
    activity_date = models.DateTimeField(auto_now_add=True)

    def __str__(self) : 
        return f'{self.user} - {self.activity}'