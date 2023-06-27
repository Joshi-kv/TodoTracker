from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/',views.UserRegistrationView.as_view(),name='register'),
    path('login/',views.UserLoginView.as_view(),name='login'),
    path('profile/',views.UserProfilePage.as_view(),name='profile-page'),
    
    
]
