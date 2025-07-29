from django.contrib import admin
from .models import HairstyleCategory, Hairstyle, UserProfile, TryOnSession, SavedHairstyle, Appointment

@admin.register(HairstyleCategory)
class HairstyleCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

@admin.register(Hairstyle)
class HairstyleAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'gender', 'length', 'likes', 'created_at']
    list_filter = ['category', 'gender', 'length']
    search_fields = ['name', 'description']
    ordering = ['-created_at']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'preferred_stylist', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone']

@admin.register(TryOnSession)
class TryOnSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'hairstyle', 'created_at', 'is_saved']
    list_filter = ['is_saved', 'created_at']
    search_fields = ['user__username', 'hairstyle__name']

@admin.register(SavedHairstyle)
class SavedHairstyleAdmin(admin.ModelAdmin):
    list_display = ['user', 'hairstyle', 'saved_at']
    search_fields = ['user__username', 'hairstyle__name']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'service', 'date', 'time', 'status', 'created_at']
    list_filter = ['service', 'status', 'date']
    search_fields = ['user__username', 'user__email']
    ordering = ['date', 'time']
