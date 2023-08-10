from django.urls import path
from . import views

app_name = 'home'

urlpatterns = [
    path('',views.HomePageView.as_view(),name='index'),
    path('dashboard-count/',views.DashBoardCountView.as_view(),name='dashboard-count'),
    path('pending-notifications/',views.PendingTasksNotificationView.as_view(),name='pending-notifications'),
    path('clear-notifications/',views.ClearAllNotifications.as_view(),name='clear-notifications'),
    path('dashboard-task/',views.DashboardTaskView.as_view(),name='dashboard-task'),
    path('dashboard-project/',views.DashboardProjectView.as_view(),name='dashboard-project'),
    path('filter-total-projects/',views.TotalProjectFilterView.as_view(),name='filter-total-project'),
    path('filter-completed-projects/',views.CompletedProjectFilterView.as_view(),name='filter-completed-project'),
    path('filter-pending-projects/',views.PendingProjectFilterView.as_view(),name='filter-pending-project'),
    path('filter-on-hold-projects/',views.OnHoldProjectFilterView.as_view(),name='filter-on-hold-project'),
    path('filter-canceled-projects/',views.CanceledProjectFilterView.as_view(),name='filter-canceled-project'),
    path('filter-total-tasks/',views.TotalTaskFilterView.as_view(),name='filter-total-task'),
    path('filter-completed-tasks/',views.FilterCompletedTaskView.as_view(),name='filter-completed-tasks'),
    path('filter-pending-tasks/',views.FilterPendingTaskView.as_view(),name='filter-pending-tasks'),
    path('filter-inprogress-tasks/',views.FilterInProgressTaskView.as_view(),name='filter-inprogress-tasks'),
    path('filter-upcoming-tasks/',views.FilterUpcomingTaskView.as_view(),name='filter-upcoming-tasks'),
    path('activity-logs/',views.ActivityLogView.as_view(),name='activity-logs'),
    path('recent-logs-filter',views.FilterRecentActivityView.as_view(),name='recent-log-filter'),
    path('filter-dashboard-project/',views.FilterDashboardProjectView.as_view(),name='filter-dashboard-project'),
    path('filter-dashboard-task/',views.FilterDashboardTaskView.as_view(),name='filter-dashboard-task'),
    path('news-dashboard-view/',views.NewsDashboardView.as_view(),name='news-dashboard'),
    path('filter-news/',views.FilterNewsView.as_view(),name='filter-news-view'),
    path('projects/',views.ProjectPageView.as_view(),name='project-page'),
    path('project-list/',views.ProjectListView.as_view(),name='project-list'),
    path('create-project/',views.ProjectCreateView.as_view(),name='create-project'),
    path('update-project-view/',views.UpdateProjectPageView.as_view(),name='update-project-view'),
    path('update-project/',views.UpdateProjectView.as_view(),name='update-project'),
    path('delete-project/',views.ProjectDeleteView.as_view(),name='delete-project'),
    path('project/lists/<int:project_id>/',views.ListPageView.as_view(),name='list-page'),
    path('project/lists-display/<int:project_id>/',views.ListsDisplayView.as_view(),name='list-display'),
    path('project/create-list/<int:project_id>/',views.CreateListView.as_view(),name='list-create'),
    path('update-list-view/',views.UpdateListPageView.as_view(),name='list-update-page'),
    path('update-list/',views.UpdateListView.as_view(),name='list-update'),
    path('delete-list/<int:project_id>/',views.DeleteListView.as_view(),name='delete-list'),
    path('project/lists/issues/<int:project_id>/',views.IssuePageView.as_view(),name='issue-page'),
    path('project/lists/issue-detail/<int:project_id>/',views.IssueDetailPage.as_view(),name='issue-detail'),
    path('project/tasks/<int:project_id>/',views.TodoPageView.as_view(),name='todo-page'),
    path('project/task-detail/<int:task_id>/',views.TaskDetailPageView.as_view(),name='task-detail'),
    path('attach-task-file/<int:task_id>/',views.TaskFileAttachmentView.as_view(),name='task-file'),
    path('tasks/<int:project_id>/',views.TaskListView.as_view(),name='task-list'),
    path('create-task/<int:project_id>/',views.TodoCreateView.as_view(),name='create-task'),
    path('date-range-filter/',views.DateRangeFilter.as_view(),name='date-range-filter'),
    path('update-view/',views.UpdateTaskPageView.as_view(),name='update-view'),
    path('update-task/',views.UpdateTaskView.as_view(),name='update-task'),
    path('delete-task/',views.TaskDeleteView.as_view(),name='delete-task'),
    path('task/sub-task/<int:task_id>/',views.SubTaskPageView.as_view(),name='sub-task'),
    path('task/sub-task-list/<int:task_id>/',views.SubTaskListView.as_view(),name='sub-task-list'),
    path('task/create-sub-task/<int:task_id>/',views.SubTaskCreateView.as_view(),name='sub-task-list'), 
    path('task/update-sub-task-view/<int:task_id>/',views.UpdateSubTaskPageView.as_view(),name='sub-task-update-view'), 
    path('task/update-sub-task/<int:task_id>/',views.UpdateSubTaskView.as_view(),name='sub-task-update'), 
    path('task/delete-sub-task/<int:task_id>/',views.SubTaskDeleteView.as_view(),name='sub-task-delete'), 
    path('faq/',views.FaqPageView.as_view(),name='faq'),
    path('faq-list/',views.FaqListView.as_view(),name='faq-list'),
    path('feedback/',views.FeedbackPageView.as_view(),name='feedback'),
    path('feedback-submission/',views.FeedbackCreateView.as_view(),name='feedback-submission'),
    path('all-news/',views.MainNewsPageView.as_view(),name='all-news'),
    path('news-list/',views.NewsListView.as_view(),name='news-list'),
    path('announcements/',views.AnnouncementPageView.as_view(),name='announcements'),
    path('announcements-list/',views.AnnouncementListView.as_view(),name='announcements-list'),
    path('my-news/',views.MyNewsPageView.as_view(),name='my-news'),
    path('my-news-list/',views.MyNewsListView.as_view(),name='my-news-list'),
    path('create-news/',views.CreateNewsView.as_view(),name='create-news'),
    path('news/<slug:slug>/',views.SingleNewsPage.as_view(),name='news'),
    path('announcement/<slug:slug>/',views.SingleAnnouncementPage.as_view(),name='announcement'),
    path('news-update-view/',views.NewsUpdatePageView.as_view(),name='news-update-view'),
    path('news-update/',views.NewsUpdateView.as_view(),name='news-update'),
    path('news-delete/',views.NewsDeleteView.as_view(),name='news-delete'),
    path('search-all-news/',views.AllNewsSearchView.as_view(),name='all-news-search'),
    path('announcement-search/',views.announcementSearchView.as_view(),name='announcement-search'),
    path('search-my-news/',views.MyNewsSearchView.as_view(),name='my-news-search'),
    path('all-news-filter/',views.AllNewsFilter.as_view(),name='all-news-filter'),
    path('announcement-filter-filterby/',views.AnnouncementFilterByFilter.as_view(),name='announcement-filter-filterby'),
    path('my-news-filter/',views.MyNewsFilter.as_view(),name='my-news-filter'),
    
]
