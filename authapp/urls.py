from django.urls import path 
from . import views
from rest_framework_simplejwt import views as jwt_view
urlpatterns = [
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('verify/', jwt_view.TokenVerifyView.as_view(), name='verify'),
    path('refresh/', jwt_view.TokenRefreshView.as_view(), name='refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'), #لسه مستخدمتهاش
    path('signup/', views.SignupView.as_view(), name='signup'),
]
