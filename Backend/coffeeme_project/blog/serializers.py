from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Category, Tag, Comment, Like, Bookmark


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'posts_count']
        read_only_fields = ['id']
    
    def get_posts_count(self, obj):
        return obj.blog_posts.filter(status='published').count()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'posts_count']
        read_only_fields = ['slug']
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    """Serializer for Tag model"""
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    replies_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'author', 'content', 'parent',
            'created_at', 'updated_at', 'is_approved',
            'replies', 'replies_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']
    
    def get_replies(self, obj):
        if obj.parent is None:  # Only include replies for top-level comments
            replies = obj.replies.filter(is_approved=True)
            return CommentSerializer(replies, many=True, context=self.context).data
        return []
    
    def get_replies_count(self, obj):
        return obj.replies.filter(is_approved=True).count()


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for post listings"""
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    reading_time = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'author', 'category', 'tags',
            'featured_image', 'is_featured', 'created_at', 'published_at',
            'reading_time', 'views_count', 'likes_count', 'comments_count',
            'is_liked', 'is_bookmarked', 'status'
        ]
    
    def get_reading_time(self, obj):
        return obj.calculate_reading_time()
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False


class PostDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for individual post view"""
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    reading_time = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    related_posts = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author',
            'category', 'tags', 'featured_image', 'is_featured',
            'created_at', 'updated_at', 'published_at', 'reading_time',
            'views_count', 'likes_count', 'comments_count', 'comments',
            'related_posts', 'is_liked', 'is_bookmarked', 'status',
            'meta_description', 'meta_keywords'
        ]
    
    def get_reading_time(self, obj):
        return obj.calculate_reading_time()
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True, parent=None).count()
    
    def get_comments(self, obj):
        # Only return top-level comments; replies are nested
        comments = obj.comments.filter(is_approved=True, parent=None)
        return CommentSerializer(comments, many=True, context=self.context).data
    
    def get_related_posts(self, obj):
        related = obj.get_related_posts()
        return PostListSerializer(related, many=True, context=self.context).data
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.bookmarks.filter(user=request.user).exists()
        return False


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating posts"""
    tags = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        required=False
    )
    
    class Meta:
        model = Post
        fields = [
            'title', 'content', 'excerpt', 'category', 'tags',
            'featured_image', 'is_featured', 'status',
            'meta_description', 'meta_keywords'
        ]
    
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value
    
    def validate_content(self, value):
        if len(value) < 100:
            raise serializers.ValidationError("Content must be at least 100 characters long.")
        return value


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for Like model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Like
        fields = ['id', 'post', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class BookmarkSerializer(serializers.ModelSerializer):
    """Serializer for Bookmark model"""
    post = PostListSerializer(read_only=True)
    
    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'created_at']
        read_only_fields = ['id', 'created_at']