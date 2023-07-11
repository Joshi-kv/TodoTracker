from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('',views.HomePageView.as_view(),name='index'),
    path('dashboard-count/',views.DashBoardCountView.as_view(),name='dashboard-count'),
    path('activity-logs/',views.ActivityLogView.as_view(),name='activity-logs'),
    path('recent-logs-filter',views.FilterRecentActivityView.as_view(),name='recent-log-filter'),
    path('todo/',views.TodoPageView.as_view(),name='todo-page'),
    path('tasks/',views.TaskListView.as_view(),name='task-list'),
    path('create-task/',views.TodoCreateView.as_view(),name='create-task'),
    path('update-view/',views.UpdateTaskPageView.as_view(),name='update-view'),
    path('update-task/',views.UpdateTaskView.as_view(),name='update-task'),
    path('delete-task/',views.TaskDeleteView.as_view(),name='delete-task'),
    path('faq/',views.FaqPageView.as_view(),name='faq'),
    path('faq-list/',views.FaqListView.as_view(),name='faq-list'),
    path('feedback/',views.FeedbackPageView.as_view(),name='feedback'),
    path('feedback-submission/',views.FeedbackCreateView.as_view(),name='feedback-submission'),
    path('news/',views.NewsPageView.as_view(),name='news'),
    path('news-list/',views.NewsListView.as_view(),name='news-list')
]
