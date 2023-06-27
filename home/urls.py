from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('',views.HomePageView.as_view(),name='index'),
    path('todo/',views.TodoPageView.as_view(),name='todo-page'),
    path('profile/',views.UserProfilePage.as_view(),name='profile-page'),
    path('faq/',views.FaqPageView.as_view(),name='faq'),
]
