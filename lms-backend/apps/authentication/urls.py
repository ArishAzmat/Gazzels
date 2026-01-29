from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, CurrentUserView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
]
