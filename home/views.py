from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View
from users.models import UserProfile
from django.contrib.auth.mixins import LoginRequiredMixin
from . models import Todo,FAQ,Feedback,ActivityLog,News,Updates,Notification
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.template.loader import get_template
from datetime import date
from django.utils.text import slugify

class HomePageView(LoginRequiredMixin,View) :
    login_url = 'users:login' 
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
        total_tasks = Todo.objects.filter(user=user).exclude(task_status='Deactivated').count()
        completed_tasks = Todo.objects.filter(user=user,task_status='Completed').count() 
        upcoming_tasks = Todo.objects.filter(user=user,task_status='Upcoming').count()
        in_progress_tasks = Todo.objects.filter(user=user,task_status='In progress').count()
        
        
        pending_tasks = Todo.objects.filter(user=user,task_status='Pending').count()
        context = {
            'total_tasks':total_tasks,
            'completed_tasks':completed_tasks,
            'pending_tasks':pending_tasks,
            'in_progress_tasks':in_progress_tasks,
            'upcoming_tasks':upcoming_tasks
        }
        return JsonResponse(context,safe=False)
    
#view to list peding tasks notifications
class PendingTasksNotificationView(View):
    def get(self,request) : 
        user = request.user
        notification_count = Notification.objects.filter(user=user).count()
        
        notifications = Notification.objects.filter(user=user).order_by('-created_at','-created_at__time')
        
        context = []
        
        for notification in notifications :
            context.append({
                'task_title': notification.task_title,
                'task_description': notification.task_description,
                'task_duedate': notification.task_duedate
            })
        
        return JsonResponse({'status':'success','notifications':context,'notification_count':notification_count})
    
#view for clear all notification 
class ClearAllNotifications(View) :
    def get(self,request) :
        user = request.user 
        notifications =  Notification.objects.all().filter(user=user)
        notifications.delete()
        return JsonResponse({'status':'success',})

#view to show dashboard task
class DashboardTaskView(View) : 
    def get(self,request) : 
        user = request.user
        tasks = Todo.objects.filter(user=user).exclude(task_status='Deactivated').order_by('-created_date','-updated_date')[:5]
        
        context = []
        
        for task in tasks : 
            context.append({
                'title':task.task_title,
                'description':task.task_description,
                'duedate':task.task_duedate,
                'status':task.task_status
            })
        return JsonResponse({'status':'success','tasks':context})

#view to filter total tasks
class TotalTaskFilterView(View) : 
    def get(self,request) :
         
        user = request.user
        filter_option = request.GET.get('option')
        
        current_date = date.today()
        
        #filtering 
        if filter_option == 'Today' : 
            filtered_total_tasks = Todo.objects.filter(user=user,created_date__day=current_date.day,created_date__year=current_date.year).exclude(task_status='Deactivated').count()
            return JsonResponse({'status':'success','filtered_total_task':filtered_total_tasks})
        elif filter_option == 'This Month' : 
            filtered_total_tasks = Todo.objects.filter(user=user,created_date__month=current_date.month,created_date__year=current_date.year).exclude(task_status='Deactivated').count()
            return JsonResponse({'status':'success','filtered_total_task':filtered_total_tasks})
        elif filter_option == 'This Year' : 
            filtered_total_tasks = Todo.objects.filter(user=user,created_date__year=current_date.year).exclude(task_status='Deactivated').count()
            return JsonResponse({'status':'success','filtered_total_task':filtered_total_tasks})
        else :
            filtered_total_tasks = Todo.objects.filter(user=user).exclude(task_status='Deactivated').count()
            return JsonResponse({'status':'success','filtered_total_task':filtered_total_tasks})
        
#view to filter completed tasks
class FilterCompletedTaskView(View) : 
    def get(self,request) : 
        current_date = date.today()
        user = request.user
        filter_option = request.GET.get('option')
        
        #filtering completed tasks
        if filter_option == 'Today' : 
            filtered_complete_tasks = Todo.objects.filter(user=user,task_status='Completed',updated_date__day=current_date.day,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_complete_task':filtered_complete_tasks})
        elif filter_option == 'This Month' : 
            filtered_complete_tasks = Todo.objects.filter(user=user,task_status='Completed',updated_date__month=current_date.month,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_complete_task':filtered_complete_tasks})
        elif filter_option == 'This Year' :
            filtered_complete_tasks = Todo.objects.filter(user=user,task_status='Completed',updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_complete_task':filtered_complete_tasks})
        else : 
            filtered_complete_tasks = Todo.objects.filter(user=user,task_status='Completed').count()
            return JsonResponse({'status':'success','filtered_complete_task':filtered_complete_tasks})

#view to filter pending tasks
class FilterPendingTaskView(View) : 
    def get(self,request) : 
        user = request.user
        filter_option = request.GET.get('option')
        current_date = date.today()
        
        #filtering 
        if filter_option == 'Today' : 
            filtered_pending_tasks = Todo.objects.filter(user=user,task_status='Pending',updated_date__day=current_date.day,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_pending_task':filtered_pending_tasks})
        elif filter_option == 'This Month' : 
            filtered_pending_tasks = Todo.objects.filter(user=user,task_status='Pending',updated_date__month=current_date.month,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_pending_task':filtered_pending_tasks})
        elif filter_option == 'This Year' : 
            filtered_pending_tasks = Todo.objects.filter(user=user,task_status='Pending',updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_pending_task':filtered_pending_tasks})
        else : 
            filtered_pending_tasks = Todo.objects.filter(user=user,task_status='Pending',).count()
            return JsonResponse({'status':'success','filtered_pending_task':filtered_pending_tasks})   

#view to filter in progress tasks
class FilterInProgressTaskView(View) : 
    def get(self,request) : 
        user = request.user
        filter_option = request.GET.get('option')
        current_date = date.today()
        
        #filtering 
        if filter_option == 'Today' : 
            filtered_inprogress_tasks = Todo.objects.filter(user=user,task_status='In progress',updated_date__day=current_date.day,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_inprogress_task':filtered_inprogress_tasks})
        elif filter_option == 'This Month' : 
            filtered_inprogress_tasks = Todo.objects.filter(user=user,task_status='In progress',updated_date__month=current_date.month,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_inprogress_task':filtered_inprogress_tasks})
        elif filter_option == 'This Year' : 
            filtered_inprogress_tasks = Todo.objects.filter(user=user,task_status='In progress',updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_inprogress_task':filtered_inprogress_tasks})
        else : 
            filtered_inprogress_tasks = Todo.objects.filter(user=user,task_status='In progress',).count()
            return JsonResponse({'status':'success','filtered_inprogress_task':filtered_inprogress_tasks})   

#view to filter upcoming tasks
class FilterUpcomingTaskView(View) : 
    def get(self,request) : 
        user = request.user
        filter_option = request.GET.get('option')
        current_date = date.today()
        
        #filtering 
        if filter_option == 'Today' : 
            filtered_upcoming_tasks = Todo.objects.filter(user=user,task_status='Upcoming',updated_date__day=current_date.day,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_upcoming_task':filtered_upcoming_tasks})
        elif filter_option == 'This Month' : 
            filtered_upcoming_tasks = Todo.objects.filter(user=user,task_status='Upcoming',updated_date__month=current_date.month,updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_upcoming_task':filtered_upcoming_tasks})
        elif filter_option == 'This Year' : 
            filtered_upcoming_tasks = Todo.objects.filter(user=user,task_status='Upcoming',updated_date__year=current_date.year).count()
            return JsonResponse({'status':'success','filtered_upcoming_task':filtered_upcoming_tasks})
        else : 
            filtered_upcoming_tasks = Todo.objects.filter(user=user,task_status='Upcoming',).count()
            return JsonResponse({'status':'success','filtered_upcoming_task':filtered_upcoming_tasks})   
        
#view to render activity log
class ActivityLogView(View) : 
    def get(self,request) : 
        user = request.user
        current_date = date.today()
        activity_logs = ActivityLog.objects.filter(user=user,activity_date=current_date).order_by('-activity_date','-activity_time')[:6]
        if activity_logs.count() < 6 : 
            activity_logs = ActivityLog.objects.filter(user=user).order_by('-activity_date','-activity_time')[:6]
        context = []
        for activity_log in activity_logs : 
            context.append({
                'activity':activity_log.activity,
                'activity_date':activity_log.activity_date,
                'activity_time':activity_log.activity_time
            })
        return JsonResponse({'status':'success','activity':context})
    
#view to filter recent activities 
class FilterRecentActivityView(View) : 
    def get(self,request) : 
        current_date = date.today()
        current_day = current_date.day
        current_month = current_date.month
        current_year = current_date.year
        
        user = request.user
        filter_option = request.GET.get('option')
        
        #condition checking for filter 
        if filter_option == 'Today' : 
            filtered_recent_logs = ActivityLog.objects.filter(user=user,activity_date__day=current_day,activity_date__year=current_year).order_by('-activity_date','-activity_time')
            context = []
            for filtered_recent_log in filtered_recent_logs : 
                context.append({
                    'activity':filtered_recent_log.activity,
                    'activity_date':filtered_recent_log.activity_date,
                    'activity_time':filtered_recent_log.activity_time
                })
            return JsonResponse({'status':'success','filtered_recent_logs':context})
        
        elif filter_option == 'This Month' : 
            filtered_recent_logs = ActivityLog.objects.filter(user=user,activity_date__month=current_month,activity_date__year=current_year).order_by('-activity_date','-activity_time')
            context = []
            for filtered_recent_log in filtered_recent_logs : 
                context.append({
                    'activity':filtered_recent_log.activity,
                    'activity_date':filtered_recent_log.activity_date,
                    'activity_time':filtered_recent_log.activity_time
                })
            return JsonResponse({'status':'success','filtered_recent_logs':context})
        
        elif filter_option == 'This Year' : 
            filtered_recent_logs = ActivityLog.objects.filter(user=user,activity_date__year=current_year).order_by('-activity_date','-activity_time')
            context = []
            for filtered_recent_log in filtered_recent_logs : 
                context.append({
                    'activity':filtered_recent_log.activity,
                    'activity_date':filtered_recent_log.activity_date,
                    'activity_time':filtered_recent_log.activity_time
                })
            return JsonResponse({'status':'success','filtered_recent_logs':context})
    
#view to filter dasboardTask
class FilterDashboardTaskView(View) : 
    def get(self,request) : 
        current_date = date.today()
        current_day = current_date.day
        current_month = current_date.month
        current_year = current_date.year
        
        user = request.user
        filter_option = request.GET.get('option')
        
        #condition checking for filter 
        if filter_option == 'Today' : 
            tasks =Todo.objects.filter(user=user,created_date__day=current_day,created_date__year=current_year).exclude(task_status='Deactivated').order_by('-created_date')
            context = []
            for task in tasks : 
                context.append({
                    'title':task.task_title,
                    'description':task.task_description,
                    'duedate':task.task_duedate,
                    'status':task.task_status
                })
            return JsonResponse({'status':'success','tasks':context})
        
        elif filter_option == 'This Month' : 
            tasks =Todo.objects.filter(user=user,created_date__month=current_month,created_date__year=current_year).exclude(task_status='Deactivated').order_by('-task_duedate__day','-task_duedate__month')
            context = []
            for task in tasks : 
                context.append({
                    'title':task.task_title,
                    'description':task.task_description,
                    'duedate':task.task_duedate,
                    'status':task.task_status
                })
            return JsonResponse({'status':'success','tasks':context})
        
        
        elif filter_option == 'This Year' : 
            tasks =Todo.objects.filter(user=user,created_date__year=current_year).exclude(task_status='Deactivated').order_by('-task_duedate__day','-task_duedate__month')
            context = []
            for task in tasks : 
                context.append({
                    'title':task.task_title,
                    'description':task.task_description,
                    'duedate':task.task_duedate,
                    'status':task.task_status
                })
            return JsonResponse({'status':'success','tasks':context})
        else : 
            tasks =Todo.objects.filter(user=user,created_date__year=current_year).exclude(task_status='Deactivated').order_by('-task_duedate__day','-task_duedate__month')
            context = []
            for task in tasks : 
                context.append({
                    'title':task.task_title,
                    'description':task.task_description,
                    'duedate':task.task_duedate,
                    'status':task.task_status
                })
            return JsonResponse({'status':'success','tasks':context})
        
        
#news dashboard view
class NewsDashboardView(View) : 
    def get(self,request) : 
        user = request.user.id
        news_obj = News.objects.filter(category='Featured').exclude(user=user).order_by('-published_date','-published_time')[:5]
        context = []
        
        for news in news_obj : 
            context.append({
                'news_title':news.title,
                'news_slug':news.slug,
                'news_description':news.description,
                'news_image' : news.news_image.url,
            })    
        return JsonResponse({'status':'success','news':context})
    
#view to filter news
class FilterNewsView(View) : 
    def get(self,request) : 
        user = request.user.id
        current_date = date.today()
        current_day = current_date.day
        current_month = current_date.month
        current_year = current_date.year
        
        user = request.user
        filter_option = request.GET.get('option')
        
        #condition checking for filter 
        if filter_option == 'Today' : 
            news_obj = News.objects.filter(published_date__day=current_day,published_date__year=current_year).exclude(user=user).order_by('-published_date','-published_time')
            context = []
            for news in news_obj : 
                context.append({
                    'news_title':news.title,
                    'news_description':news.description,
                    'news_slug':news.slug,
                    'news_image':news.news_image.url
                })
            return JsonResponse({'status':'success','news':context})
        
        elif filter_option == 'This Month' : 
            news_obj = News.objects.filter(published_date__month=current_month,published_date__year=current_year).exclude(user=user).order_by('-published_date','-published_time')
            context = []
            for news in news_obj : 
                context.append({
                    'news_title':news.title,
                    'news_description':news.description,
                    'news_slug':news.slug,
                    'news_image':news.news_image.url
                })
            return JsonResponse({'status':'success','news':context})
        
        elif filter_option == 'This Year' : 
            news_obj = News.objects.filter(published_date__year=current_year).exclude(user=user).order_by('-published_date','-published_time')
            context = []
            for news in news_obj : 
                context.append({
                    'news_title':news.title,
                    'news_description':news.description,
                    'news_slug':news.slug,
                    'news_image':news.news_image.url
                })
            return JsonResponse({'status':'success','news':context})
        else :
            news_obj = News.objects.all().exclude(user=user).order_by('-published_date','-published_time')
            context = []
            for news in news_obj : 
                context.append({
                    'news_title':news.title,
                    'news_description':news.description,
                    'news_slug':news.slug,
                    'news_image':news.news_image.url
                })
            return JsonResponse({'status':'success','news':context})

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
        tasks = Todo.objects.filter(user=user_obj).order_by('task_duedate__month','task_duedate__day').exclude(task_status='Deactivated')   
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
        
        activity_log = ActivityLog.objects.create(
            user = user,
            activity=f'"{task_title}" task added'
        )
        activity_log.save()
        
        total_tasks = Todo.objects.filter(user=user).count()
        return JsonResponse({'status':'success','task':context,'total':total_tasks})
    

#date range filter 
class DateRangeFilter(View) : 
    def get(self,request) : 
        user = request.user
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        tasks = Todo.objects.filter(user=user,task_duedate__range=(start_date,end_date))
        context = []
        for task in tasks : 
            context.append({
                'task_id':task.id,
                'task_title':task.task_title,
                'task_descritpion':task.task_description,
                'task_duedate':task.task_duedate,
                'task_priority':task.task_priority,
                'task_status':task.task_status,
            })
        
        return JsonResponse({'status':'success','tasks':context})
    
#view to update page view
class UpdateTaskPageView(View) : 
    def get(self,request) : 
        task_id = request.GET.get('task_id')
        task = Todo.objects.get(id=task_id)
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
        
        if task_status == 'Completed' : 
            activity_log = ActivityLog.objects.create(
            user = request.user,
            activity = f' "{task_title}" task completed'
            )
        
            activity_log.save()
        else : 
            activity_log = ActivityLog.objects.create(
                user = request.user,
                activity = f' "{task_title}" task updated'
            )
            
            activity_log.save()
        
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
            task.task_status = 'Deactivated'
            task.save()
            
            activity_log = ActivityLog.objects.create(
                user = request.user,
                activity = f' "{task.task_title}" task deactivated'
            )
            activity_log.save()
            total_tasks = Todo.objects.filter(user=task.user).exclude(task_status='Deactivated').count()
            return JsonResponse({'status':'success','total_tasks':total_tasks})   
    
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
        
        if feedback_username and feedback_useremail and feedback_message and feedback_subject != None : 
            
        
            new_feedback = Feedback.objects.create(
                user_name = feedback_username,
                user_email = feedback_useremail,
                subject = feedback_subject,
                message = feedback_message
                
            )
            
            new_feedback.save()
        
            context = {
                'feedback_username':feedback_username,
                'feedback_subject':feedback_subject,
                'feedback_message':feedback_message
            }
            
            #sending mail to admin 
            admin_user = User.objects.get(is_superuser=True)
            subject = f'{feedback_subject} - {feedback_username}'
            message = get_template('feedback-email.html').render(context)
            from_mail = feedback_useremail
            to_mail = admin_user.email
            
            email = EmailMessage(
                subject,
                message,
                from_email=from_mail,
                to=[to_mail],
                reply_to=[from_mail]
            )
            email.content_subtype = 'html'
            email.send()
            
            activity_log = ActivityLog.objects.create(
                user = request.user,
                activity = 'Feedback submitted'
            )
            
            activity_log.save()
            
            return JsonResponse({'status':'created'})
        else : 
            print('empty')
            return JsonResponse({'error':'Form fields are empty'})
    
#view to render newspage 
class MainNewsPageView(View) : 
    def get(self,request) : 
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model) 
        return render(request,'news.html',{'current_user':current_user})
    

    
# #view to fetch news from newsapi
class NewsListView(View) : 
    def get(self,request) : 
        user = request.user  
        news_obj = News.objects.all().exclude(user=user).order_by('-published_date','-published_time')
        all_news = []
        for news in news_obj : 
            all_news.append({
                'author':news.user.username,
                'news_title':news.title,
                'news_image':news.news_image.url,
                'news_slug':news.slug,
                'news_category':news.category,
                'news_description':news.description,
                'published_on':news.published_date,
                'published_time':news.published_time
            })
        return JsonResponse({'status':'success','news':all_news})

#view to render announcement page
class AnnouncementPageView(View) : 
    def get(self,request) :
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model) 
        return render(request,'announcements.html',{'current_user':current_user})
    
#view to fetch announcements
class AnnouncementListView(View) : 
    def get(self,request) : 
        announcement_obj = Updates.objects.all().order_by('-published_date','-published_time')
        context = []
        for announcement in announcement_obj : 
            context.append({
                'author':announcement.user.username,
                'announcement_title':announcement.title,
                'announcement_description':announcement.description,
                'announcement_image':announcement.announcement_image.url,
                'announcement_slug':announcement.slug,
                'published_date':announcement.published_date,
                'published_time':announcement.published_time
            })
        return JsonResponse({'status':'success',"announcements":context})
    
#view to render my news page 
class MyNewsPageView(View) :
    def get(self,request) :
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model)  
        return render(request,'my-news.html',{'current_user':current_user})


#view to create news 
class CreateNewsView(View) : 
    def post(self,request) : 
        user = request.user
        news_title = request.POST.get('news_title')
        news_image = request.FILES.get('news_image')
        news_description = request.POST.get('news_description')
        news_category = request.POST.get('news_category')
        news_slug = slugify(news_title)
        
        news = News.objects.create(
            user = user,
            title = news_title,
            category = news_category,
            news_image = news_image,
            description = news_description,
            slug = news_slug
        )
        news.save()
        
        context = {
            'news_id':news.id,
            'author':news.user.username,
            'news_title':news.title,
            'news_image':news.news_image.url,
            'news_slug':news.slug,
            'news_description':news.description,
            'news_category':news.category,
            'published_on':news.published_date,
            'published_time':news.published_time
        }

        return JsonResponse({'status':'success','news':context})

#view to fetch my news 
class MyNewsListView(View) : 
    def get(self,request) : 
        user = request.user 
        my_news = News.objects.filter(user=user).order_by('-published_date','-published_time')
        context = []
        for news in my_news : 
            
            context.append({
                'news_id':news.id,
                'author':news.user.username,
                'news_title':news.title,
                'news_slug':news.slug,
                'news_image':news.news_image.url,
                'news_description':news.description,
                'published_on':news.published_date,
                'published_time':news.published_time
            })
        return JsonResponse({'status':'success','news':context})
    
#view to render single news
def single_news_page(request,slug) : 
    if slug != None : 
        news = News.objects.get(slug=slug)
    return render(request,'single-news.html',{'news':news})
    
#view to render single announcement
def single_announcement_page(request,slug) : 
    if slug != None : 
        announcement = Updates.objects.get(slug=slug)
    return render(request,'single-announcement.html',{'announcement':announcement})

#view to update news 
class NewsUpdatePageView(View) : 
    def get(self,request) : 
        user = request.user 
        news_id = request.GET.get('news_id')
        news = News.objects.get(id=news_id,user=user)
        context = {
            'news_id':news.id,
            'author':news.user.username,
            'news_title':news.title,
            'news_image':news.news_image.url,
            'news_category':news.category,
            'news_description':news.description,
        }
        return JsonResponse({'status':'success','news':context})

class NewsUpdateView(View) : 
    def post(self,request) : 
        user = request.user,
        news_id = request.POST.get('news_id')
        news = News.objects.get(id=news_id,)
        if request.FILES.get('news_image') == None : 
            news_title = request.POST.get('news_title')
            news_description = request.POST.get('news_description')
            news_image = news.news_image
            news_category = request.POST.get('news_category')

            news_slug = slugify(news_title)            
            news.title = news_title
            news.slug = news_slug
            news.news_image = news_image
            news.description = news_description
            news.category = news_category
            news.save()
            
        else : 
            news_title = request.POST.get('news_title')
            news_description = request.POST.get('news_description')
            news_image = request.FILES.get('news_image')
            news_category = request.POST.get('news_category')
        
        
            news_slug_split = news_title.split(' ')
            news_slug ='-'.join(news_slug_split)
        
            
            news.title = news_title
            news.slug = news_slug
            news.news_image = news_image
            news.description = news_description
            news.category = news_category
            news.save()
        
        context = {
            'news_title':news.title,
            'news_slug':news.slug,
            'news_description':news.description,
            'news_category':news.category,
            'news_image':news.news_image.url,
        }
        
        
        return JsonResponse({'status':'success','news':context})
    
#view to delete news 
class NewsDeleteView(View) : 
    def post(self,request) : 
        user = request.user 
        news_id = request.POST.get('news_id')
        news = News.objects.get(id=news_id)
        news.delete()

        return JsonResponse({'status':'success'})
    
#view for all news search
class AllNewsSearchView(View) : 
    def get(self,request) : 
        user = request.user
        query = request.GET.get('query')
        news_obj= News.objects.filter(title__icontains=query,).exclude(user=user)
        news_results = []
        for news in news_obj : 
            news_results.append({
                'author':news.user.username,
                'news_title':news.title,
                'news_slug':news.slug,
                'news_image':news.news_image.url,
                'published_on':news.published_date,
                'published_time':news.published_time
            })
        return JsonResponse({'status':'success','news':news_results})
        
#view for announcement search
class announcementSearchView(View) : 
    def get(self,request) : 
        user = request.user
        query = request.GET.get('query')
        announcement_obj= Updates.objects.filter(title__icontains=query,)
        announcement_results = []
        for announcement in announcement_obj : 
            announcement_results.append({
                'author':announcement.user.username,
                'announcement_title':announcement.title,
                'announcement_slug':announcement.slug,
                'announcement_image':announcement.announcement_image.url,
                'published_on':announcement.published_date,
                'published_time':announcement.published_time
            })
        return JsonResponse({'status':'success','announcements':announcement_results})
    
#view for my search
class MyNewsSearchView(View) : 
    def get(self,request) : 
        user = request.user
        query = request.GET.get('query')
        news_obj= News.objects.filter(title__icontains=query,user=user)
        news_results = []
        for news in news_obj : 
            news_results.append({
                'news_id':news.id,
                'author':news.user.username,
                'news_title':news.title,
                'news_slug':news.slug,
                'news_image':news.news_image.url,
                'published_on':news.published_date,
                'published_time':news.published_time
            })
        return JsonResponse({'status':'success','news':news_results})

#my news filter       
class AllNewsFilter(View):
    def get(self, request):
        user = request.user.id
        filter_category = request.GET.get('filterCategory')
        filter_by = request.GET.get('filterBy')
        filter_by_month = request.GET.get('filterByMonth')
        filter_by_year = request.GET.get('filterByYear')

        current_date = date.today()
        filtered_all_news = News.objects.all().exclude(user=user).order_by('-published_date', '-published_time')

        if filter_category and filter_category != 'All':
            filtered_all_news = filtered_all_news.filter(category=filter_category)

        if filter_by_month and filter_by_month != '' : 
            filtered_all_news = filtered_all_news.filter(published_date__month=filter_by_month)
        
        if filter_by_year and filter_by_year != '' : 
            filtered_all_news = filtered_all_news.filter(published_date__year=filter_by_year)

        if filter_by == 'Today':
            filtered_all_news = filtered_all_news.filter(published_date__day=current_date.day, published_date__year=current_date.year).order_by('-published_date', '-published_time')
        elif filter_by == 'This Month':
            filtered_all_news = filtered_all_news.filter(published_date__month=current_date.month, published_date__year=current_date.year).order_by('-published_date', '-published_time')
        elif filter_by == 'This Year':
            filtered_all_news = filtered_all_news.filter(published_date__year=current_date.year).order_by('-published_date', '-published_time')

        result = []
        for news in filtered_all_news:
            result.append({
                'news_id': news.id,
                'author': news.user.username,
                'news_title': news.title,
                'news_slug': news.slug,
                'news_image': news.news_image.url,
                'published_on': news.published_date,
                'published_time': news.published_time
            })

        return JsonResponse({'status': 'success', 'result': result})

#announcement filterby filter
class AnnouncementFilterByFilter(View) : 
    def get(self,request) : 
        user = request.user.id,
        filter_option = request.GET.get('filter_option')
        current_date = date.today()
        
        if filter_option == 'Today' : 
            filterby_filtered_annnouncement = Updates.objects.all().filter(published_date__day=current_date.day,published_date__year=current_date.year).order_by('-published_date','-published_time')
            result = []
            for announcement in filterby_filtered_annnouncement  : 
                result.append({
                    'announcement_id':announcement.id,
                    'author':announcement.user.username,
                    'announcement_title':announcement.title,
                    'announcement_slug':announcement.slug,
                    'announcement_image':announcement.announcement_image.url,
                    'published_on':announcement.published_date,
                    'published_time':announcement.published_time
                })
            return JsonResponse({'status':'success','result':result})
        elif filter_option == 'This Month' :
            filterby_filtered_annnouncement  = Updates.objects.all().filter(published_date__month=current_date.month,published_date__year=current_date.year).order_by('-published_date','-published_time')
            result = []
            for announcement in filterby_filtered_annnouncement  : 
                result.append({
                    'announcement_id':announcement.id,
                    'author':announcement.user.username,
                    'announcement_title':announcement.title,
                    'announcement_slug':announcement.slug,
                    'announcement_image':announcement.announcement_image.url,
                    'published_on':announcement.published_date,
                    'published_time':announcement.published_time
                })
            return JsonResponse({'status':'success','result':result})
        elif filter_option == 'This Year' : 
            filterby_filtered_annnouncement  = Updates.objects.all().filter(published_date__year=current_date.year).order_by('-published_date','-published_time')
            result = []
            for announcement in filterby_filtered_annnouncement  : 
                result.append({
                    'announcement_id':announcement.id,
                    'author':announcement.user.username,
                    'announcement_title':announcement.title,
                    'announcement_slug':announcement.slug,
                    'announcement_image':announcement.announcement_image.url,
                    'published_on':announcement.published_date,
                    'published_time':announcement.published_time
                })
            return JsonResponse({'status':'success','result':result})
        else : 
            filterby_filtered_annnouncement  = Updates.objects.all().order_by('-published_date','-published_time')
            result = []
            for announcement in filterby_filtered_annnouncement  : 
                result.append({
                    'announcement_id':announcement.id,
                    'author':announcement.user.username,
                    'announcement_title':announcement.title,
                    'announcement_slug':announcement.slug,
                    'announcement_image':announcement.announcement_image.url,
                    'published_on':announcement.published_date,
                    'published_time':announcement.published_time
                })
            return JsonResponse({'status':'success','result':result})

#my news filter       
class MyNewsFilter(View):
    def get(self, request):
        user = request.user.id
        filter_category = request.GET.get('filterCategory')
        filter_by = request.GET.get('filterBy')
        
        filter_by_month = request.GET.get('filterByMonth')
        filter_by_year = request.GET.get('filterByYear')
        
        current_date = date.today()

        filtered_my_news = News.objects.filter(user=user).order_by('-published_date', '-published_time')

        if filter_category and filter_category != 'All':
            filtered_my_news = filtered_my_news.filter(category=filter_category).order_by('-published_date', '-published_time')
    
        if filter_by_month and filter_by_month != '' : 
            filtered_my_news = filtered_my_news.filter(published_date__month=filter_by_month)
            
            print(filtered_my_news)
        
        if filter_by_year and filter_by_year != '' : 
            filtered_my_news = filtered_my_news.filter(published_date__year=filter_by_year)


        if filter_by == 'Today':
            filtered_my_news = filtered_my_news.filter(published_date__day=current_date.day, published_date__year=current_date.year).order_by('-published_date', '-published_time')
        elif filter_by == 'This Month':
            filtered_my_news = filtered_my_news.filter(published_date__month=current_date.month, published_date__year=current_date.year).order_by('-published_date', '-published_time')
        elif filter_by == 'This Year':
            filtered_my_news = filtered_my_news.filter(published_date__year=current_date.year).order_by('-published_date', '-published_time')

        result = []
        for news in filtered_my_news:
            result.append({
                'news_id': news.id,
                'author': news.user.username,
                'news_title': news.title,
                'news_slug': news.slug,
                'news_image': news.news_image.url,
                'published_on': news.published_date,
                'published_time': news.published_time
            })

        return JsonResponse({'status': 'success', 'result': result})
