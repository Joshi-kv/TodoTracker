from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View
from core import settings
from users.models import UserProfile
from django.contrib.auth.mixins import LoginRequiredMixin
from . models import Todo,FAQ,Feedback
from django.contrib.auth.models import User
from django.core.mail import send_mail,EmailMessage
from newsapi import NewsApiClient
from datetime import timezone
# Create your views here.

class HomePageView(View) : 
    def get(self,request) : 
        try : 
            user_model = request.user
            current_user = UserProfile.objects.get(user=user_model)
            return render(request,'index.html',{'current_user':current_user})
        except : 
            return render(request,'index.html')
        
#view to show counts in dashboard
class DashBoardCountView(View) : 
    def get(self,request) : 
        user = request.user
        total_tasks = Todo.objects.filter(user=user).count()
        completed_tasks = Todo.objects.filter(user=user,task_status='Completed').count()
        # pending_tasks = Todo.objects.filter(user=user,task_status='Pending')
        print(total_tasks,completed_tasks,)
        context = {
            'total_tasks':total_tasks,
            'completed_tasks':completed_tasks,
            # 'pending_tasks':pending_tasks
        }
        return JsonResponse(context,safe=False)

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
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model)        
        return render(request, 'faq.html',{'current_user':current_user})
    
#view to fetch faq from admin
class FaqListView(View) : 
    def get(self,request) : 
        faqs = FAQ.objects.all().order_by('created_at')
        context = []
        for faq in faqs : 
            context.append({
                'faq_id':faq.id,
                'question':faq.question,
                'answer' : faq.answer,
            })
        return JsonResponse({'faqs':context})

#views to render feedback page
class FeedbackPageView(View) : 
    def get(self,request) : 
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model) 
        return render(request,'feedback.html',{'current_user':current_user})
    
#view to create feedback
class FeedbackCreateView(View) : 
    def post(self,request) : 
        feedback_username = request.POST.get('feedback_username')
        feedback_useremail = request.POST.get('feedback_useremail')
        feedback_subject = request.POST.get('feedback_subject')
        feedback_message = request.POST.get('feedback_message')
        
        new_feedback = Feedback.objects.create(
            user_name = feedback_username,
            user_email = feedback_useremail,
            subject = feedback_subject,
            message = feedback_message
            
        )
        
        new_feedback.save()
        
        #sending mail to admin 
        admin_user = User.objects.get(is_superuser=True)
        subject = f'New feedback from {feedback_username}'
        message = f'New feedback has been submitted by {feedback_username} \n\n {feedback_subject} \n\n {feedback_message}'
        from_mail = feedback_useremail
        to_mail = admin_user.email
        
        email = EmailMessage(
            subject,
            message,
            from_email=from_mail,
            to=[to_mail],
            reply_to=[from_mail]
        )
        
        email.send()
        return JsonResponse({'status':'created'})
    
#view to render newspage 
class NewsPageView(View) : 
    def get(self,request) : 
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model) 
        return render(request,'news.html',{'current_user':current_user})
    
#view to fetch news from newsapi
class NewsListView(View) : 
    def get(self,request) : 
        newsapi = NewsApiClient(api_key='38569bb4f68f42e7a30be5fea761e707')
        top_news = newsapi.get_top_headlines(sources='techcrunch')
        news = top_news['articles']
        return JsonResponse({'status':'success','news':news})
    