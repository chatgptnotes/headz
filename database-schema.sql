-- Headz Virtual Hair Fixing Try-On Database Schema
-- This schema creates all the necessary tables for the hair try-on application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hairstyle Categories Table
CREATE TABLE IF NOT EXISTS hairstyle_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hairstyles Table
CREATE TABLE IF NOT EXISTS hairstyles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category_id UUID REFERENCES hairstyle_categories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'U')) DEFAULT 'U',
    length VARCHAR(10) CHECK (length IN ('short', 'medium', 'long')) NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- This will reference auth.users from Supabase Auth
    phone VARCHAR(20),
    profile_picture_url TEXT,
    preferred_stylist VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Try-On Sessions Table
CREATE TABLE IF NOT EXISTS tryon_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- This will reference auth.users from Supabase Auth
    original_photo_url TEXT NOT NULL,
    hairstyle_id UUID REFERENCES hairstyles(id) ON DELETE CASCADE,
    result_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_saved BOOLEAN DEFAULT FALSE
);

-- Saved Hairstyles Table
CREATE TABLE IF NOT EXISTS saved_hairstyles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- This will reference auth.users from Supabase Auth
    hairstyle_id UUID REFERENCES hairstyles(id) ON DELETE CASCADE,
    tryon_session_id UUID REFERENCES tryon_sessions(id) ON DELETE SET NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hairstyle_id)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- This will reference auth.users from Supabase Auth
    service VARCHAR(20) CHECK (service IN ('consultation', 'hair_fixing', 'maintenance', 'styling')) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    notes TEXT,
    status VARCHAR(10) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hairstyles_category_id ON hairstyles(category_id);
CREATE INDEX IF NOT EXISTS idx_hairstyles_gender ON hairstyles(gender);
CREATE INDEX IF NOT EXISTS idx_hairstyles_length ON hairstyles(length);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tryon_sessions_user_id ON tryon_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_tryon_sessions_hairstyle_id ON tryon_sessions(hairstyle_id);
CREATE INDEX IF NOT EXISTS idx_saved_hairstyles_user_id ON saved_hairstyles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_hairstyles_hairstyle_id ON saved_hairstyles(hairstyle_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_hairstyles_updated_at BEFORE UPDATE ON hairstyles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for hairstyle categories
INSERT INTO hairstyle_categories (name, description) VALUES
('Men''s Cuts', 'Professional and stylish haircuts for men'),
('Women''s Styles', 'Beautiful and versatile hairstyles for women'),
('Unisex Options', 'Gender-neutral hairstyles for everyone'),
('Short Styles', 'Low-maintenance short haircuts'),
('Medium Length', 'Versatile medium-length hairstyles'),
('Long Styles', 'Elegant long hairstyles with volume')
ON CONFLICT DO NOTHING;

-- Add new hairstyle categories
INSERT INTO hairstyle_categories (name, description) VALUES
('Braids', 'Elegant braided hairstyles and protective styles'),
('Curly Hair', 'Styles designed for natural curls and waves'),
('Long Hair', 'Beautiful long hairstyles with volume and flow')
ON CONFLICT (name) DO NOTHING;

-- Insert sample hairstyles with real images
INSERT INTO hairstyles (name, category_id, description, image_url, gender, length, likes) VALUES
-- Men's Hairstyles
('Classic Fade', (SELECT id FROM hairstyle_categories WHERE name = 'Men''s Cuts'), 'A timeless fade haircut that works for any occasion', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face', 'M', 'short', 234),
('Textured Quiff', (SELECT id FROM hairstyle_categories WHERE name = 'Men''s Cuts'), 'Modern textured quiff with volume and style', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&crop=face', 'M', 'medium', 189),
('Pompadour', (SELECT id FROM hairstyle_categories WHERE name = 'Men''s Cuts'), 'Classic pompadour with height and volume', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop&crop=face', 'M', 'medium', 267),
('Buzz Cut', (SELECT id FROM hairstyle_categories WHERE name = 'Short Styles'), 'Low maintenance buzz cut for a clean look', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face', 'M', 'short', 145),
('Side Part', (SELECT id FROM hairstyle_categories WHERE name = 'Medium Length'), 'Professional side part for business settings', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face', 'M', 'medium', 198),
('Crew Cut', (SELECT id FROM hairstyle_categories WHERE name = 'Short Styles'), 'Military-inspired crew cut for a sharp appearance', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face', 'M', 'short', 167),
('Undercut', (SELECT id FROM hairstyle_categories WHERE name = 'Medium Length'), 'Modern undercut with contrast and style', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop&crop=face', 'M', 'medium', 223),
('Slick Back', (SELECT id FROM hairstyle_categories WHERE name = 'Medium Length'), 'Sophisticated slick back for formal occasions', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face', 'M', 'medium', 189),
-- Women's Hairstyles
('Sleek Bob', (SELECT id FROM hairstyle_categories WHERE name = 'Women''s Styles'), 'Elegant sleek bob for a sophisticated look', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=400&h=500&fit=crop&crop=face', 'F', 'short', 312),
('Beach Waves', (SELECT id FROM hairstyle_categories WHERE name = 'Long Styles'), 'Natural beach waves for a relaxed, summery look', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face', 'F', 'long', 445),
('Pixie Cut', (SELECT id FROM hairstyle_categories WHERE name = 'Short Styles'), 'Bold pixie cut for a confident, modern style', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&crop=face', 'F', 'short', 178),
('Long Layers', (SELECT id FROM hairstyle_categories WHERE name = 'Long Styles'), 'Flattering long layers for volume and movement', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face', 'F', 'long', 523),
('Curly Bob', (SELECT id FROM hairstyle_categories WHERE name = 'Women''s Styles'), 'Playful curly bob for natural texture', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&crop=face', 'F', 'short', 234),
('Straight Long', (SELECT id FROM hairstyle_categories WHERE name = 'Long Styles'), 'Classic straight long hair for timeless beauty', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face', 'F', 'long', 456),
('Messy Bun', (SELECT id FROM hairstyle_categories WHERE name = 'Long Styles'), 'Effortless messy bun for casual elegance', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=500&fit=crop&crop=face', 'F', 'long', 289),
('Braided Updo', (SELECT id FROM hairstyle_categories WHERE name = 'Long Styles'), 'Intricate braided updo for special occasions', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face', 'F', 'long', 334),
-- Unisex Hairstyles
('Short Crop', (SELECT id FROM hairstyle_categories WHERE name = 'Unisex Options'), 'Versatile short crop for any gender', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face', 'U', 'short', 156),
('Textured Crop', (SELECT id FROM hairstyle_categories WHERE name = 'Unisex Options'), 'Modern textured crop with personality', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop&crop=face', 'U', 'short', 134),
('Modern Fade', (SELECT id FROM hairstyle_categories WHERE name = 'Unisex Options'), 'Contemporary fade suitable for all', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=500&fit=crop&crop=face', 'U', 'short', 167),
('Layered Cut', (SELECT id FROM hairstyle_categories WHERE name = 'Medium Length'), 'Flattering layered cut for any face shape', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face', 'U', 'medium', 189)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE hairstyle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hairstyles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tryon_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_hairstyles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Hairstyle categories and hairstyles are public (readable by everyone)
CREATE POLICY "Hairstyle categories are viewable by everyone" ON hairstyle_categories FOR SELECT USING (true);
CREATE POLICY "Hairstyles are viewable by everyone" ON hairstyles FOR SELECT USING (true);

-- User profiles: users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Try-on sessions: users can only see their own sessions
CREATE POLICY "Users can view own tryon sessions" ON tryon_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tryon sessions" ON tryon_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tryon sessions" ON tryon_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tryon sessions" ON tryon_sessions FOR DELETE USING (auth.uid() = user_id);

-- Saved hairstyles: users can only see their own saved styles
CREATE POLICY "Users can view own saved hairstyles" ON saved_hairstyles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved hairstyles" ON saved_hairstyles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved hairstyles" ON saved_hairstyles FOR DELETE USING (auth.uid() = user_id);

-- Appointments: users can only see their own appointments
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON appointments FOR DELETE USING (auth.uid() = user_id); 
