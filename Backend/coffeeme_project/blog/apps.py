from django.apps import AppConfig  # pyright: ignore[reportMissingImports]


class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog'
