# Coffee'n me - Blog Website

A modern, minimalist blog built with Django featuring a clean design with terracotta accents.

## Features

- **Clean, Modern Design**: Minimalist aesthetic with crisp white background and terracotta accents
- **Featured Post Layout**: Prominent featured post on homepage with grid layout for other posts
- **Reader-Friendly Article Pages**: Single-column layout optimized for reading
- **Admin Panel**: Easy content management through Django admin
- **Responsive Design**: Works beautifully on desktop and mobile devices

## Design Specifications

- **Colors**: Crisp white background, dark grey text, vibrant terracotta accent (#d2691e)
- **Fonts**: Poppins for headings, Open Sans for body text
- **Layout**: Featured post + two-column grid on homepage, single-column article pages

## Setup Instructions

1. **Navigate to the project directory:**
   ```bash
   cd coffeeme_project
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser account:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

7. **Access the website:**
   - Main site: http://127.0.0.1:8000/
   - Admin panel: http://127.0.0.1:8000/admin/

## Adding Content

1. Go to the admin panel at http://127.0.0.1:8000/admin/
2. Log in with your superuser credentials
3. Click on "Posts" to add new blog posts
4. Set `is_featured` to True for the post you want to feature on the homepage
5. Upload a featured image for each post
6. Add an excerpt for better homepage display

## Project Structure

```
coffeeme_project/
├── coffeeme_project/          # Main project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── blog/                      # Blog application
│   ├── models.py              # Post model
│   ├── views.py               # Homepage and article views
│   ├── admin.py               # Admin configuration
│   └── templates/blog/        # HTML templates
│       ├── base.html          # Base template with styling
│       ├── home.html          # Homepage template
│       └── post_detail.html   # Article page template
├── manage.py
└── requirements.txt
```

## Customization

The design is fully customizable through the CSS in `base.html`. Key design elements:

- **Colors**: Modify the CSS variables for different color schemes
- **Typography**: Change fonts by updating the Google Fonts import
- **Layout**: Adjust grid layouts and spacing in the CSS
- **Images**: Add your logo and customize the styling

## Next Steps

- Add more content through the admin panel
- Customize the design further if needed
- Deploy to a hosting service when ready to go live
