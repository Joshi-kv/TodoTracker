from django.contrib import admin
from . models import Todo,FAQ

# Register your models here.
class TaskAdmin(admin.ModelAdmin) : 
    list_display = ['user','task_title','task_description','task_duedate','task_priority','task_status','created_date','updated_date']
    list_per_page = 10
    
admin.site.register(Todo,TaskAdmin)

class FaqAdmin(admin.ModelAdmin) : 
    list_display = ['question','answer']
    list_per_page = 10
    
admin.site.register(FAQ,FaqAdmin) 