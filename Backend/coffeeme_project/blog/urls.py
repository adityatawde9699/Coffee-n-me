from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'comments', views.CommentViewSet, basename='comment')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Custom endpoints
    path('home/', views.home, name='home'),
    path('search/', views.search_posts, name='search_posts'),
    path('posts/slug/<slug:slug>/', views.post_by_slug, name='post_by_slug'),
    
    # User-specific endpoints
    path('user/bookmarks/', views.user_bookmarks, name='user_bookmarks'),
    path('user/liked-posts/', views.user_liked_posts, name='user_liked_posts'),
]