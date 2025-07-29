import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type HairstyleCategory = Database['public']['Tables']['hairstyle_categories']['Row'];
type Hairstyle = Database['public']['Tables']['hairstyles']['Row'];
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type TryOnSession = Database['public']['Tables']['tryon_sessions']['Row'];
type SavedHairstyle = Database['public']['Tables']['saved_hairstyles']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];

// Hairstyle Categories
export const getHairstyleCategories = async (): Promise<HairstyleCategory[]> => {
  const { data, error } = await supabase
    .from('hairstyle_categories')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

// Hairstyles
export const getHairstyles = async (filters?: {
  category_id?: string;
  gender?: 'M' | 'F' | 'U';
  length?: 'short' | 'medium' | 'long';
}): Promise<Hairstyle[]> => {
  let query = supabase
    .from('hairstyles')
    .select(`
      *,
      hairstyle_categories (
        id,
        name,
        description
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if (filters?.gender) {
    query = query.eq('gender', filters.gender);
  }
  if (filters?.length) {
    query = query.eq('length', filters.length);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getHairstyleById = async (id: string): Promise<Hairstyle | null> => {
  const { data, error } = await supabase
    .from('hairstyles')
    .select(`
      *,
      hairstyle_categories (
        id,
        name,
        description
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createHairstyle = async (hairstyleData: {
  name: string;
  description: string;
  category_id: string;
  gender: 'M' | 'F' | 'U';
  length: 'short' | 'medium' | 'long';
  image_url: string;
}): Promise<Hairstyle> => {
  const { data, error } = await supabase
    .from('hairstyles')
    .insert({
      name: hairstyleData.name,
      description: hairstyleData.description,
      category_id: hairstyleData.category_id,
      gender: hairstyleData.gender,
      length: hairstyleData.length,
      image_url: hairstyleData.image_url,
      likes: 0
    })
    .select(`
      *,
      hairstyle_categories (
        id,
        name,
        description
      )
    `)
    .single();

  if (error) throw error;
  return data;
};

// User Profiles
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
  return data;
};

export const createUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at'>): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Try-On Sessions
export const createTryOnSession = async (session: Omit<TryOnSession, 'id' | 'created_at'>): Promise<TryOnSession> => {
  const { data, error } = await supabase
    .from('tryon_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserTryOnSessions = async (userId: string): Promise<TryOnSession[]> => {
  const { data, error } = await supabase
    .from('tryon_sessions')
    .select(`
      *,
      hairstyles (
        id,
        name,
        description,
        image_url,
        gender,
        length
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateTryOnSession = async (id: string, updates: Partial<TryOnSession>): Promise<TryOnSession> => {
  const { data, error } = await supabase
    .from('tryon_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Saved Hairstyles
export const saveHairstyle = async (savedStyle: {
  user_id: string;
  hairstyle_id: string;
  tryon_session_id?: string | null;
}): Promise<SavedHairstyle> => {
  const { data, error } = await supabase
    .from('saved_hairstyles')
    .upsert(savedStyle, { onConflict: 'user_id,hairstyle_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSavedHairstyles = async (userId: string): Promise<SavedHairstyle[]> => {
  const { data, error } = await supabase
    .from('saved_hairstyles')
    .select(`
      *,
      hairstyles (
        id,
        name,
        description,
        image_url,
        gender,
        length
      ),
      tryon_sessions (
        id,
        result_photo_url
      )
    `)
    .eq('user_id', userId)
    .order('saved_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const removeSavedHairstyle = async (userId: string, hairstyleId: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_hairstyles')
    .delete()
    .eq('user_id', userId)
    .eq('hairstyle_id', hairstyleId);

  if (error) throw error;
};

// Appointments
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// File Upload (for photos)
export const uploadPhoto = async (file: File, path: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const bucketName = process.env.REACT_APP_STORAGE_BUCKET || 'headz-photos';
  
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return publicUrl;
};

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}; 