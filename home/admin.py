from django.contrib import admin
from . models import Issue, IssueAttachment, List, ProjectTeam, Todo,FAQ,Feedback,ActivityLog,News,Updates,Notification,Project,TaskAttachment,SubTask


# Register your models here.

# class ProjectAdmin(admin.ModelAdmin) : 
#     list_display = ['project_title','project_description','assignees','start_date','end_date','project_type','project_status','duration','estimated_hours','created_at','updated_at']
#     list_per_page = 20
    
admin.site.register(Project)

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

class TaskAttachmentAdmin(admin.ModelAdmin):
    list_display = ['user','task','attachment']
admin.site.register(TaskAttachment,TaskAttachmentAdmin)

class IssueAttachmentAdmin(admin.ModelAdmin):
    list_display = ['user','issue','attachment']
admin.site.register(IssueAttachment,IssueAttachmentAdmin)

class SubTaskAdmin(admin.ModelAdmin):
    list_display = ['user','task','sub_task_title','sub_task_priority','sub_task_status','created_at','updated_at']
    list_per_page = 20
    
admin.site.register(SubTask, SubTaskAdmin)

class ListAdmin(admin.ModelAdmin) : 
    list_display = ['user','project','list_name','list_description','created_at','updated_at']
    list_per_page = 20
admin.site.register(List,ListAdmin)

class IssueAdmin(admin.ModelAdmin):
    list_display = ['assignee','project','list','issue_title','issue_description','issue_priority','issue_status']
    list_per_page = 20
    
admin.site.register(Issue,IssueAdmin)

class ProjectTeamAdmin(admin.ModelAdmin) : 
    list_display = ['assignee','project']
    list_per_page = 20
    
admin.site.register(ProjectTeam,ProjectTeamAdmin)