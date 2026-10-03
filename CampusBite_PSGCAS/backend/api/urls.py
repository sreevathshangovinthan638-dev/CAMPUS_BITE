from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health),
    path('auth/login/', views.auth_login),
    path('auth/register/', views.auth_register),
    path('auth/me/', views.auth_me),
    path('categories/', views.categories),
    path('foods/', views.foods),
    path('foods/create/', views.create_food),
    path('foods/<int:food_id>/', views.food_detail),
    path('orders/place/', views.place_order),
    path('orders/all/', views.all_orders),
    path('orders/<int:order_id>/', views.order_detail),
    path('orders/status/<int:order_id>/', views.update_order_status),
]
