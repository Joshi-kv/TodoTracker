from django.shortcuts import render
from django.views.generic import View


# Create your views here.

#user registration
class UserRegistrationView(View) : 
    def get(self,request) : 
        return render(request,'register.html')
    
#user login view
class UserLoginView(View) : 
    def get(self,request) : 
        return render(request,'login.html')