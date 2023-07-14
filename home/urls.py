from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('',views.HomePageView.as_view(),name='index'),
    path('dashboard-count/',views.DashBoardCountView.as_view(),name='dashboard-count'),
    path('filter-total-tasks/',views.TotalTaskFilterView.as_view(),name='filter-total-task'),
    path('filter-completed-tasks/',views.FilterCompletedTaskView.as_view(),name='filter-completed-tasks'),
    path('filter-pending-tasks/',views.FilterPendingTaskView.as_view(),name='filter-pending-tasks'),
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
    path('all-news/',views.MainNewsPageView.as_view(),name='all-news'),
    path('news-list/',views.NewsListView.as_view(),name='news-list'),
    path('general-news/',views.GeneralNewsPageView.as_view(),name='general-news'),
    path('general-news-list/',views.GeneralNewsListView.as_view(),name='general-news-list'),
    path('featured-news/',views.FeaturedNewsPageView.as_view(),name='featured-news'),
    path('featured-news-list/',views.FeaturedNewsListView.as_view(),name='featured-news-list'),
    path('announcements/',views.AnnouncementPageView.as_view(),name='announcements'),
    path('announcements-list/',views.AnnouncementListView.as_view(),name='announcements-list'),
    path('my-news/',views.MyNewsPageView.as_view(),name='my-news'),
    path('my-news-list/',views.MyNewsListView.as_view(),name='my-news-list'),
    path('create-news/',views.CreateNewsView.as_view(),name='create-news'),
    path('news/<slug:slug>/',views.single_news_page,name='news'),
    path('announcement/<slug:slug>/',views.single_announcement_page,name='announcement'),
    path('news-update-view/',views.NewsUpdatePageView.as_view(),name='news-update-view'),
    path('news-update/',views.NewsUpdateView.as_view(),name='news-update'),
    
]
