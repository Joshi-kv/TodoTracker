from django.urls import path
from . import views


app_name = 'users'

urlpatterns = [
    path('register/',views.UserRegistrationView.as_view(),name='register'),
    path('login/',views.UserLoginView.as_view(),name='login'),
    path('logout/',views.UserLogoutView.as_view(),name='logout'),
    path('profile/',views.UserProfilePage.as_view(),name='profile-page'),
    path('settings/',views.UserSettingsView.as_view(),name='settings'),
    path('change-password/',views.ChangePasswordView.as_view(),name='change-password'),
    path('check-email/',views.CheckEmail.as_view(),name='check-email'), 
    path('check-username/',views.CheckUsername.as_view(),name='check-username')
    
]
