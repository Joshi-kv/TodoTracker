from django.shortcuts import render
from django.views.generic import View
from users.models import UserProfile
from django.contrib.auth.mixins import LoginRequiredMixin
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
    
#view to create todo 
class TodoCreateView(View) : 
    def post(self,request) : 
        pass
    
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