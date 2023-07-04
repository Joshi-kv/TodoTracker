from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('',views.HomePageView.as_view(),name='index'),
    path('todo/',views.TodoPageView.as_view(),name='todo-page'),
    path('tasks/',views.TaskListView.as_view(),name='task-list'),
    path('create-task/',views.TodoCreateView.as_view(),name='create-task'),
    path('update-task/',views.UpdateTaskView.as_view(),name='update-task'),
    path('faq/',views.FaqPageView.as_view(),name='faq'),
    path('feedback/',views.FeedbackPageView.as_view(),name='feedback'),
    path('news/',views.NewsPageView.as_view(),name='news')
]
