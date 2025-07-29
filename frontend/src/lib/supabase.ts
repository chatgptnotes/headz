import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://ljsdzfmaqdzirxbsgvqm.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxqc2R6Zm1hcWR6aXJ4YnNndnFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NTgwNTUsImV4cCI6MjA2OTEzNDA1NX0.2pfkFGDt6Vktc7lBwAtJNYc2pISRV9YkA0JJt2dCBYU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript - Headz Hair Try-On Project
export interface Database {
  public: {
    Tables: {
      hairstyle_categories: {
        Row: {
          id: string
          name: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          created_at?: string
        }
      }
      hairstyles: {
        Row: {
          id: string
          name: string
          category_id: string
          description: string
          image_url: string
          gender: 'M' | 'F' | 'U'
          length: 'short' | 'medium' | 'long'
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category_id: string
          description: string
          image_url: string
          gender?: 'M' | 'F' | 'U'
          length: 'short' | 'medium' | 'long'
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category_id?: string
          description?: string
          image_url?: string
          gender?: 'M' | 'F' | 'U'
          length?: 'short' | 'medium' | 'long'
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          phone: string
          profile_picture_url: string
          preferred_stylist: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string
          profile_picture_url?: string
          preferred_stylist?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string
          profile_picture_url?: string
          preferred_stylist?: string
          created_at?: string
        }
      }
      tryon_sessions: {
        Row: {
          id: string
          user_id: string
          original_photo_url: string
          hairstyle_id: string
          result_photo_url: string
          created_at: string
          is_saved: boolean
        }
        Insert: {
          id?: string
          user_id: string
          original_photo_url: string
          hairstyle_id: string
          result_photo_url?: string
          created_at?: string
          is_saved?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          original_photo_url?: string
          hairstyle_id?: string
          result_photo_url?: string
          created_at?: string
          is_saved?: boolean
        }
      }
      saved_hairstyles: {
        Row: {
          id: string
          user_id: string
          hairstyle_id: string
          tryon_session_id: string | null
          saved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hairstyle_id: string
          tryon_session_id?: string
          saved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hairstyle_id?: string
          tryon_session_id?: string
          saved_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          service: 'consultation' | 'hair_fixing' | 'maintenance' | 'styling'
          date: string
          time: string
          notes: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service: 'consultation' | 'hair_fixing' | 'maintenance' | 'styling'
          date: string
          time: string
          notes?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service?: 'consultation' | 'hair_fixing' | 'maintenance' | 'styling'
          date?: string
          time?: string
          notes?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 