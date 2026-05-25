from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ('name', 'slug', 'parent', 'created_at')
    list_filter         = ('parent',)
    search_fields       = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields     = ('id', 'created_at')
