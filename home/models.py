from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
# Create your models here.

#model for todo
class Todo(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_duedate = models.DateField()
    task_status = models.CharField(max_length=100)
    task_priority = models.CharField(max_length=100)
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
    user_name = models.CharField(max_length=256,blank=False)
    user_email = models.CharField(max_length=300,blank=False)
    subject = models.CharField(max_length=500,blank=False)
    message = models.TextField(blank=False)
    message_date = models.DateTimeField(auto_now_add=True,blank=False)
    
    def __str__(self) : 
        return f'{self.subject}'

#model to save activity log
class ActivityLog(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    activity = models.CharField(max_length=500)
    activity_date = models.DateField(auto_now_add=True)
    activity_time = models.TimeField(auto_now_add=True)

    def __str__(self) : 
        return f'{self.user} - {self.activity}'
    
#model for news
class News(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    description = models.TextField()
    category = models.CharField(max_length=256)
    news_image = models.ImageField(upload_to='news-images')
    slug = models.SlugField(max_length=500)
    published_date = models.DateField(auto_now_add=True)
    published_time = models.TimeField(auto_now_add=True)
    
    def get_absolute_url(self):
        return reverse("home:single-news", kwargs={"slug": self.slug})
    
    
    
    def __str__(self) : 
        return f'{self.user} - {self.title}'
    
    
#model for updated 
class Updates(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE) 
    title = models.CharField(max_length=500)
    description = models.TextField()
    slug = models.CharField(max_length=500)
    announcement_image = models.ImageField(upload_to='announcement-images')
    published_date = models.DateField(auto_now_add=True)
    published_time = models.TimeField(auto_now_add=True)
    
    def get_absolute_url(self):
        return reverse("home:updates", kwargs={"slug": self.slug})
    
    def __str__(self) : 
        return f'{self.user} - {self.title}'
    

class Notification(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_duedate = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) : 
        return f'{self.user} - {self.task_title}'