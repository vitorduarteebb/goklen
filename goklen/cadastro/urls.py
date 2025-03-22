from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfissionalViewSet, ModeloViewSet, ViesViewSet
from .views import ProdutoViewSet

router = DefaultRouter()
router.register(r'profissionais', ProfissionalViewSet)
router.register(r'modelos', ModeloViewSet)
router.register(r'vies', ViesViewSet)
router.register(r'produtos', ProdutoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
