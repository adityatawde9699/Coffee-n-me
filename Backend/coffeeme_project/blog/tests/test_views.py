"""
API view tests for blog endpoints.

Tests cover:
- CRUD operations on posts
- Authentication requirements
- Pagination and filtering
- Custom endpoints (home, search, like, bookmark)
- Permission checks
"""

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from blog.models import Post, Category, Tag, Comment, Like, Bookmark


class HomeEndpointTest(APITestCase):
    """Tests for the /api/home/ endpoint"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="author",
            password="pass123"
        )
        self.category = Category.objects.create(name="Coffee")
        
        # Create a featured post
        self.featured_post = Post.objects.create(
            title="Featured Coffee Article",
            content="A" * 150,
            author=self.user,
            category=self.category,
            status="published",
            is_featured=True
        )
        
        # Create regular posts
        for i in range(3):
            Post.objects.create(
                title=f"Regular Post {i}",
                content="B" * 150,
                author=self.user,
                status="published"
            )
    
    def test_home_endpoint_returns_200(self):
        """Test home endpoint is accessible"""
        response = self.client.get("/api/home/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_home_includes_featured_post(self):
        """Test home response includes featured post"""
        response = self.client.get("/api/home/")
        self.assertIsNotNone(response.data.get("featured_post"))
        self.assertEqual(
            response.data["featured_post"]["title"],
            "Featured Coffee Article"
        )
    
    def test_home_includes_latest_posts(self):
        """Test home response includes latest posts"""
        response = self.client.get("/api/home/")
        self.assertIn("latest_posts", response.data)
        self.assertGreater(len(response.data["latest_posts"]), 0)
    
    def test_home_includes_stats(self):
        """Test home response includes statistics"""
        response = self.client.get("/api/home/")
        self.assertIn("stats", response.data)
        self.assertIn("total_posts", response.data["stats"])


class PostViewSetTest(APITestCase):
    """Tests for Post API endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )
        self.token = Token.objects.create(user=self.user)
        self.client = APIClient()
        
        self.category = Category.objects.create(name="Lifestyle")
        self.tag = Tag.objects.create(name="Morning")
        
        self.post = Post.objects.create(
            title="Test Blog Post",
            content="C" * 150,
            author=self.user,
            category=self.category,
            status="published"
        )
        self.post.tags.add(self.tag)
    
    def test_list_posts_unauthenticated(self):
        """Test listing posts without authentication"""
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_list_posts_returns_published_only(self):
        """Test only published posts are returned to anonymous users"""
        # Create a draft post
        Post.objects.create(
            title="Draft Post",
            content="D" * 150,
            author=self.user,
            status="draft"
        )
        
        response = self.client.get("/api/posts/")
        # Check all returned posts are published
        for post in response.data["results"]:
            self.assertEqual(post["status"], "published")
    
    def test_retrieve_post_increments_views(self):
        """Test viewing a post increments view count"""
        initial_views = self.post.views_count
        response = self.client.get(f"/api/posts/{self.post.id}/")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.post.refresh_from_db()
        self.assertEqual(self.post.views_count, initial_views + 1)
    
    def test_create_post_requires_auth(self):
        """Test creating a post requires authentication"""
        data = {
            "title": "New Post",
            "content": "E" * 150,
            "status": "draft"
        }
        response = self.client.post("/api/posts/", data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_post_authenticated(self):
        """Test creating a post when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        data = {
            "title": "Authenticated Post",
            "content": "F" * 150,
            "status": "draft"
        }
        response = self.client.post("/api/posts/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_post_search(self):
        """Test search endpoint"""
        response = self.client.get("/api/search/", {"q": "Test"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data["results"]), 0)
    
    def test_search_requires_query(self):
        """Test search returns error without query param"""
        response = self.client.get("/api/search/")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_featured_posts_endpoint(self):
        """Test featured posts endpoint"""
        # Make the post featured
        self.post.is_featured = True
        self.post.save()
        
        response = self.client.get("/api/posts/featured/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_trending_posts_endpoint(self):
        """Test trending posts endpoint"""
        response = self.client.get("/api/posts/trending/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LikeBookmarkAPITest(APITestCase):
    """Tests for Like and Bookmark endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="liker",
            password="pass123"
        )
        self.token = Token.objects.create(user=self.user)
        
        self.author = User.objects.create_user(
            username="author",
            password="pass123"
        )
        
        self.post = Post.objects.create(
            title="Likeable Post",
            content="G" * 150,
            author=self.author,
            status="published"
        )
    
    def test_like_requires_auth(self):
        """Test liking a post requires authentication"""
        response = self.client.post(f"/api/posts/{self.post.id}/like/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_like_post(self):
        """Test liking a post"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response = self.client.post(f"/api/posts/{self.post.id}/like/")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "liked")
    
    def test_unlike_post(self):
        """Test unliking a post (toggle behavior)"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        
        # Like first
        self.client.post(f"/api/posts/{self.post.id}/like/")
        
        # Unlike (call again)
        response = self.client.post(f"/api/posts/{self.post.id}/like/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "unliked")
    
    def test_bookmark_post(self):
        """Test bookmarking a post"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        response = self.client.post(f"/api/posts/{self.post.id}/bookmark/")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "bookmarked")
    
    def test_user_bookmarks_endpoint(self):
        """Test user bookmarks list endpoint"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        
        # Create a bookmark
        Bookmark.objects.create(post=self.post, user=self.user)
        
        response = self.client.get("/api/user/bookmarks/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)


class CategoryTagAPITest(APITestCase):
    """Tests for Category and Tag endpoints"""
    
    def setUp(self):
        self.category = Category.objects.create(
            name="Coffee Culture",
            description="All about coffee"
        )
        self.tag = Tag.objects.create(name="Espresso")
    
    def test_list_categories(self):
        """Test listing categories"""
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_retrieve_category_by_slug(self):
        """Test retrieving category by slug"""
        response = self.client.get(f"/api/categories/{self.category.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Coffee Culture")
    
    def test_list_tags(self):
        """Test listing tags"""
        response = self.client.get("/api/tags/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CommentAPITest(APITestCase):
    """Tests for Comment endpoints"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="commenter",
            password="pass123"
        )
        self.token = Token.objects.create(user=self.user)
        
        self.author = User.objects.create_user(
            username="author",
            password="pass123"
        )
        
        self.post = Post.objects.create(
            title="Commentable Post",
            content="H" * 150,
            author=self.author,
            status="published"
        )
    
    def test_list_comments(self):
        """Test listing comments"""
        Comment.objects.create(
            post=self.post,
            author=self.user,
            content="Nice post!"
        )
        
        response = self.client.get("/api/comments/", {"post": str(self.post.id)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_comment_requires_auth(self):
        """Test creating comment requires authentication"""
        data = {
            "post": str(self.post.id),
            "content": "Anonymous comment"
        }
        response = self.client.post("/api/comments/", data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_comment_authenticated(self):
        """Test creating comment when authenticated"""
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")
        data = {
            "post": str(self.post.id),
            "content": "Authenticated comment"
        }
        response = self.client.post("/api/comments/", data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class PostBySlugTest(APITestCase):
    """Tests for post by slug endpoint"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username="author",
            password="pass123"
        )
        self.post = Post.objects.create(
            title="Slug Test Post",
            content="I" * 150,
            author=self.user,
            status="published"
        )
    
    def test_get_post_by_slug(self):
        """Test retrieving post by slug"""
        response = self.client.get(f"/api/posts/slug/{self.post.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Slug Test Post")
    
    def test_get_nonexistent_slug_returns_404(self):
        """Test 404 for nonexistent slug"""
        response = self.client.get("/api/posts/slug/nonexistent-slug/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
