from django.test import TestCase
from . models import Todo,News
from django.contrib.auth.models import User
# Create your tests here.

class TodoCreationTest(TestCase) : 
    def test_todo_creation(self) : 
        user = User.objects.create_user(first_name='Demo',username='demo',email='demo@gmail.com',password='demopassword')
        task = Todo.objects.create(user=user,task_title='demo',task_description='demo description',task_duedate='2023-07-10',task_priority='High priority',task_status='Pending')
        
        
        self.assertEqual(task.user,user)
        self.assertEqual(task.task_title,'demo')
        self.assertEqual(task.task_description,'demo description')

class NewsCreationTest(TestCase) : 
    def test_news_creation(self) : 
        user = User.objects.create_user(first_name='Demo',username='demo',email='demo@gmail.com',password='demopassword')
        news = News.objects.create(user=user,title='Demo title',description='Demo description',news_image='demoimage.jpg',category='Featured')
        
        self.assertEqual(news.title,'Demo title')
        self.assertEqual(news.description,'Demo description')
        self.assertEqual(news.category,'Featured')
        self.assertEqual(news.news_image,'demoimage.jpg')