from django.contrib import admin
from . models import Todo,FAQ,Feedback,ActivityLog,News,Updates,Notification


# Register your models here.
class TaskAdmin(admin.ModelAdmin) : 
    list_display = ['user','task_title','task_description','task_duedate','task_priority','task_status','created_date','updated_date']
    list_per_page = 10
    
admin.site.register(Todo,TaskAdmin)

class FaqAdmin(admin.ModelAdmin) : 
    list_display = ['question','answer','created_at','updated_at']
    list_per_page = 10
    
admin.site.register(FAQ,FaqAdmin) 


class FeedbackAdmin(admin.ModelAdmin) : 
    list_display = ['user_name','user_email','subject','message','message_date']
    list_per_page = 20
    
admin.site.register(Feedback,FeedbackAdmin)

#activity log admin 
class ActivityLogAdmin(admin.ModelAdmin) : 
    list_display = ['user','activity','activity_date','activity_time']
    list_per_page = 20
    
admin.site.register(ActivityLog,ActivityLogAdmin)

#news model admin
class NewsAdmin(admin.ModelAdmin) : 
    list_display = ['user','title','category','description','slug','published_date','published_time']
    list_per_page = 20
    prepopulated_fields = {'slug':('title',)}
admin.site.register(News,NewsAdmin)

#updates model admin
class UpdatesAdmin(admin.ModelAdmin) : 
    list_display = ['user','title','description','slug','published_date','published_time']
    list_per_page = 20
    prepopulated_fields = {'slug':('title',)}
admin.site.register(Updates,UpdatesAdmin)
    

class NotificationAdmin(admin.ModelAdmin) : 
    list_display = ['user','task_title','task_description','task_duedate']
    
admin.site.register(Notification,NotificationAdmin)