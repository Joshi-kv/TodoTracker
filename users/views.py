import os
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.views.generic import View
from django.contrib.auth.models import User
from . models import UserProfile
from django.contrib import auth
from django.views.decorators.csrf import csrf_protect
from home.models import ActivityLog
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
            
            if User.objects.filter(username=username).exists() : 
                return JsonResponse({'success':False,'error':'Username already taken'})
            elif User.objects.filter(email=email).exists() : 
                return JsonResponse({'success':False,'error':'Email already taken'})
            else : 
                user = User.objects.create_user(first_name=name,email=email,username=username,password=password)
                user.save()
            
            user_model = User.objects.get(username=username)
            new_profile = UserProfile.objects.create(user=user_model)
            new_profile.save()

            activity_log = ActivityLog.objects.create(
                user=new_profile.user,
                activity='Profile created'
            )
            activity_log.save()
            
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
            
            try : 
                user = User.objects.get(email=email)
                username = user.username
                user = auth.authenticate(username=username,password=password)
            except User.DoesNotExist : 
                return JsonResponse({'success':False})
            
            
            
            if user is not None : 
                auth.login(request,user)
                activity_log = ActivityLog(
                    user=user,
                    activity='Logged in'
                )
                activity_log.save()
                return JsonResponse({'success':True})
            else : 
                return JsonResponse({'success':False})
        else : 
            return JsonResponse({'success':False,'error':'invalid request'})
        
#user logout function 
class UserLogoutView(View) : 
    def get(self,request) :
        activity_log = ActivityLog.objects.create(
            user=request.user,
            activity='Logged out'
        )
        activity_log.save()
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
        
        
        if request.method == 'POST' : 
            if request.FILES.get('profile_picture') == None:
                profile_picture = current_user.profile_picture
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
            else : 
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
        current_user.profile_picture = profile_picture
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
        
        activity_log = ActivityLog.objects.create(
            user=request.user,
            activity='Profile settings changed'
        )
        activity_log.save()
        
        context = {
            'profile_picture' : current_user.profile_picture.url,
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
        
        
        return JsonResponse(context,safe=False)
    
#view to change reminder settings 
class ReminderSettingsView(View) :
    def post(self,request) : 
        user = request.user
        reminder_option = request.POST.get('reminder')
        user_profile = UserProfile.objects.get(user=user)
        if reminder_option == 'turnoff' : 
            print('turnoff')
            user_profile.enable_notification = False
            user_profile.save()
        else : 
            print('turnon')
            user_profile.enable_notification = True
            user_profile.save()
        reminder = user_profile.enable_notification
        return JsonResponse({'status':'success','reminder':reminder})
    
#view to remove profile picture
class ProfilePictureRemoveView(View) : 
    def get(self,request) : 
        requested_user = request.GET.get('requested_user')
        user_model = User.objects.get(username=requested_user)
        user_profile = UserProfile.objects.get(user=user_model)
        profile_image = 'blank-profile.png'
        user_profile.profile_picture = profile_image
        user_profile.save()
        
        return JsonResponse({'status':'success','profile_image':user_profile.profile_picture.url})

#view to change password
class ChangePasswordView(View) : 
    def post(self,request) : 
        user = request.user
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        
        if not user.check_password(old_password,) :
            return JsonResponse({'success':False})
        else : 
            user.set_password(new_password)
            user.save()
            current_user = auth.authenticate(username=user.username,password=new_password)
            if current_user is not None : 
                auth.login(request,current_user)
                activity_log = ActivityLog.objects.create(
                    user=request.user,
                    activity='Password changed'
                )
                activity_log.save()
            return JsonResponse({'success':True})

        
    
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