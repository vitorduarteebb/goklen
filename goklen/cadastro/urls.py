from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AviamentoViewSet,  
    ModeloAviamentoViewSet,  
    ProfissionalViewSet,
    ModeloViewSet,
    ProdutoViewSet,
)

router = DefaultRouter()
router.register(r'aviamentos', AviamentoViewSet)
router.register(r'modeloaviamentos', ModeloAviamentoViewSet)
router.register(r'profissionais', ProfissionalViewSet)
router.register(r'modelos', ModeloViewSet)
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
