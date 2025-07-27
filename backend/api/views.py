from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import HairstyleCategory, Hairstyle, UserProfile, TryOnSession, SavedHairstyle, Appointment
from .serializers import (
    UserSerializer, UserProfileSerializer, HairstyleCategorySerializer,
    HairstyleSerializer, TryOnSessionSerializer, SavedHairstyleSerializer,
    AppointmentSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return UserProfile.objects.all()
        return UserProfile.objects.filter(user=self.request.user)

class HairstyleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HairstyleCategory.objects.all()
    serializer_class = HairstyleCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HairstyleViewSet(viewsets.ModelViewSet):
    queryset = Hairstyle.objects.all()
    serializer_class = HairstyleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'likes', 'created_at']
    
    def get_queryset(self):
        queryset = Hairstyle.objects.all()
        category = self.request.query_params.get('category', None)
        gender = self.request.query_params.get('gender', None)
        length = self.request.query_params.get('length', None)
        
        if category:
            queryset = queryset.filter(category__name=category)
        if gender:
            queryset = queryset.filter(gender=gender)
        if length:
            queryset = queryset.filter(length=length)
            
        return queryset
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        hairstyle = self.get_object()
        hairstyle.likes += 1
        hairstyle.save()
        return Response({'likes': hairstyle.likes})

class TryOnSessionViewSet(viewsets.ModelViewSet):
    serializer_class = TryOnSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TryOnSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedHairstyleViewSet(viewsets.ModelViewSet):
    serializer_class = SavedHairstyleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedHairstyle.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Appointment.objects.all()
        return Appointment.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        if appointment.user != request.user and not request.user.is_staff:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'status': 'cancelled'})
