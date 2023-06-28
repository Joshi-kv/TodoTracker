from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.

class UserProfile(models.Model) : 
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='Profile_Images',default='blank-profile.png',blank=True,null=True)
    about = models.TextField(blank=True,null=True)
    company = models.CharField(max_length=500,blank=True,null=True)
    job = models.CharField(max_length=256,blank=True,null=True)
    country = models.CharField(max_length=256,blank=True,null=True)
    address = models.TextField(blank=True,null=True)
    phone_number = models.CharField(max_length=12,blank=True,null=True)
    twitter_profile = models.URLField(max_length=500,blank=True,null=True)
    facebook_profile = models.URLField(max_length=500,blank=True,null=True)
    instagram_profile = models.URLField(max_length=500,blank=True,null=True)
    linkedin_profile = models.URLField(max_length=500,blank=True,null=True)
    
    def __str__(self) : 
        return f'{self.user}'