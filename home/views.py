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
    
#view to render user profile page 
class UserProfilePage(View) : 
    def get(self,request) : 
        return render(request,'profile-page.html')