from django.urls import path 
from . import views

urlpatterns = [
    path('quiz/add/', views.QuizView.as_view(), name='quiz-add'),
    path('quizzes/fetch/', views.QuizView.as_view(), name='quizzes-fetch'),
    path('quizzes/fetch/<int:pk>/', views.QuizView.as_view(), name='quiz-fetch'),
    path('quiz/answer/save/', views.StudentView.as_view(), name='save-answer'),
    path('quiz/result/<int:pk>/', views.StudentView.as_view(), name='quiz-result'),
    path('quiz/results/<int:pk>/', views.QuizResult.as_view(), name='quiz-results'),
    path('quiz/<int:result_id>/result/', views.StudentAnswer.as_view(), name='student-answers'),
    
    path('calender/', views.CalenderView.as_view(), name='calender'),
]
