from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from django_summernote.admin import SummernoteModelAdmin  # Added Import
from .models import Post, Category, Tag, Comment, Like, Bookmark


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'posts_count', 'icon', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(post_count=Count('posts'))
    
    def posts_count(self, obj):
        return obj.post_count
    posts_count.short_description = 'Posts'
    posts_count.admin_order_field = 'post_count'


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'posts_count')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.annotate(post_count=Count('posts'))
    
    def posts_count(self, obj):
        return obj.post_count
    posts_count.short_description = 'Posts'
    posts_count.admin_order_field = 'post_count'


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ('author', 'content', 'is_approved', 'created_at')
    readonly_fields = ('author', 'created_at')
    can_delete = True

@admin.register(Post)
class PostAdmin(SummernoteModelAdmin):
    summernote_fields = ('content',)

    list_display = (
        'title', 'author', 'category', 'status', 'is_featured',
        'views_count', 'likes_count', 'comments_count',
        'published_at', 'created_at'
    )
    list_filter = ('status', 'is_featured', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'content', 'excerpt', 'author__username')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured', 'status')
    ordering = ('-created_at',)
    readonly_fields = (
        'id', 'created_at', 'updated_at', 'views_count',
        'published_at', 'get_likes_count', 'get_comments_count',
        'image_preview'
    )
    filter_horizontal = ('tags',)
    inlines = [CommentInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'title', 'slug', 'author', 'status')
        }),
        ('Content', {
            'fields': ('content', 'excerpt')
        }),
        ('Media', {
            'fields': ('featured_image', 'image_preview')
        }),
        ('Settings', {
            'fields': ('is_featured',)
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('views_count', 'get_likes_count', 'get_comments_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'published_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('author', 'category').prefetch_related('tags', 'likes', 'comments')
    
    def likes_count(self, obj):
        return obj.likes.count()
    likes_count.short_description = 'Likes'
    
    def comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()
    comments_count.short_description = 'Comments'
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    get_likes_count.short_description = 'Total Likes'
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    get_comments_count.short_description = 'Total Comments'
    
    def image_preview(self, obj):
        if obj.featured_image:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 300px;" />',
                obj.featured_image.url
            )
        return "No image"
    image_preview.short_description = 'Image Preview'
    
    def save_model(self, request, obj, form, change):
        if not change:  # If creating new post
            obj.author = request.user
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        """
        Override save_formset to set the author for new comments created via inline.
        """
        instances = formset.save(commit=False)
        for instance in instances:
            # Check if it's a Comment instance and if author is not set
            if isinstance(instance, Comment) and getattr(instance, 'author_id', None) is None:
                instance.author = request.user
            instance.save()
        formset.save_m2m()


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'content_preview', 'is_approved', 'parent', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('content', 'author__username', 'post__title')
    list_editable = ('is_approved',)
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('post', 'parent')
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('post', 'user')


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('post', 'user')