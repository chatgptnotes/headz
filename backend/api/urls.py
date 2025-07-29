from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, UserProfileViewSet, HairstyleCategoryViewSet,
    HairstyleViewSet, TryOnSessionViewSet, SavedHairstyleViewSet,
    AppointmentViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', UserProfileViewSet)
router.register(r'categories', HairstyleCategoryViewSet)
router.register(r'hairstyles', HairstyleViewSet)
router.register(r'tryon-sessions', TryOnSessionViewSet, basename='tryonsession')
router.register(r'saved-hairstyles', SavedHairstyleViewSet, basename='savedhairstyle')
router.register(r'appointments', AppointmentViewSet, basename='appointment')

urlpatterns = [
    path('', include(router.urls)),
]