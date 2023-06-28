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
    
    
#view to change profile settings
class UserSettingsView(View) : 
    def post(self,request) : 
        user_model = request.user
        user_object = User.objects.get(username=user_model.username)
        current_user = UserProfile.objects.get(user=user_model)
        
        profile_picture = request.FILES.get('profile_picture')
        full_name = request.POST.get('full_name')
        about = request.POST.get('about')
        job = request.POST.get('job_title')
        company = request.POST.get('company_name')
        country = request.POST.get('country')
        address = request.POST.get('address')
        email = request.POST.get('email')
        phone_number = request.POST.get('phone_number')
        twitter_link = request.POST.get('twitter_link')
        facebook_link = request.POST.get('facebook_link')
        instagram_link = request.POST.get('instagram_link')
        linkedin_link = request.POST.get('linkedin_link')
        
        #UserProfile model changes
        current_user.phone_number = phone_number
        current_user.about = about
        current_user.job = job
        current_user.company = company
        current_user.country = country
        current_user.address = address
        current_user.twitter_profile = twitter_link
        current_user.facebook_profile = facebook_link
        current_user.instagram_profile = instagram_link
        current_user.linkedin_profile = linkedin_link
        current_user.save()
        
        #user model changes
        user_object.first_name = full_name
        user_object.email = email
        user_object.save()
        
        context = {
            'full_name' : user_object.first_name,
            'about' : current_user.about,
            'job_title':current_user.job,
            'company':current_user.company,
            'country':current_user.country,
            'address':current_user.address,
            'email':user_object.email,
            'phone_number':current_user.phone_number,
            'twitter_link':current_user.twitter_profile,
            'facebook_link':current_user.facebook_profile,
            'instagram_link':current_user.instagram_profile,
            'linkedin_link':current_user.linkedin_profile
        }
        
        print(context)
        return JsonResponse(context,safe=False)

        
    
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