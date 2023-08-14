from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
# Create your models here.


#model for project 
class Project(models.Model):
    assignee = models.ManyToManyField(User,through='ProjectTeam')
    project_title = models.CharField(max_length=500)
    project_description = models.TextField()
    project_type = models.CharField(max_length=500)
    project_status = models.CharField(max_length=500)
    start_date = models.DateField()
    end_date = models.DateField()
    duration = models.CharField(max_length=256)
    estimated_hours = models.CharField(max_length=265)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.project_title}'


class ProjectTeam(models.Model):
    assignee = models.ForeignKey(User,on_delete=models.CASCADE)
    project = models.ForeignKey(Project,on_delete=models.CASCADE)
    
    def __str__(self) : 
        return f'{self.project} - {self.assignee}'

#model for todo
class Todo(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_duedate = models.DateField()
    task_status = models.CharField(max_length=100)
    task_priority = models.CharField(max_length=100)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.task_title}'
    
#model for sub tasks    
class SubTask(models.Model): 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    task = models.ForeignKey(Todo, on_delete=models.CASCADE)
    sub_task_title = models.CharField(max_length=256)
    sub_task_priority = models.CharField(max_length=150)
    sub_task_status = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.user} - {self.task} - {self.sub_task_title}'
    
class List(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    list_name = models.CharField(max_length=256)
    list_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.project} - {self.list_name}'
    
class Issue(models.Model):
    assignee = models.ForeignKey(User,on_delete=models.CASCADE)
    project = models.ForeignKey(Project,on_delete=models.CASCADE)
    list = models.ForeignKey(List, on_delete=models.CASCADE)
    issue_title = models.CharField(max_length=256)
    issue_description = models.TextField()
    issue_priority = models.CharField(max_length=150)
    issue_status = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) : 
        return f'{self.list} - {self.issue_title}'
    
class TaskAttachment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    task = models.ForeignKey(Todo, on_delete=models.CASCADE)
    attachment = models.FileField(upload_to='task-attachments/',blank=True,null=True)
    attachment_title = models.CharField(max_length=256)
    
    def __str__(self) : 
        return f'{self.user} - {self.task} - {self.attachment_title}'
class IssueAttachment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    attachment = models.FileField(upload_to='issue-attachments/',blank=True,null=True)
    attachment_title = models.CharField(max_length=256)
    
    def __str__(self) : 
        return f'{self.user} - {self.issue} - {self.attachment_title}'
    
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
    
    
#model for updates or announcements
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
    
#model for notifications
class Notification(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    task_title = models.CharField(max_length=500)
    task_description = models.TextField()
    task_duedate = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) : 
        return f'{self.user} - {self.task_title}'