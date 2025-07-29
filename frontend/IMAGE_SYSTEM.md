# Image System Documentation

This document explains the comprehensive image system implemented in the Headz Virtual Hair Try-On application.

## Overview

The image system provides:
- **Real hairstyle images** from Unsplash
- **Placeholder images** for fallback scenarios
- **Automatic image error handling**
- **Database seeding** with sample data
- **Image utilities** for consistent handling

## Image Sources

### 1. Real Hairstyle Images (Unsplash)

All hairstyle images are sourced from Unsplash with optimized parameters:
- **Size**: 400x500 pixels
- **Crop**: Face-focused cropping
- **Format**: JPEG with quality optimization
- **CDN**: Fast global delivery

#### Image Categories:
- **Men's Hairstyles**: 8 different styles
- **Women's Hairstyles**: 8 different styles  
- **Unisex Hairstyles**: 4 different styles

### 2. Placeholder Images

Custom placeholder images for different contexts:
- **Hairstyle**: Blue-themed placeholder for hairstyles
- **Profile**: Gray-themed placeholder for profile photos
- **Try-On**: Green-themed placeholder for try-on photos
- **Gallery**: Purple-themed placeholder for gallery images
- **Upload**: Orange-themed placeholder for upload areas

## File Structure

```
src/
├── utils/
│   ├── imageUtils.ts          # Main image utilities
│   └── seedData.ts            # Database seeding utilities
├── pages/
│   ├── GalleryPage.tsx        # Gallery with image handling
│   ├── TryOnPage.tsx          # Try-on with image upload
│   └── ProfilePage.tsx        # Profile with image display
└── services/
    └── supabaseService.ts     # Image upload to Supabase
```

## Key Functions

### Image Utilities (`imageUtils.ts`)

#### `handleImageError(event, fallbackType)`
Handles image loading errors with appropriate fallbacks.

```typescript
import { handleImageError } from '../utils/imageUtils';

<img 
  src={style.image_url} 
  onError={(e) => handleImageError(e, 'hairstyle')} 
/>
```

#### `getPlaceholderImage(type)`
Returns appropriate placeholder image based on context.

```typescript
const placeholder = getPlaceholderImage('hairstyle');
```

#### `getRandomHairstyleImage(gender, category)`
Returns a random hairstyle image for the specified gender.

#### `generateSampleHairstyles()`
Generates complete sample data with real images.

### Database Seeding (`seedData.ts`)

#### `autoSeedIfEmpty()`
Automatically seeds the database if it's empty.

#### `seedAllData()`
Manually seeds all sample data.

#### `checkDataExists()`
Checks if sample data already exists.

## Implementation Details

### 1. Automatic Seeding

The app automatically seeds sample data on first load:

```typescript
// App.tsx
useEffect(() => {
  autoSeedIfEmpty().catch(console.error);
}, []);
```

### 2. Error Handling

All images have fallback handling:

```typescript
<img 
  src={style.image_url} 
  alt={style.name}
  onError={(e) => handleImageError(e, 'hairstyle')}
/>
```

### 3. Database Schema

Updated schema includes real image URLs:

```sql
-- Sample hairstyles with real images
INSERT INTO hairstyles (name, category_id, description, image_url, gender, length, likes) VALUES
('Classic Fade', (SELECT id FROM hairstyle_categories WHERE name = 'Men''s Cuts'), 
 'A timeless fade haircut that works for any occasion', 
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face', 
 'M', 'short', 234);
```

## Image Categories

### Men's Hairstyles
1. **Classic Fade** - Timeless fade haircut
2. **Textured Quiff** - Modern textured quiff
3. **Pompadour** - Classic pompadour with height
4. **Buzz Cut** - Low maintenance buzz cut
5. **Side Part** - Professional side part
6. **Crew Cut** - Military-inspired crew cut
7. **Undercut** - Modern undercut with contrast
8. **Slick Back** - Sophisticated slick back

### Women's Hairstyles
1. **Sleek Bob** - Elegant sleek bob
2. **Beach Waves** - Natural beach waves
3. **Pixie Cut** - Bold pixie cut
4. **Long Layers** - Flattering long layers
5. **Curly Bob** - Playful curly bob
6. **Straight Long** - Classic straight long hair
7. **Messy Bun** - Effortless messy bun
8. **Braided Updo** - Intricate braided updo

### Unisex Hairstyles
1. **Short Crop** - Versatile short crop
2. **Textured Crop** - Modern textured crop
3. **Modern Fade** - Contemporary fade
4. **Layered Cut** - Flattering layered cut

## Usage Examples

### Gallery Display
```typescript
// GalleryPage.tsx
{hairstyles.map((style) => (
  <div key={style.id}>
    <img
      src={style.image_url}
      alt={style.name}
      onError={(e) => handleImageError(e, 'hairstyle')}
    />
  </div>
))}
```

### Try-On Selection
```typescript
// TryOnPage.tsx
{hairstyles.map((style) => (
  <div key={style.id} onClick={() => selectStyle(style)}>
    <img
      src={style.image_url}
      alt={style.name}
      onError={(e) => handleImageError(e, 'hairstyle')}
    />
  </div>
))}
```

### Profile Saved Styles
```typescript
// ProfilePage.tsx
{savedStyles.map((style) => (
  <div key={style.id}>
    <img
      src={style.hairstyles.image_url}
      alt={style.hairstyles.name}
      onError={(e) => handleImageError(e, 'hairstyle')}
    />
  </div>
))}
```

## Performance Optimizations

1. **Image Optimization**: All Unsplash images use optimized parameters
2. **Lazy Loading**: Images load as needed
3. **Error Handling**: Graceful fallbacks prevent broken images
4. **CDN Delivery**: Fast global image delivery via Unsplash CDN

## Maintenance

### Adding New Images
1. Add new image URLs to `sampleHairstyleImages` in `imageUtils.ts`
2. Update `generateSampleHairstyles()` with new hairstyle data
3. Run `seedAllData()` to update the database

### Updating Existing Images
1. Modify image URLs in `sampleHairstyleImages`
2. Clear and reseed the database using `clearAllData()` and `seedAllData()`

### Custom Placeholders
1. Update `placeholderImages` object in `imageUtils.ts`
2. Add new placeholder types as needed

## Troubleshooting

### Common Issues

1. **Images not loading**: Check network connectivity and image URLs
2. **Placeholder not showing**: Verify `handleImageError` is properly imported
3. **Database seeding fails**: Check Supabase connection and permissions
4. **Slow image loading**: Images are optimized but may take time on slow connections

### Debug Commands

```typescript
// Check if data exists
const { hasCategories, hasHairstyles } = await checkDataExists();

// Manually seed data
await seedAllData();

// Clear all data
await clearAllData();
```

## Future Enhancements

1. **Image Compression**: Implement client-side image compression
2. **Progressive Loading**: Add progressive image loading
3. **Image Caching**: Implement browser caching strategies
4. **Custom Uploads**: Allow users to upload their own hairstyle images
5. **AI Image Generation**: Integrate AI for custom hairstyle images

## Related Files

- `src/utils/imageUtils.ts` - Main image utilities
- `src/utils/seedData.ts` - Database seeding
- `database-schema.sql` - Database schema with sample data
- `src/pages/GalleryPage.tsx` - Gallery image display
- `src/pages/TryOnPage.tsx` - Try-on image handling
- `src/pages/ProfilePage.tsx` - Profile image display 