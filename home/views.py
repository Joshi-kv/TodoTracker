from django.shortcuts import render
from django.views.generic import View
from users.models import UserProfile
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
class TodoPageView(View) : 
    def get(self, request) : 
        return render(request, 'todo.html')
    
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