from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from django.db.models import Sum
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import Post, Category, Tag, Comment, Like, Bookmark
from .serializers import (
    PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer,
    CategorySerializer, TagSerializer, CommentSerializer,
    LikeSerializer, BookmarkSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for list views"""
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Post CRUD operations with advanced features
    """
    queryset = Post.objects.published().select_related('author', 'category').prefetch_related('tags', 'likes', 'comments')
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'tags', 'is_featured']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['created_at', 'published_at', 'views_count', 'title']
    ordering = ['-published_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PostDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return PostCreateUpdateSerializer
        return PostListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by tag slug
        tag_slug = self.request.query_params.get('tag_slug', None)
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
        
        # Show all posts (including drafts) for authenticated users
        if self.request.user.is_authenticated and self.request.user.is_staff:
            queryset = Post.objects.all()
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured posts"""
        featured_posts = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending posts based on recent views"""
        trending_posts = self.get_queryset().order_by('-views_count', '-created_at')[:10]
        serializer = self.get_serializer(trending_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """Like/unlike a post"""
        post = self.get_object()
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        
        if not created:
            like.delete()
            return Response({
                'status': 'unliked',
                'likes_count': post.likes.count()
            })
        
        return Response({
            'status': 'liked',
            'likes_count': post.likes.count()
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, pk=None):
        """Bookmark/unbookmark a post"""
        post = self.get_object()
        bookmark, created = Bookmark.objects.get_or_create(post=post, user=request.user)
        
        if not created:
            bookmark.delete()
            return Response({'status': 'removed'})
        
        return Response({
            'status': 'bookmarked'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def by_slug(self, request, slug=None):
        """Get post by slug"""
        post = get_object_or_404(Post.objects.published(), slug=slug)
        post.increment_views()
        serializer = PostDetailSerializer(post, context={'request': request})
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category operations"""
    queryset = Category.objects.annotate(
        posts_count=Count('posts', filter=Q(posts__status='published'))
    )
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get all posts in a category"""
        category = self.get_object()
        posts = Post.objects.published().filter(category=category)
        
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = PostListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class TagViewSet(viewsets.ModelViewSet):
    """ViewSet for Tag operations"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """Get all posts with a specific tag"""
        tag = self.get_object()
        posts = Post.objects.published().filter(tags=tag)
        
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = PostListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for Comment operations"""
    queryset = Comment.objects.filter(is_approved=True).select_related('author', 'post')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get('post', None)
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset
    
    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)


@api_view(['GET'])
def home(request):
    """
    Enhanced homepage API with featured post, latest posts, and stats
    """
    # Get featured post
    featured_post = Post.objects.featured().first()
    
    # Get latest posts
    latest_posts = Post.objects.published()[:6]
    
    # Get popular categories
    popular_categories = Category.objects.annotate(
        posts_count=Count('posts', filter=Q(posts__status='published'))
    ).filter(posts_count__gt=0).order_by('-posts_count')[:6]
    
    # Get trending posts
    trending_posts = Post.objects.published().order_by('-views_count')[:4]
    
    # Serialize data
    featured_data = PostDetailSerializer(featured_post, context={'request': request}).data if featured_post else None
    latest_data = PostListSerializer(latest_posts, many=True, context={'request': request}).data
    categories_data = CategorySerializer(popular_categories, many=True).data
    trending_data = PostListSerializer(trending_posts, many=True, context={'request': request}).data
    
    return Response({
        'featured_post': featured_data,
        'latest_posts': latest_data,
        'popular_categories': categories_data,
        'trending_posts': trending_data,
        'stats': {
            'total_posts': Post.objects.published().count(),
            'total_categories': Category.objects.count(),
            'total_tags': Tag.objects.count(),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookmarks(request):
    """Get all bookmarked posts for the current user"""
    bookmarks = Bookmark.objects.filter(user=request.user).select_related('post')
    
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(bookmarks, request)
    serializer = BookmarkSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_liked_posts(request):
    """Get all liked posts for the current user"""
    likes = Like.objects.filter(user=request.user).select_related('post')
    posts = [like.post for like in likes if like.post.status == 'published']
    
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(posts, request)
    serializer = PostListSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def search_posts(request):
    """
    Advanced search endpoint with multiple filters
    """
    query = request.query_params.get('q', '')
    
    if not query:
        return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    posts = Post.objects.search(query).filter(status='published')
    
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(posts, request)
    serializer = PostListSerializer(page, many=True, context={'request': request})
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
def post_by_slug(request, slug):
    """Get a single post by slug"""
    post = get_object_or_404(Post.objects.published(), slug=slug)
    post.increment_views()
    serializer = PostDetailSerializer(post, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    """
    Get admin dashboard statistics
    """
    # Stats
    total_posts = Post.objects.count()
    total_views = Post.objects.aggregate(total_views=Sum('views_count'))['total_views'] or 0
    total_likes = Like.objects.count()
    
    # Recent drafts
    recent_drafts = Post.objects.filter(status='draft').order_by('-updated_at')[:5]
    drafts_serializer = PostListSerializer(recent_drafts, many=True, context={'request': request})
    
    # Pending comments
    pending_comments = Comment.objects.filter(is_approved=False).select_related('author', 'post')[:5]
    comments_serializer = CommentSerializer(pending_comments, many=True)
    
    return Response({
        'stats': {
            'total_posts': total_posts,
            'total_views': total_views,
            'total_likes': total_likes,
        },
        'recent_drafts': drafts_serializer.data,
        'pending_comments': comments_serializer.data,
    })