"""
Unit tests for blog models.

Tests cover:
- Model creation and validation
- Slug auto-generation
- Timestamp behavior
- Custom manager methods
- Model relationships
"""

from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from blog.models import Post, Category, Tag, Comment, Like, Bookmark


class CategoryModelTest(TestCase):
    """Tests for Category model"""
    
    def setUp(self):
        self.category = Category.objects.create(
            name="Technology",
            description="Tech articles"
        )
    
    def test_category_creation(self):
        """Test category is created with correct fields"""
        self.assertEqual(self.category.name, "Technology")
        self.assertEqual(self.category.description, "Tech articles")
        self.assertIsNotNone(self.category.created_at)
        self.assertIsNotNone(self.category.updated_at)
    
    def test_slug_auto_generation(self):
        """Test slug is auto-generated from name"""
        self.assertEqual(self.category.slug, "technology")
    
    def test_str_representation(self):
        """Test string representation"""
        self.assertEqual(str(self.category), "Technology")
    
    def test_unique_name_constraint(self):
        """Test that duplicate category names are rejected"""
        with self.assertRaises(Exception):
            Category.objects.create(name="Technology")


class TagModelTest(TestCase):
    """Tests for Tag model"""
    
    def setUp(self):
        self.tag = Tag.objects.create(name="Python")
    
    def test_tag_creation(self):
        """Test tag is created correctly"""
        self.assertEqual(self.tag.name, "Python")
        self.assertEqual(self.tag.slug, "python")
    
    def test_str_representation(self):
        """Test string representation"""
        self.assertEqual(str(self.tag), "Python")


class PostModelTest(TestCase):
    """Tests for Post model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.category = Category.objects.create(name="Lifestyle")
        self.tag = Tag.objects.create(name="Coffee")
        
        self.post = Post.objects.create(
            title="My First Coffee Blog Post",
            content="A" * 150,  # Min 100 chars required
            author=self.user,
            category=self.category,
            status="published"
        )
        self.post.tags.add(self.tag)
    
    def test_post_creation(self):
        """Test post is created with correct fields"""
        self.assertEqual(self.post.title, "My First Coffee Blog Post")
        self.assertEqual(self.post.author, self.user)
        self.assertEqual(self.post.category, self.category)
        self.assertEqual(self.post.status, "published")
    
    def test_uuid_primary_key(self):
        """Test that post uses UUID as primary key"""
        import uuid
        self.assertIsInstance(self.post.id, uuid.UUID)
    
    def test_slug_auto_generation(self):
        """Test slug is auto-generated from title"""
        self.assertEqual(self.post.slug, "my-first-coffee-blog-post")
    
    def test_unique_slug_generation(self):
        """Test duplicate titles get unique slugs"""
        post2 = Post.objects.create(
            title="My First Coffee Blog Post",
            content="B" * 150,
            author=self.user,
            status="draft"
        )
        self.assertNotEqual(self.post.slug, post2.slug)
        self.assertTrue(post2.slug.startswith("my-first-coffee-blog-post"))
    
    def test_excerpt_auto_generation(self):
        """Test excerpt is auto-generated if empty"""
        self.assertIsNotNone(self.post.excerpt)
        self.assertTrue(len(self.post.excerpt) <= 300)
    
    def test_reading_time_calculation(self):
        """Test reading time calculation"""
        reading_time = self.post.calculate_reading_time()
        self.assertIn("min read", reading_time)
    
    def test_increment_views(self):
        """Test view count increment"""
        initial_views = self.post.views_count
        self.post.increment_views()
        self.post.refresh_from_db()
        self.assertEqual(self.post.views_count, initial_views + 1)
    
    def test_published_at_set_on_publish(self):
        """Test published_at is set when status changes to published"""
        draft_post = Post.objects.create(
            title="Draft Post",
            content="C" * 150,
            author=self.user,
            status="draft"
        )
        self.assertIsNone(draft_post.published_at)
        
        draft_post.status = "published"
        draft_post.save()
        draft_post.refresh_from_db()
        self.assertIsNotNone(draft_post.published_at)
    
    def test_str_representation(self):
        """Test string representation"""
        self.assertEqual(str(self.post), "My First Coffee Blog Post")


class PostManagerTest(TestCase):
    """Tests for PostManager custom queries"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="author",
            password="pass123"
        )
        self.category = Category.objects.create(name="Tech")
        
        # Create published post
        self.published_post = Post.objects.create(
            title="Published Post Title",
            content="X" * 150,
            author=self.user,
            category=self.category,
            status="published",
            is_featured=True
        )
        
        # Create draft post
        self.draft_post = Post.objects.create(
            title="Draft Post Title",
            content="Y" * 150,
            author=self.user,
            status="draft"
        )
    
    def test_published_manager_method(self):
        """Test published() returns only published posts"""
        published = Post.objects.published()
        self.assertEqual(published.count(), 1)
        self.assertIn(self.published_post, published)
        self.assertNotIn(self.draft_post, published)
    
    def test_featured_manager_method(self):
        """Test featured() returns only featured published posts"""
        featured = Post.objects.featured()
        self.assertEqual(featured.count(), 1)
        self.assertIn(self.published_post, featured)
    
    def test_by_category_manager_method(self):
        """Test by_category() filters by category slug"""
        posts = Post.objects.by_category("tech")
        self.assertEqual(posts.count(), 1)
        self.assertIn(self.published_post, posts)
    
    def test_search_manager_method(self):
        """Test search() finds posts by title"""
        results = Post.objects.search("Published")
        self.assertIn(self.published_post, results)


class CommentModelTest(TestCase):
    """Tests for Comment model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="commenter",
            password="pass123"
        )
        self.author = User.objects.create_user(
            username="author",
            password="pass123"
        )
        self.post = Post.objects.create(
            title="Test Post for Comments",
            content="Z" * 150,
            author=self.author,
            status="published"
        )
        self.comment = Comment.objects.create(
            post=self.post,
            author=self.user,
            content="Great article!"
        )
    
    def test_comment_creation(self):
        """Test comment is created correctly"""
        self.assertEqual(self.comment.content, "Great article!")
        self.assertEqual(self.comment.author, self.user)
        self.assertEqual(self.comment.post, self.post)
        self.assertTrue(self.comment.is_approved)
    
    def test_nested_replies(self):
        """Test comments can have replies"""
        reply = Comment.objects.create(
            post=self.post,
            author=self.author,
            content="Thanks for reading!",
            parent=self.comment
        )
        self.assertEqual(reply.parent, self.comment)
        self.assertIn(reply, self.comment.replies.all())
    
    def test_str_representation(self):
        """Test string representation"""
        expected = f"Comment by {self.user.username} on {self.post.title}"
        self.assertEqual(str(self.comment), expected)


class LikeBookmarkModelTest(TestCase):
    """Tests for Like and Bookmark models"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="liker",
            password="pass123"
        )
        self.author = User.objects.create_user(
            username="writer",
            password="pass123"
        )
        self.post = Post.objects.create(
            title="Likeable Post",
            content="W" * 150,
            author=self.author,
            status="published"
        )
    
    def test_like_creation(self):
        """Test like is created correctly"""
        like = Like.objects.create(post=self.post, user=self.user)
        self.assertEqual(like.post, self.post)
        self.assertEqual(like.user, self.user)
    
    def test_unique_like_constraint(self):
        """Test user can only like a post once"""
        Like.objects.create(post=self.post, user=self.user)
        with self.assertRaises(Exception):
            Like.objects.create(post=self.post, user=self.user)
    
    def test_bookmark_creation(self):
        """Test bookmark is created correctly"""
        bookmark = Bookmark.objects.create(post=self.post, user=self.user)
        self.assertEqual(bookmark.post, self.post)
        self.assertEqual(bookmark.user, self.user)
    
    def test_unique_bookmark_constraint(self):
        """Test user can only bookmark a post once"""
        Bookmark.objects.create(post=self.post, user=self.user)
        with self.assertRaises(Exception):
            Bookmark.objects.create(post=self.post, user=self.user)
