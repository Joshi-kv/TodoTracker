from django.test import TestCase,Client
from django.contrib.auth.models import User
from . models import UserProfile

# Create your tests here.

class SignupPageTest(TestCase) : 
    def test_signup_url(self) : 
        response = self.client.get('/user/register/')
        self.assertEqual(response.status_code,200)
        
class LoginPageTest(TestCase) : 
    def test_login_url(self) : 
        response = self.client.get('/user/login/')
        self.assertEqual(response.status_code,200)
    
        
class UserModelTest(TestCase) : 
    def test_create_user(self) : 
        email = 'demo@gmail.com'
        first_name = 'demo'
        username = 'demo'
        password = 'Demo@123'
        
        user = User.objects.create_user(email=email,first_name=first_name,username=username,password=password)
        user.save()
        
        self.assertEqual(user.email,email)
        self.assertEqual(user.username,username)
        self.assertEqual(user.first_name,first_name)
        self.assertTrue(user.check_password(password),password)
        
        c = Client()
        logged_in = c.login(username='demo',password='Demo@123')

        
class UserProfileModelTest(TestCase) : 
    def test_create_userprofile(self) : 
        user = User.objects.create_user(first_name='demo',username='demo',email='demo@gmail.com',password='Demo@123')
        user_profile = UserProfile.objects.create(user=user,job='job',country='country',twitter_profile='https://www.twitter.com',)

        self.assertTrue(user_profile.user,user)
        self.assertEqual(user_profile.job,'job')
        self.assertEqual(user_profile.twitter_profile,'https://www.twitter.com')