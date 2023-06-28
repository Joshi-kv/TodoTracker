from django.contrib import admin
from . models import UserProfile
# Register your models here.

class UserProfileAdmin(admin.ModelAdmin) : 
    list_display = ['user','about','company','job','address','phone_number','twitter_profile','facebook_profile','instagram_profile','linkedin_profile']
    list_per_page = 10
    
    
admin.site.register(UserProfile,UserProfileAdmin) 