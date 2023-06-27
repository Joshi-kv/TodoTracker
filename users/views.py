from django.http import JsonResponse
from django.shortcuts import render
from django.views.generic import View


# Create your views here.

#user registration
class UserRegistrationView(View) : 
    def get(self,request) : 
        return render(request,'register.html')
    def post(self,request) :
        if request.method == 'POST' : 
            name = request.POST.get('name')
            username = request.POST.get('username')
            email = request.POST.get('email')
            password = request.POST.get('password')
            
            print(name,username,email,password)
        
            return JsonResponse({'success':True})
        else : 
            return JsonResponse({'success':False,'error':'invalid request method'})
        
    
#user login view
class UserLoginView(View) : 
    def get(self,request) : 
        return render(request,'login.html')
    
#view to render user profile page 
class UserProfilePage(View) : 
    def get(self,request) : 
        return render(request,'profile-page.html')