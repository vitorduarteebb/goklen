from rest_framework import viewsets
from .models import Profissional, Modelo, Aviamento, Produto, ModeloAviamento
from .serializers import (
    ProfissionalSerializer,
    ModeloSerializer,
    AviamentoSerializer,
    ProdutoSerializer,
    ModeloAviamentoSerializer
)

class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer

class ModeloViewSet(viewsets.ModelViewSet):
    queryset = Modelo.objects.all()
    serializer_class = ModeloSerializer

class AviamentoViewSet(viewsets.ModelViewSet):
    queryset = Aviamento.objects.all()
    serializer_class = AviamentoSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class ModeloAviamentoViewSet(viewsets.ModelViewSet):
    queryset = ModeloAviamento.objects.all()
    serializer_class = ModeloAviamentoSerializer

    def get_queryset(self):
         queryset = super().get_queryset()
         modelo = self.request.query_params.get('modelo')
         if modelo:
              queryset = queryset.filter(modelo=modelo)
         return queryset
