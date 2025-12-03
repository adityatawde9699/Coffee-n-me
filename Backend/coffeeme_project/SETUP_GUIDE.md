# Quick Setup Guide

## Fix the Current Issues

You're seeing two errors that need to be fixed:

### 1. Install Pillow (Required for ImageField)
```bash
pip install Pillow
```

### 2. Static Directory Already Created
The static directory has been created automatically.

## Complete Setup Steps

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Run the setup script (optional - creates sample data):**
   ```bash
   python setup.py
   ```

5. **Start the server:**
   ```bash
   python manage.py runserver
   ```

## Access Your Blog

- **Main website:** http://127.0.0.1:8000/
- **Admin panel:** http://127.0.0.1:8000/admin/

## Troubleshooting

If you still see the Pillow error, try:
```bash
pip install --upgrade Pillow
```

The static directory warning is just a warning and won't prevent the site from working.
