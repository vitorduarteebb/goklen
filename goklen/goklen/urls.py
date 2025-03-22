from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/cadastro/', include('cadastro.urls')),
    path('api/pedidos/', include('pedidos.urls')),
    path('api/estoque/', include('estoque.urls')),
    path('api/pagamentos/', include('pagamentos.urls')),
]


