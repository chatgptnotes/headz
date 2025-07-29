from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class HairstyleCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Hairstyle Categories"

class Hairstyle(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(HairstyleCategory, on_delete=models.CASCADE, related_name='hairstyles')
    description = models.TextField()
    image = models.ImageField(upload_to='hairstyles/')
    gender_choices = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('U', 'Unisex'),
    ]
    gender = models.CharField(max_length=1, choices=gender_choices, default='U')
    length_choices = [
        ('short', 'Short'),
        ('medium', 'Medium'),
        ('long', 'Long'),
    ]
    length = models.CharField(max_length=10, choices=length_choices)
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True)
    preferred_stylist = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

class TryOnSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tryon_sessions')
    original_photo = models.ImageField(upload_to='tryon/originals/')
    hairstyle = models.ForeignKey(Hairstyle, on_delete=models.CASCADE)
    result_photo = models.ImageField(upload_to='tryon/results/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_saved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} - {self.hairstyle.name} - {self.created_at}"

class SavedHairstyle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_hairstyles')
    hairstyle = models.ForeignKey(Hairstyle, on_delete=models.CASCADE)
    tryon_session = models.ForeignKey(TryOnSession, on_delete=models.CASCADE, null=True, blank=True)
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'hairstyle']
    
    def __str__(self):
        return f"{self.user.username} saved {self.hairstyle.name}"

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    service_choices = [
        ('consultation', 'Initial Consultation'),
        ('hair_fixing', 'Hair Fixing Service'),
        ('maintenance', 'Maintenance Service'),
        ('styling', 'Styling Service'),
    ]
    service = models.CharField(max_length=20, choices=service_choices)
    date = models.DateField()
    time = models.TimeField()
    notes = models.TextField(blank=True)
    status_choices = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.service} - {self.date}"
    
    class Meta:
        ordering = ['date', 'time']
