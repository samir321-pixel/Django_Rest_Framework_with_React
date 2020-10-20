from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('overview/', views.apiOverview, name="api-overview"),
    path('duty-list', views.dutyList, name="duty-list"),
    path('duty-detail/<str:pk>/', views.dutyDetail, name="duty-detail"),
    path('duty-update/<str:pk>/', views.dutyUpdate, name="duty-update"),
    path('duty-delete/<str:pk>/', views.dutyDelete, name="duty-delete"),
    path('duty-create/', views.dutyCreate, name="duty-create"),

]
