from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.generic import View
from django.contrib.auth.models import User
from . models import UserProfile
from django.contrib import auth

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
            
            user = User.objects.create_user(first_name=name,email=email,username=username,password=password)
            user.save()
            
            user_model = User.objects.get(username=username)
            new_profile = UserProfile.objects.create(user=user_model)
            new_profile.save()
        
            return JsonResponse({'success':True})
        else : 
            return JsonResponse({'success':False,'error':'invalid request method'})
        
    
#user login view
class UserLoginView(View) : 
    def get(self,request) : 
        return render(request,'login.html')
    def post(self,request) : 
        if request.method == 'POST' :
            email = request.POST.get('email')
            password = request.POST.get('password')
            
            username = User.objects.get(email=email).username
            
            
            user = auth.authenticate(username=username,password=password)
            if user is not None : 
                auth.login(request,user)
                return JsonResponse({'success':True})
            else : 
                return JsonResponse({'success':False})
        else : 
            return JsonResponse({'success':False,'error':'invalid request'})
        
#user logout function 
class UserLogoutView(View) : 
    def get(self,request) : 
        auth.logout(request)
        return redirect('home:index')
            
#view to render user profile page 
class UserProfilePage(View) : 
    def get(self,request) : 
        user_model = request.user
        current_user = UserProfile.objects.get(user=user_model)
        context = {
            'current_user' : current_user
        }
        return render(request,'profile-page.html',context)
    
#view to check email already exist 
class CheckEmail(View) : 
    def get(self,request) : 
        email = request.GET.get('email')
        
        if User.objects.filter(email=email).exists():
            return JsonResponse({'is_available':False})
        else : 
            return JsonResponse({'is_available':True})

#view to check username already taken 
class CheckUsername(View) : 
    def get(self,request) : 
        username = request.GET.get('username')
        
        if User.objects.filter(username=username).exists() : 
            return JsonResponse({'is_available':False})
        else : 
            return JsonResponse({'is_available':True})