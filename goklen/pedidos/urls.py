from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CorteViewSet, PedidoViewSet, ConfecaoViewSet, EmbalagemViewSet

router = DefaultRouter()
router.register(r'cortes', CorteViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'confecoes', ConfecaoViewSet)
router.register(r'embalagens', EmbalagemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
