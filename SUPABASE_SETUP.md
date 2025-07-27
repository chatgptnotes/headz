# Supabase Setup for Headz Project

This guide will help you set up Supabase for the Headz Virtual Hair Fixing Try-On project.

## 🚀 Quick Setup

### 1. Database Schema Setup

1. Go to your Supabase project dashboard: https://ljsdzfmaqdzirxbsgvqm.supabase.co
2. Navigate to the **SQL Editor**
3. Copy and paste the contents of `database-schema.sql` into the editor
4. Click **Run** to execute the schema

### 2. Storage Bucket Setup

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `headz-photos`
3. Set the bucket to **Public** (since we need to display images)
4. Configure the following RLS policies for the bucket:

```sql
-- Allow public read access to photos
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'headz-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'headz-photos' AND auth.role() = 'authenticated');

-- Allow users to update their own photos
CREATE POLICY "Users can update own photos" ON storage.objects FOR UPDATE 
USING (bucket_id = 'headz-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own photos" ON storage.objects FOR DELETE 
USING (bucket_id = 'headz-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Authentication Setup

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure the following settings:
   - **Site URL**: `http://localhost:3001` (for development)
   - **Redirect URLs**: Add `http://localhost:3001/auth/callback`
   - Enable **Email confirmations** (optional)
   - Enable **Phone confirmations** (optional)

### 4. Environment Variables

The Supabase configuration is already set up in `src/lib/supabase.ts` with your project credentials:

- **URL**: `https://ljsdzfmaqdzirxbsgvqm.supabase.co`
- **Anon Key**: Already configured

## 📊 Database Tables

The schema creates the following tables:

### Core Tables
- `hairstyle_categories` - Categories of hairstyles (Short, Medium, Long, etc.)
- `hairstyles` - Individual hairstyles with images and metadata
- `user_profiles` - Extended user information
- `tryon_sessions` - Virtual try-on sessions with photos
- `saved_hairstyles` - User's saved favorite hairstyles
- `appointments` - Booking appointments with stylists

### Sample Data
The schema includes sample data for:
- 8 hairstyle categories
- 5 sample hairstyles

## 🔐 Row Level Security (RLS)

The database is configured with RLS policies:

- **Public Access**: Hairstyle categories and hairstyles are readable by everyone
- **User-Specific**: Try-on sessions, saved styles, appointments, and profiles are user-specific
- **Authenticated Only**: File uploads require authentication

## 🛠 Development

### Testing the Setup

1. Start your React development server:
   ```bash
   cd headz-app/frontend
   npm start
   ```

2. The app should now be running on `http://localhost:3001`

3. Test the Supabase connection by:
   - Browsing the hairstyle gallery
   - Creating a user account
   - Trying on hairstyles
   - Saving favorite styles

### API Functions

The `src/services/supabaseService.ts` file provides all the necessary functions for:
- Fetching hairstyles and categories
- Managing user profiles
- Creating try-on sessions
- Saving favorite hairstyles
- Booking appointments
- File uploads

## 🔧 Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Make sure all RLS policies are properly configured
2. **Storage Access Denied**: Verify the storage bucket is public and policies are set
3. **Authentication Issues**: Check redirect URLs in Supabase settings
4. **CORS Errors**: Ensure your site URL is correctly configured

### Debugging

1. Check the browser console for error messages
2. Use Supabase dashboard to inspect database tables
3. Check the Network tab for failed API requests
4. Verify environment variables are correct

## 📱 Next Steps

After setup, you can:

1. **Add Real Hairstyle Images**: Replace placeholder URLs with actual hairstyle images
2. **Implement AI Try-On**: Integrate with AI services for virtual hair overlay
3. **Add Payment Processing**: Integrate payment gateways for appointments
4. **Deploy to Production**: Update environment variables for production URLs

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

**Note**: This setup replaces the Django backend with Supabase for the Headz project. The Django backend can still be used for additional features if needed. 