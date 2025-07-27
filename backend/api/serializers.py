from rest_framework import serializers
from django.contrib.auth.models import User
from .models import HairstyleCategory, Hairstyle, UserProfile, TryOnSession, SavedHairstyle, Appointment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'phone', 'profile_picture', 'preferred_stylist', 'created_at']

class HairstyleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HairstyleCategory
        fields = ['id', 'name', 'description']

class HairstyleSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Hairstyle
        fields = ['id', 'name', 'category', 'category_name', 'description', 'image', 
                  'gender', 'length', 'likes', 'created_at', 'updated_at']

class TryOnSessionSerializer(serializers.ModelSerializer):
    hairstyle_details = HairstyleSerializer(source='hairstyle', read_only=True)
    
    class Meta:
        model = TryOnSession
        fields = ['id', 'user', 'original_photo', 'hairstyle', 'hairstyle_details', 
                  'result_photo', 'created_at', 'is_saved']
        read_only_fields = ['user', 'created_at']

class SavedHairstyleSerializer(serializers.ModelSerializer):
    hairstyle_details = HairstyleSerializer(source='hairstyle', read_only=True)
    
    class Meta:
        model = SavedHairstyle
        fields = ['id', 'user', 'hairstyle', 'hairstyle_details', 'tryon_session', 'saved_at']
        read_only_fields = ['user', 'saved_at']

class AppointmentSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'user', 'user_details', 'service', 'date', 'time', 
                  'notes', 'status', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']