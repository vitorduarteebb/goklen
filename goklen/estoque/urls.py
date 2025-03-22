from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstoqueViewSet

router = DefaultRouter()
router.register(r'', EstoqueViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
