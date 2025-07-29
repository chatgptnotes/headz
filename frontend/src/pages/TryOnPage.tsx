
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PhotoIcon, SparklesIcon, XMarkIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import Webcam from 'react-webcam';
import { getHairstyles, createTryOnSession, uploadPhoto, getCurrentUser } from '../services/supabaseService';
import type { Database } from '../lib/supabase';
import './TryOnPage.css';

type Hairstyle = Database['public']['Tables']['hairstyles']['Row'] & {
  hairstyle_categories: {
    id: string;
    name: string;
    description: string;
  };
};

export default function TryOnPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<Hairstyle | null>(null);
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<'female' | 'male'>('female');
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
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelectedImage(imageSrc);
      setShowCamera(false);
    }
  }, [webcamRef]);

  const resetUpload = () => {
    setSelectedImage(null);
    setShowCamera(false);
    setSelectedStyle(null);
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
    <div className="try-on-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">
                <SparklesIcon />
              </div>
              <span className="logo-text">fotor</span>
            </div>
            <div className="editor-dropdown">
              <span>AI Photo Editor</span>
              <ChevronDownIcon />
            </div>
            <button className="upload-btn">
              <PlusIcon />
              <span>Upload Image</span>
            </button>
          </div>
          <div className="header-right">
            <button className="download-btn">
              Download
            </button>
            <div className="promo-text">🏷️ Up to 30% Off</div>
            <div className="user-avatar"></div>
          </div>
        </div>
      </div>



      {/* AI Hairstyle Panel */}
      <div className="hairstyle-panel">
        {/* Panel Header */}
        <div className="panel-header">
          <div className="panel-title">
            <div className="panel-title-left">
              <SparklesIcon />
              <span className="panel-title-text">AI Hairstyle</span>
            </div>
            <button className="close-btn">
              <XMarkIcon />
            </button>
          </div>

          {/* Gender Selection */}
          <div className="gender-selection">
            <button
              onClick={() => setActiveCategory('female')}
              className={`gender-btn ${activeCategory === 'female' ? 'active' : ''}`}
            >
              👩 Female
            </button>
            <button
              onClick={() => setActiveCategory('male')}
              className={`gender-btn ${activeCategory === 'male' ? 'active' : ''}`}
            >
              👨 Male
            </button>
          </div>
        </div>

        {/* Hairstyle Grid */}
        <div className="hairstyle-grid-container">
          {/* Sample Hairstyles Grid - 3x3 layout like Fotor */}
          <div className="hairstyle-grid">
            {/* Row 1 */}
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop&crop=face" alt="Long Wavy Hair" />
            </div>
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop&crop=face" alt="Bob Cut" />
            </div>
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=200&h=200&fit=crop&crop=face" alt="Pixie Cut" />
            </div>

            {/* Row 2 */}
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1595475038665-8de2a4b72bbf?w=200&h=200&fit=crop&crop=face" alt="Beach Waves" />
            </div>
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=200&fit=crop&crop=face" alt="Straight Hair" />
            </div>
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&h=200&fit=crop&crop=face" alt="Curly Hair" />
            </div>

            {/* Row 3 */}
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=200&h=200&fit=crop&crop=face" alt="Updo Style" />
            </div>
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=200&h=200&fit=crop&crop=face" alt="Braided Hair" />
            </div>
            <div className="hairstyle-item">
              <img src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=200&h=200&fit=crop&crop=face" alt="Layered Cut" />
            </div>
          </div>

          {/* Color Palette */}
          <div className="color-palette">
            <div className="color-swatch gray"></div>
            <div className="color-swatch dark"></div>
            <div className="color-swatch yellow"></div>
            <div className="color-swatch brown"></div>
            <div className="color-swatch red"></div>
            <div className="color-swatch black"></div>
            <div className="color-swatch gradient"></div>
          </div>

          {/* Generate Button */}
          <div className="action-buttons">
            <button className="generate-btn">
              ⚡ Generate ✨ 2
            </button>
            <button className="apply-btn">
              Apply
            </button>
            <button className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>

      </div>

      {/* Main Canvas Area - Fotor Style */}
      <div className="main-canvas">
        {/* Canvas Content */}
        <div className="canvas-content">
          {!selectedImage && !showCamera ? (
            /* Upload Area - Fotor Style */
            <div className="upload-area">
              {/* Upload Icon */}
              <div className="upload-icon-container">
                <div className="upload-icon">
                  <PhotoIcon />
                  <div className="upload-icon-plus">
                    <PlusIcon />
                  </div>
                </div>
              </div>

              <h3 className="upload-title">
                Drag or upload your own images
              </h3>
              <p className="upload-subtitle">
                Click to <span className="upload-link">view the upload guide</span> for best results
              </p>

              {/* Upload Button */}
              <div className="upload-button-container">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="main-upload-btn"
                >
                  <PlusIcon />
                  <span>Upload Image</span>
                </button>
              </div>

              {/* Sample Images */}
              <div className="sample-images-text">No photos? Try one of ours.</div>
              <div className="sample-images">
                <div className="sample-image">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" alt="Sample 1" />
                </div>
                <div className="sample-image">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" alt="Sample 2" />
                </div>
                <div className="sample-image">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" alt="Sample 3" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden-input"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          ) : showCamera ? (
            /* Camera View - Fotor Style */
            <div className="camera-view">
              <div className="camera-header">
                <h3 className="camera-title">Take Your Photo</h3>
                <p className="camera-subtitle">Position yourself in the frame</p>
              </div>
              <div className="camera-container">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                />
              </div>
              <div className="camera-buttons">
                <button
                  onClick={capture}
                  className="capture-btn"
                >
                  📷 Capture
                </button>
                <button
                  onClick={() => setShowCamera(false)}
                  className="camera-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Image Preview - Fotor Style */
            <div className="image-preview">
              <div className="preview-header">
                <h2 className="preview-title">Your Virtual Makeover</h2>
                <p className="preview-subtitle">AI-generated hairstyle preview</p>
              </div>

              <div className="preview-content">
                {/* Single Image Display */}
                <div className="preview-image-container">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="preview-image"
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <PhotoIcon />
                      <p className="preview-placeholder-text">Upload a photo to preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="preview-actions">
                <button
                  onClick={resetUpload}
                  className="reset-btn"
                >
                  🔄 Reset
                </button>
                <button
                  onClick={handleSaveAndBook}
                  disabled={loading}
                  className="save-btn"
                >
                  {loading ? '⏳ Saving...' : '💾 Save Result'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
