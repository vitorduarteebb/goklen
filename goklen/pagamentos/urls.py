from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HistoricoPagamentoViewSet

router = DefaultRouter()
# Optionally, you can provide a basename explicitly if needed:
router.register(r'pagamentos', HistoricoPagamentoViewSet, basename="pagamentos")

urlpatterns = [
    path('', include(router.urls)),
]
