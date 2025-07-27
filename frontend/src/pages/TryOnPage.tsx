import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CameraIcon, PhotoIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Webcam from 'react-webcam';
import { getHairstyles, createTryOnSession, uploadPhoto, getCurrentUser } from '../services/supabaseService';
import { handleImageError } from '../utils/imageUtils';
import type { Database } from '../lib/supabase';

type Hairstyle = Database['public']['Tables']['hairstyles']['Row'] & {
  hairstyle_categories: {
    id: string;
    name: string;
    description: string;
  };
};

export default function TryOnPage() {
  const [step, setStep] = useState<'upload' | 'capture' | 'select' | 'preview'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Hairstyle | null>(null);
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHairstyles();
    getCurrentUser().then(setUser);
  }, []);

  const loadHairstyles = async () => {
    try {
      const data = await getHairstyles();
      setHairstyles(data as Hairstyle[]);
    } catch (error) {
      console.error('Error loading hairstyles:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setStep('select');
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setShowCamera(false);
      setStep('select');
    }
  }, [webcamRef]);

  const resetUpload = () => {
    setSelectedImage(null);
    setStep('upload');
    setShowCamera(false);
  };

  const handleSaveAndBook = async () => {
    if (!user) {
      alert('Please log in to save your try-on session');
      return;
    }

    if (!selectedImage || !selectedStyle) {
      alert('Please select both an image and a hairstyle');
      return;
    }

    try {
      setLoading(true);
      
      // Upload the original photo
      const file = dataURLtoFile(selectedImage, 'tryon-photo.jpg');
      const originalPhotoUrl = await uploadPhoto(file, 'tryon/originals');
      
      // Create try-on session
      await createTryOnSession({
        user_id: user.id,
        original_photo_url: originalPhotoUrl,
        hairstyle_id: selectedStyle.id,
        result_photo_url: originalPhotoUrl, // For now, using same image as result
        is_saved: true
      });

      alert('Try-on session saved successfully! You can now book an appointment.');
      // Navigate to booking page or show booking modal
    } catch (error) {
      console.error('Error saving try-on session:', error);
      alert('Failed to save try-on session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Virtual Hair Try-On</h1>
          <p className="mt-2 text-lg text-gray-600">
            Upload a photo or use your camera to try different hairstyles
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center">
              <li className={`progress-step ${step === 'upload' ? '' : 'step-inactive'}`}>
                <div className="flex items-center">
                  <span className="step-number">1</span>
                  <span className="step-text">Upload Photo</span>
                </div>
              </li>
              <ArrowRightIcon className="arrow-icon" />
              <li className={`progress-step ${step === 'select' ? '' : 'step-inactive'}`}>
                <div className="flex items-center">
                  <span className="step-number">2</span>
                  <span className="step-text">Select Style</span>
                </div>
              </li>
              <ArrowRightIcon className="arrow-icon" />
              <li className={`progress-step ${step === 'preview' ? '' : 'step-inactive'}`}>
                <div className="flex items-center">
                  <span className="step-number">3</span>
                  <span className="step-text">Preview & Save</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Upload/Capture Section */}
        {step === 'upload' && !showCamera && (
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="upload-card"
              >
                <PhotoIcon className="icon" />
                <span className="title">Upload Photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              <div
                onClick={() => setShowCamera(true)}
                className="upload-card"
              >
                <CameraIcon className="icon" />
                <span className="title">Use Camera</span>
              </div>
            </div>
          </div>
        )}

        {/* Camera View */}
        {showCamera && (
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={capture}
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Capture Photo
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="inline-flex items-center rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Image Preview */}
        {selectedImage && step === 'select' && (
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Photo</h3>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full rounded-lg shadow-lg"
                />
                <button
                  onClick={resetUpload}
                  className="mt-4 text-sm text-gray-600 hover:text-gray-900"
                >
                  Use a different photo
                </button>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Select a Hairstyle</h3>
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {hairstyles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => {
                        setSelectedStyle(style);
                        setStep('preview');
                      }}
                      className="cursor-pointer border-2 border-gray-200 rounded-lg p-3 hover:border-primary transition-colors"
                    >
                      <img
                        src={style.image_url}
                        alt={style.name}
                        className="w-full h-32 object-cover rounded-md mb-2"
                        onError={(e) => handleImageError(e, 'hairstyle')}
                      />
                      <p className="text-sm font-medium text-center">{style.name}</p>
                      <p className="text-xs text-gray-500 text-center capitalize">
                        {style.hairstyle_categories?.name} • {style.length}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Before/After Preview */}
        {step === 'preview' && selectedImage && selectedStyle && (
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview Your New Look</h2>
              <p className="text-gray-600">Compare your original photo with the new hairstyle</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Before */}
              <div className="card shadow-sm border border-gray-200">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Before</h3>
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="card shadow-sm border border-gray-200">
                <div className="card-body">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">After - {selectedStyle.name}</h3>
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="With new hairstyle"
                      className="w-full rounded-lg shadow-md"
                    />
                    {/* Overlay to simulate hairstyle application */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-lg pointer-events-none" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-gray-700">{selectedStyle.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setStep('select')}
                className="btn btn-secondary"
                disabled={loading}
              >
                Try Different Style
              </button>
              <button
                onClick={resetUpload}
                className="btn btn-secondary"
                disabled={loading}
              >
                Use Different Photo
              </button>
              <button 
                onClick={handleSaveAndBook}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save & Book Appointment'}
              </button>
            </div>

            {/* Style Information */}
            <div className="mt-8 card shadow-sm border border-gray-200">
              <div className="card-body">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Style Name</h4>
                    <p className="text-gray-600">{selectedStyle.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <p className="text-gray-600">{selectedStyle.hairstyle_categories?.name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Length</h4>
                    <p className="text-gray-600 capitalize">{selectedStyle.length}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedStyle.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}