from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
   SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView
)

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),
    
    # API v1 URLs
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/employees/', include('apps.employees.urls')),
    path('api/v1/courses/', include('apps.courses.urls')),
    path('api/v1/assignments/', include('apps.assignments.urls')),
    path('api/v1/progress/', include('apps.progress.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
