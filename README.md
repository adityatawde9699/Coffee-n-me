# Coffee'n me

A personal blogging platform with a coffee-themed aesthetic, featuring a Django REST Framework backend and React frontend. The system provides a complete blog management solution including post creation with rich text editing, categorization, tagging, user interactions (likes, bookmarks, comments), and a custom admin dashboard.

## Features

### Implemented

**Backend (API)**
- RESTful API with Django REST Framework
- Token-based authentication via `rest_framework.authtoken`
- Blog post CRUD with UUID primary keys
- Category and tag management with auto-generated slugs
- Nested comment system with replies
- Like and bookmark functionality (per-user)
- Search endpoint with full-text search across title, content, and tags
- Pagination with configurable page sizes
- Rate limiting (100 req/hour anonymous, 1000 req/hour authenticated)
- Featured and trending post endpoints
- View count tracking
- Reading time calculation
- Related posts by category and tags

**Frontend**
- React 18 with TypeScript
- Component library using Radix UI primitives
- Animations with Framer Motion
- Token-based authentication with persistent sessions
- Protected admin routes
- Blog post viewer with table of contents
- Search modal with live results
- Category browsing
- Dark mode toggle
- Responsive design
- Newsletter signup component (UI only)

**Admin Panel**
- Custom React-based admin dashboard
- Post creation with rich text editor (React Quill)
- Dashboard with post statistics
- Django admin integration for data management

**DevOps**
- Render.com deployment configuration
- PostgreSQL support via `dj-database-url`
- Static file serving with WhiteNoise
- GitHub Actions CI pipeline (tests, build, security scan)
- Environment variable templates

### Partial/Experimental

- Bookmarks page (placeholder component)
- Settings page (placeholder component)
- Newsletter backend (frontend UI exists, no backend integration)

## Tech Stack

### Backend
| Component | Technology |
|-----------|------------|
| Framework | Django 5.2+, Django REST Framework |
| Database | SQLite (development), PostgreSQL (production) |
| Authentication | Token Authentication |
| Rich Text | django-summernote |
| Filtering | django-filter |
| CORS | django-cors-headers |
| Static Files | WhiteNoise |

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18, Vite |
| Language | TypeScript |
| UI Components | Radix UI |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Routing | React Router v7 |
| Rich Text Editor | React Quill |
| Styling | CSS (custom) |

### DevOps
| Component | Technology |
|-----------|------------|
| Deployment | Render.com |
| CI/CD | GitHub Actions |
| Server | Gunicorn |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Coffee'n me                             │
├───────────────────────────┬─────────────────────────────────────┤
│      Frontend (React)     │         Backend (Django)            │
│      Port: 5173           │         Port: 8000                  │
├───────────────────────────┼─────────────────────────────────────┤
│                           │                                     │
│  src/                     │  blog/                              │
│  ├── components/          │  ├── models.py (Post, Category,     │
│  │   ├── Header           │  │              Tag, Comment,       │
│  │   ├── BlogPost         │  │              Like, Bookmark)     │
│  │   ├── SearchModal      │  ├── views.py (ViewSets, endpoints) │
│  │   └── ...              │  ├── serializers.py                 │
│  ├── context/             │  └── urls.py                        │
│  │   └── AuthContext      │                                     │
│  ├── pages/admin/         │  App/                               │
│  │   ├── Dashboard        │  ├── settings.py                    │
│  │   ├── WriteBlog        │  └── urls.py                        │
│  │   └── Login            │                                     │
│  ├── lib/api.ts           │                                     │
│  └── types/api.ts         │                                     │
│                           │                                     │
└───────────────────────────┴─────────────────────────────────────┘
                    │                       │
                    │   HTTP/JSON (REST)    │
                    └───────────────────────┘
```

**Data Flow:**
1. Frontend makes authenticated requests via Axios interceptor
2. Backend validates token via `TokenAuthentication`
3. ViewSets handle CRUD operations with serializers
4. Responses include nested related data (author, category, tags)

## Setup and Installation

### Prerequisites
- Python 3.12+ (Python 3.14 requires Django 5.2+)
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd Backend/coffeeme_project

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

**Backend** (`Backend/coffeeme_project/.env`)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=  # Leave empty for SQLite
```

**Frontend** (`Frontend/.env.local`)
```
VITE_API_BASE_URL=http://localhost:8000
```

## Usage

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/home/` | GET | Homepage data (featured, latest, trending) |
| `/api/posts/` | GET, POST | List/create posts |
| `/api/posts/{id}/` | GET, PUT, DELETE | Retrieve/update/delete post |
| `/api/posts/{id}/like/` | POST | Toggle like |
| `/api/posts/{id}/bookmark/` | POST | Toggle bookmark |
| `/api/posts/featured/` | GET | Featured posts |
| `/api/posts/trending/` | GET | Trending by view count |
| `/api/categories/` | GET | List categories |
| `/api/tags/` | GET | List tags |
| `/api/search/?q=query` | GET | Search posts |
| `/api/me/` | GET | Current user profile (auth required) |
| `/api/token-auth/` | POST | Obtain auth token |

### Running Tests

```bash
cd Backend/coffeeme_project
python manage.py test blog.tests --verbosity=2
```

## Project Structure

```
Coffee'n me/
├── Backend/
│   └── coffeeme_project/
│       ├── App/                 # Django project settings
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       ├── blog/                # Main application
│       │   ├── models.py        # Data models
│       │   ├── views.py         # API views
│       │   ├── serializers.py   # DRF serializers
│       │   ├── urls.py          # API routes
│       │   ├── admin.py         # Django admin config
│       │   └── tests/           # Test suite
│       ├── media/               # User uploads
│       └── requirements.txt
├── Frontend/
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── context/             # React contexts
│   │   ├── pages/               # Route pages
│   │   ├── lib/                 # API client
│   │   ├── types/               # TypeScript definitions
│   │   └── App.tsx              # Main app component
│   ├── package.json
│   └── vite.config.ts
├── .github/
│   └── workflows/ci.yml         # CI pipeline
└── render.yaml                  # Deployment config
```

## Known Limitations

1. **Authentication**: Token-based auth without refresh tokens; tokens do not expire automatically.
2. **Image Storage**: Media files stored on local filesystem; not suitable for horizontal scaling without external storage (S3, Cloudinary).
3. **Search**: Basic `icontains` search; no full-text search indexing or relevance ranking.
4. **Rate Limiting**: In-memory throttling; resets on server restart. Not suitable for multi-instance deployments without shared cache.
5. **Comments**: No moderation queue in custom admin; requires Django admin for approval.
6. **Newsletter**: Frontend form exists but no backend integration.
7. **Testing**: No frontend tests implemented; backend has unit and API tests only.

## Future Improvements

1. **JWT Authentication** - Replace token auth with JWT including refresh token rotation
2. **Cloud Storage** - Integrate S3 or Cloudinary for media files
3. **Full-Text Search** - Implement PostgreSQL full-text search or Elasticsearch
4. **Redis Cache** - Add caching layer for rate limiting and frequently accessed data
5. **Frontend Tests** - Add Vitest + React Testing Library coverage
6. **Email Integration** - Newsletter subscription backend with email service
7. **Comment Moderation** - Admin dashboard moderation queue
8. **SEO Improvements** - Server-side rendering or static generation for public pages

## Screenshots

Add screenshots to `/docs/screenshots/` directory:
- Homepage with featured article
- Blog post view
- Admin dashboard
- Mobile responsive view

---

## License

This project is for educational and portfolio purposes.
