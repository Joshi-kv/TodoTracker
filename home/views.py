from django.shortcuts import render
from django.views.generic import View

# Create your views here.

class HomePageView(View) : 
    def get(self,request) : 
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