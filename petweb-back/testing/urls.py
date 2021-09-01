from django.urls import path

from . import views

urlpatterns = [
    path('', views.fileList.as_view(), name='fileList'),
    # path('uploader/', views.uploader.as_view(), name='uploader'),
    path('uploader/', views.uploader.as_view(), name='uploader'),
    path('viewer/<int:fileID>/', views.viewer.as_view(), name='viewer'),
    path('export/', views.export.as_view(), name='export'),
    path('pacs/', views.pacs.as_view(), name='pacs'),
]