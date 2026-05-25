from django.db import models

class Guide(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)  # e.g., 'SOS', 'RCP', 'Quemaduras', etc.
    content = models.TextField()
    image = models.ImageField(upload_to='guides/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Hospital(models.Model):
    objects = models.Manager()
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    operating_hours = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class News(models.Model):
    objects = models.Manager()
    title = models.CharField(max_length=255)
    summary = models.TextField()
    content = models.TextField()
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    published_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title
