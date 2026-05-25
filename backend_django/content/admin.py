from django.contrib import admin
from .models import Guide, Hospital, News

@admin.register(Guide)
class GuideAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_at')
    search_fields = ('title', 'category')
    list_filter = ('category',)

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'is_active')
    search_fields = ('name', 'address')
    list_filter = ('is_active',)

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_date', 'is_active')
    search_fields = ('title',)
    list_filter = ('is_active',)
