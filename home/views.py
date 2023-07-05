from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View
from users.models import UserProfile
from django.contrib.auth.mixins import LoginRequiredMixin
from . models import Todo
# Create your views here.

class HomePageView(View) : 
    def get(self,request) : 
        try : 
            user_model = request.user
            current_user = UserProfile.objects.get(user=user_model)
            return render(request,'index.html',{'current_user':current_user})
        except : 
            return render(request,'index.html')

#view to render todo page
class TodoPageView(LoginRequiredMixin,View) : 
    login_url = 'users:login'
    def get(self, request) : 
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model)
        return render(request, 'todo.html',{'current_user':current_user})
    
#view to list tasks
class TaskListView(View) : 
    def get(self,request) : 
        user_obj = request.user
        tasks = Todo.objects.filter(user=user_obj)
        context = []
        for task in tasks : 
            context.append({
                'task_id':task.id,
                'task_title':task.task_title,
                'task_description':task.task_description,
                'task_duedate':task.task_duedate,
                'task_priority':task.task_priority,
                'task_status':task.task_status
            })
        return JsonResponse({'tasks':context},safe=False)
    
#view to create todo 
class TodoCreateView(View) : 
    def post(self,request) : 
        user = request.user
        task_title = request.POST.get('task_title')
        task_description = request.POST.get('task_description')
        task_duedate = request.POST.get('task_duedate')
        task_status = request.POST.get('task_status')
        task_priority = request.POST.get('task_priority')
        
        #creating new task
        new_task = Todo.objects.create(
                    user=user,
                    task_title=task_title,
                    task_description=task_description,
                    task_duedate=task_duedate,
                    task_status=task_status,
                    task_priority=task_priority
                )
        new_task.save()
        context = {
            'task_id':new_task.id,
            'task_title':new_task.task_title,
            'task_description':new_task.task_description,
            'task_duedate':new_task.task_duedate,
            'task_status':new_task.task_status,
            'task_priority':new_task.task_priority
        }
        
        print(new_task.id)
        
        return JsonResponse({'status':'success','task':context})
    
#view to update page view
class UpdateTaskPageView(View) : 
    def get(self,request) : 
        task_id = request.GET.get('task_id')
        task = Todo.objects.get(id=task_id)
        print(task)
        context = {
            'task_id':task.id,
            'task_title':task.task_title,
            'task_description':task.task_description,
            'task_duedate':task.task_duedate,
            'task_status':task.task_status,
            'task_priority':task.task_priority
        }
        return JsonResponse({'task':context})
      
#view to update task
class UpdateTaskView(View) : 
    def post(self,request) : 
        task_id = request.POST.get('task_id')
        task_title = request.POST.get('task_title')
        task_description = request.POST.get('task_description')
        task_duedate = request.POST.get('task_duedate')
        task_priority = request.POST.get('task_priority')
        task_status = request.POST.get('task_status')
        

        
        task_update = Todo.objects.get(id=task_id)

        #updating task
        task_update.id = task_id
        task_update.task_title = task_title
        task_update.task_description = task_description
        task_update.task_duedate = task_duedate
        task_update.task_priority = task_priority 
        task_update.task_status = task_status
        task_update.save()
        
        context = {
            'task_id':task_update.id,
            'task_title':task_update.task_title,
            'task_description':task_update.task_description,
            'task_duedate':task_update.task_duedate,
            'task_priority':task_update.task_priority,
            'task_status':task_update.task_status,
        }
        return JsonResponse({'status':'updated','task':context})   
    
#view to delete task
class TaskDeleteView(View) : 
    def post(self,request) : 
        task_id = request.POST.get('task_id')
        
        task = Todo.objects.get(id=task_id)
        if task.user == request.user : 
            task.delete()
            return JsonResponse({'status':'success'})   
    
#view to render faq page
class FaqPageView(View) : 
    def get(self,request) : 
        return render(request,'faq.html')
    
#views to render feedback page

class FeedbackPageView(View) : 
    def get(self,request) : 
        return render(request,'feedback.html')
    
#view to render newspage 
class NewsPageView(View) : 
    def get(self,request) : 
        return render(request,'news.html')