import React, { useState, useEffect } from 'react';
import { HeartIcon, ShareIcon, BookmarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { getHairstyles, getHairstyleCategories, saveHairstyle, removeSavedHairstyle, getSavedHairstyles } from '../services/supabaseService';
import { getCurrentUser } from '../services/supabaseService';
import { handleImageError } from '../utils/imageUtils';
import UploadHairstyleModal from '../components/UploadHairstyleModal';
import type { Database } from '../lib/supabase';

type Hairstyle = Database['public']['Tables']['hairstyles']['Row'] & {
  hairstyle_categories: {
    id: string;
    name: string;
    description: string;
  };
  category?: string; // Django category ID
  category_name?: string; // Django category name
  image?: string; // Django image field
  isLiked?: boolean;
  isSaved?: boolean;
};

type HairstyleCategory = Database['public']['Tables']['hairstyle_categories']['Row'];

export default function GalleryPage() {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [categories, setCategories] = useState<HairstyleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [savedHairstyles, setSavedHairstyles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Load categories and hairstyles
      const [categoriesData, hairstylesData] = await Promise.all([
        getHairstyleCategories(),
        getHairstyles()
      ]);

      setCategories(categoriesData);
      setHairstyles(hairstylesData as Hairstyle[]);

      // Load saved hairstyles if user is authenticated
      if (currentUser) {
        const saved = await getSavedHairstyles(currentUser.id);
        const savedIds = saved.map(item => item.hairstyle_id);
        setSavedHairstyles(savedIds);
        
        // Mark saved hairstyles
        setHairstyles(prev => prev.map(style => ({
          ...style,
          isSaved: savedIds.includes(style.id)
        })));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (hairstyleId: string) => {
    if (!user) {
      alert('Please log in to like hairstyles');
      return;
    }

    setHairstyles(prev =>
      prev.map(style =>
        style.id === hairstyleId
          ? { ...style, isLiked: !style.isLiked, likes: (style.isLiked ? style.likes - 1 : style.likes + 1) }
          : style
      )
    );
  };

  const handleSave = async (hairstyleId: string) => {
    if (!user) {
      alert('Please log in to save hairstyles');
      return;
    }

    try {
      if (savedHairstyles.includes(hairstyleId)) {
        // Remove from saved
        await removeSavedHairstyle(user.id, hairstyleId);
        setSavedHairstyles(prev => prev.filter(id => id !== hairstyleId));
        setHairstyles(prev =>
          prev.map(style =>
            style.id === hairstyleId ? { ...style, isSaved: false } : style
          )
        );
      } else {
        // Add to saved
        await saveHairstyle({
          user_id: user.id,
          hairstyle_id: hairstyleId
        });
        setSavedHairstyles(prev => [...prev, hairstyleId]);
        setHairstyles(prev =>
          prev.map(style =>
            style.id === hairstyleId ? { ...style, isSaved: true } : style
          )
        );
      }
    } catch (error) {
      console.error('Error saving hairstyle:', error);
      alert('Failed to save hairstyle');
    }
  };

  const filteredHairstyles = selectedCategory === 'all'
    ? hairstyles
    : hairstyles.filter(style => style.hairstyle_categories?.id === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hairstyles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Hairstyle Gallery</h1>
            </div>
            <div className="flex-1 flex justify-end">
              {user && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Upload Hairstyle</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our collection of trending hairstyles and find your perfect look
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`btn rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'btn-primary shadow-lg transform scale-105'
                : 'btn-secondary hover:shadow-md hover:transform hover:scale-105'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`btn rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'btn-primary shadow-lg transform scale-105'
                  : 'btn-secondary hover:shadow-md hover:transform hover:scale-105'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredHairstyles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hairstyles found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHairstyles.map((style) => (
              <div key={style.id} className="gallery-item group bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-ratio-4-5 bg-gray-200 overflow-hidden relative">
                  <img
                    src={style.image_url}
                    alt={style.name}
                    className="object-cover object-center w-full h-full"
                    onError={(e) => handleImageError(e, 'hairstyle')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleSave(style.id)}
                      className={`bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors ${
                        style.isSaved ? 'text-primary' : 'text-gray-700'
                      }`}
                    >
                      <BookmarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{style.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{style.hairstyle_categories?.name}</p>
                    <p className="text-xs text-gray-400 mt-1 capitalize">
                      {style.gender === 'M' ? 'Men' : style.gender === 'F' ? 'Women' : 'Unisex'} • {style.length}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLike(style.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group/like"
                    >
                      {style.isLiked ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 group-hover/like:scale-110 transition-transform" />
                      )}
                      <span className="text-sm font-semibold">{style.likes}</span>
                    </button>
                    <div className="flex space-x-3">
                      <button className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:scale-110 transform">
                        <ShareIcon className="h-5 w-5" />
                      </button>
                      <button className="btn btn-primary btn-sm px-4 py-2 text-xs">
                        Try Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadHairstyleModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={() => {
          // Reload hairstyles after successful upload
          loadData();
        }}
        categories={categories}
      />
    </div>
  );
}