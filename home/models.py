from django.db import models
from django.contrib.auth.models import User
# Create your models here.

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