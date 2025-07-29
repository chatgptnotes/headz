// Image utility functions for the Headz application

// Sample hairstyle images with different categories and styles
export const sampleHairstyleImages = {
  // Men's Hairstyles
  mens: {
    classic_fade: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    textured_quiff: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&crop=face',
    pompadour: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop&crop=face',
    buzz_cut: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
    side_part: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    crew_cut: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
    undercut: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop&crop=face',
    slick_back: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face'
  },
  // Women's Hairstyles
  womens: {
    sleek_bob: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop&crop=face',
    beach_waves: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    pixie_cut: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&crop=face',
    long_layers: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
    curly_bob: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&crop=face',
    straight_long: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    messy_bun: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&crop=face',
    braided_updo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face'
  },
  // Unisex Hairstyles
  unisex: {
    short_crop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    textured_crop: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&crop=face',
    modern_fade: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop&crop=face',
    layered_cut: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  }
};

// Placeholder images for different contexts
export const placeholderImages = {
  hairstyle: 'https://via.placeholder.com/400x500/1e40af/ffffff?text=Hairstyle+Image',
  profile: 'https://via.placeholder.com/200x200/6b7280/ffffff?text=Profile+Photo',
  tryon: 'https://via.placeholder.com/400x500/10b981/ffffff?text=Try-On+Photo',
  gallery: 'https://via.placeholder.com/400x500/8b5cf6/ffffff?text=Gallery+Image',
  upload: 'https://via.placeholder.com/400x500/f59e0b/ffffff?text=Upload+Photo'
};

// Get a random hairstyle image based on gender and category
export const getRandomHairstyleImage = (gender: 'M' | 'F' | 'U', category?: string): string => {
  const genderKey = gender === 'M' ? 'mens' : gender === 'F' ? 'womens' : 'unisex';
  const images = sampleHairstyleImages[genderKey];
  const imageKeys = Object.keys(images);
  const randomKey = imageKeys[Math.floor(Math.random() * imageKeys.length)];
  return images[randomKey as keyof typeof images];
};

// Get a specific hairstyle image by name
export const getHairstyleImage = (name: string, gender: 'M' | 'F' | 'U'): string => {
  const genderKey = gender === 'M' ? 'mens' : gender === 'F' ? 'womens' : 'unisex';
  const images = sampleHairstyleImages[genderKey];
  
  // Try to find a matching image by name
  const nameLower = name.toLowerCase();
  for (const [key, url] of Object.entries(images)) {
    if (nameLower.includes(key.replace('_', ' '))) {
      return url;
    }
  }
  
  // Return a random image if no match found
  return getRandomHairstyleImage(gender);
};

// Get placeholder image by type
export const getPlaceholderImage = (type: keyof typeof placeholderImages): string => {
  return placeholderImages[type];
};

// Handle image loading errors
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackType: keyof typeof placeholderImages = 'hairstyle') => {
  const target = event.target as HTMLImageElement;
  target.src = getPlaceholderImage(fallbackType);
  target.onerror = null; // Prevent infinite loop
};

// Generate sample data for hairstyles
export const generateSampleHairstyles = () => {
  const hairstyles = [
    // Men's Hairstyles
    {
      name: 'Classic Fade',
      category: 'mens',
      gender: 'M' as const,
      length: 'short' as const,
      description: 'A timeless fade haircut that works for any occasion',
      image_url: sampleHairstyleImages.mens.classic_fade
    },
    {
      name: 'Textured Quiff',
      category: 'mens',
      gender: 'M' as const,
      length: 'medium' as const,
      description: 'Modern textured quiff with volume and style',
      image_url: sampleHairstyleImages.mens.textured_quiff
    },
    {
      name: 'Pompadour',
      category: 'mens',
      gender: 'M' as const,
      length: 'medium' as const,
      description: 'Classic pompadour with height and volume',
      image_url: sampleHairstyleImages.mens.pompadour
    },
    {
      name: 'Buzz Cut',
      category: 'mens',
      gender: 'M' as const,
      length: 'short' as const,
      description: 'Low maintenance buzz cut for a clean look',
      image_url: sampleHairstyleImages.mens.buzz_cut
    },
    {
      name: 'Side Part',
      category: 'mens',
      gender: 'M' as const,
      length: 'medium' as const,
      description: 'Professional side part for business settings',
      image_url: sampleHairstyleImages.mens.side_part
    },
    {
      name: 'Crew Cut',
      category: 'mens',
      gender: 'M' as const,
      length: 'short' as const,
      description: 'Military-inspired crew cut for a sharp appearance',
      image_url: sampleHairstyleImages.mens.crew_cut
    },
    {
      name: 'Undercut',
      category: 'mens',
      gender: 'M' as const,
      length: 'medium' as const,
      description: 'Modern undercut with contrast and style',
      image_url: sampleHairstyleImages.mens.undercut
    },
    {
      name: 'Slick Back',
      category: 'mens',
      gender: 'M' as const,
      length: 'medium' as const,
      description: 'Sophisticated slick back for formal occasions',
      image_url: sampleHairstyleImages.mens.slick_back
    },
    // Women's Hairstyles
    {
      name: 'Sleek Bob',
      category: 'womens',
      gender: 'F' as const,
      length: 'short' as const,
      description: 'Elegant sleek bob for a sophisticated look',
      image_url: sampleHairstyleImages.womens.sleek_bob
    },
    {
      name: 'Beach Waves',
      category: 'womens',
      gender: 'F' as const,
      length: 'long' as const,
      description: 'Natural beach waves for a relaxed, summery look',
      image_url: sampleHairstyleImages.womens.beach_waves
    },
    {
      name: 'Pixie Cut',
      category: 'womens',
      gender: 'F' as const,
      length: 'short' as const,
      description: 'Bold pixie cut for a confident, modern style',
      image_url: sampleHairstyleImages.womens.pixie_cut
    },
    {
      name: 'Long Layers',
      category: 'womens',
      gender: 'F' as const,
      length: 'long' as const,
      description: 'Flattering long layers for volume and movement',
      image_url: sampleHairstyleImages.womens.long_layers
    },
    {
      name: 'Curly Bob',
      category: 'womens',
      gender: 'F' as const,
      length: 'short' as const,
      description: 'Playful curly bob for natural texture',
      image_url: sampleHairstyleImages.womens.curly_bob
    },
    {
      name: 'Straight Long',
      category: 'womens',
      gender: 'F' as const,
      length: 'long' as const,
      description: 'Classic straight long hair for timeless beauty',
      image_url: sampleHairstyleImages.womens.straight_long
    },
    {
      name: 'Messy Bun',
      category: 'womens',
      gender: 'F' as const,
      length: 'long' as const,
      description: 'Effortless messy bun for casual elegance',
      image_url: sampleHairstyleImages.womens.messy_bun
    },
    {
      name: 'Braided Updo',
      category: 'womens',
      gender: 'F' as const,
      length: 'long' as const,
      description: 'Intricate braided updo for special occasions',
      image_url: sampleHairstyleImages.womens.braided_updo
    },
    // Unisex Hairstyles
    {
      name: 'Short Crop',
      category: 'unisex',
      gender: 'U' as const,
      length: 'short' as const,
      description: 'Versatile short crop for any gender',
      image_url: sampleHairstyleImages.unisex.short_crop
    },
    {
      name: 'Textured Crop',
      category: 'unisex',
      gender: 'U' as const,
      length: 'short' as const,
      description: 'Modern textured crop with personality',
      image_url: sampleHairstyleImages.unisex.textured_crop
    },
    {
      name: 'Modern Fade',
      category: 'unisex',
      gender: 'U' as const,
      length: 'short' as const,
      description: 'Contemporary fade suitable for all',
      image_url: sampleHairstyleImages.unisex.modern_fade
    },
    {
      name: 'Layered Cut',
      category: 'unisex',
      gender: 'U' as const,
      length: 'medium' as const,
      description: 'Flattering layered cut for any face shape',
      image_url: sampleHairstyleImages.unisex.layered_cut
    }
  ];

  return hairstyles;
};

// Sample categories
export const sampleCategories = [
  {
    name: 'Men\'s Cuts',
    description: 'Professional and stylish haircuts for men'
  },
  {
    name: 'Women\'s Styles',
    description: 'Beautiful and versatile hairstyles for women'
  },
  {
    name: 'Unisex Options',
    description: 'Gender-neutral hairstyles for everyone'
  },
  {
    name: 'Short Styles',
    description: 'Low-maintenance short haircuts'
  },
  {
    name: 'Medium Length',
    description: 'Versatile medium-length hairstyles'
  },
  {
    name: 'Long Styles',
    description: 'Elegant long hairstyles with volume'
  }
]; 