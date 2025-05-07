from django.db import models
from django.contrib.auth.models import User
from ckeditor.fields import RichTextField
from django.utils.text import slugify

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('private', 'Private'),
    ]
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    body = RichTextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.CharField(max_length=200, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base = self.title or str(self.author.username)
            self.slug = slugify(base + '-' + str(self.created_at.timestamp()))
        super().save(*args, **kwargs)

class Image(models.Model):
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.ImageField(upload_to='uploads/%Y/%m/%d/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Book(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    author_name = models.CharField(max_length=200)
    cover_image = models.ImageField(upload_to='books/%Y/%m/%d/')
    link = models.URLField(blank=True)
    description = models.TextField(blank=True)