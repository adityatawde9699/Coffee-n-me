from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.core.validators import MinLengthValidator
from django.db.models import Q
import uuid
from PIL import Image


class TimeStampedModel(models.Model):
    """Abstract base model with timestamp fields"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    """Separate model for categories with better management"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text="CSS icon class or emoji")
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Tag(models.Model):
    """Tags for better content organization"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)
    
    class Meta:
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class PostManager(models.Manager):
    """Custom manager for Post queries"""
    
    def published(self):
        """Return only published posts"""
        return self.filter(status='published')
    
    def featured(self):
        """Return featured posts"""
        return self.filter(is_featured=True, status='published')
    
    def by_category(self, category_slug):
        """Filter posts by category"""
        return self.filter(category__slug=category_slug, status='published')
    
    def search(self, query):
        """Search posts by title, content, or excerpt"""
        return self.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(excerpt__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()


class Post(TimeStampedModel):
    """Enhanced Post model with additional features"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    # Basic fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(
        max_length=200,
        validators=[MinLengthValidator(5)],
        help_text="Post title (5-200 characters)"
    )
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    content = models.TextField(validators=[MinLengthValidator(100)])
    excerpt = models.TextField(
        max_length=300,
        blank=True,
        help_text="Short excerpt for previews (auto-generated if empty)"
    )
    
    # Relationships
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='posts'
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    
    # Media
    featured_image = models.ImageField(
        upload_to='blog_images/%Y/%m/',
        blank=True,
        null=True,
        help_text="Recommended size: 1200x630px"
    )
    
    # Meta fields
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='draft'
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Display on homepage featured section"
    )
    views_count = models.PositiveIntegerField(default=0, editable=False)
    published_at = models.DateTimeField(null=True, blank=True)
    
    # SEO fields
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    
    objects = PostManager()
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
        ]
    
    def save(self, *args, **kwargs):
        # Auto-generate slug from title
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        
        # Auto-generate excerpt if empty
        if not self.excerpt and self.content:
            self.excerpt = self.content[:297] + "..."
        
        # Set published_at when status changes to published
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        
        super().save(*args, **kwargs)

        # Resize image after saving
        if self.featured_image:
            img = Image.open(self.featured_image.path)
            
            # Check if image needs resizing (max 1200x630)
            if img.height > 630 or img.width > 1200:
                output_size = (1200, 630)
                img.thumbnail(output_size)
                img.save(self.featured_image.path)
    
    def __str__(self):
        return self.title
    
    def calculate_reading_time(self):
        """Calculate reading time based on word count"""
        word_count = len(self.content.split())
        reading_time = max(1, round(word_count / 200))
        return f"{reading_time} min read"
    
    def increment_views(self):
        """Increment view counter"""
        self.views_count += 1
        self.save(update_fields=['views_count'])
    
    def get_related_posts(self, limit=3):
        """Get related posts based on category and tags"""
        related = Post.objects.published().exclude(id=self.id)
        
        # First try same category
        if self.category:
            related = related.filter(category=self.category)
        
        # Then add posts with similar tags
        if self.tags.exists():
            related = related.filter(tags__in=self.tags.all()).distinct()
        
        return related[:limit]


class Comment(TimeStampedModel):
    """Comments system for blog posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField(validators=[MinLengthValidator(2)])
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    is_approved = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class Like(TimeStampedModel):
    """Like system for posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_posts')
    
    class Meta:
        unique_together = ('post', 'user')
    
    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"


class Bookmark(TimeStampedModel):
    """Bookmark system for users to save posts"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_posts')
    
    class Meta:
        unique_together = ('post', 'user')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} bookmarked {self.post.title}"