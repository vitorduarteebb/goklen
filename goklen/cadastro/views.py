from rest_framework import viewsets
from .models import Profissional, Modelo, Vies
from .serializers import ProfissionalSerializer, ModeloSerializer, ViesSerializer
from rest_framework import viewsets
from .models import Produto
from .serializers import ProdutoSerializer

class ProfissionalViewSet(viewsets.ModelViewSet):
    queryset = Profissional.objects.all()
    serializer_class = ProfissionalSerializer

class ModeloViewSet(viewsets.ModelViewSet):
    queryset = Modelo.objects.all()
    serializer_class = ModeloSerializer

class ViesViewSet(viewsets.ModelViewSet):
    queryset = Vies.objects.all()
    serializer_class = ViesSerializer



class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer
