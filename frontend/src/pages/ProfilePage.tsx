import React, { useState, useEffect } from 'react';
import { UserIcon, CameraIcon, BookmarkIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { 
  getCurrentUser, 
  getUserProfile, 
  updateUserProfile, 
  getSavedHairstyles, 
  removeSavedHairstyle,
  getUserAppointments,
  updateAppointment,
  deleteAppointment
} from '../services/supabaseService';
import { handleImageError } from '../utils/imageUtils';
import type { Database } from '../lib/supabase';

type SavedHairstyle = Database['public']['Tables']['saved_hairstyles']['Row'] & {
  hairstyles: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    gender: 'M' | 'F' | 'U';
    length: 'short' | 'medium' | 'long';
  };
  tryon_sessions: {
    id: string;
    result_photo_url: string;
  } | null;
};

type Appointment = Database['public']['Tables']['appointments']['Row'];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'appointments'>('profile');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [savedStyles, setSavedStyles] = useState<SavedHairstyle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    preferred_stylist: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Load user profile
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);
        if (userProfile) {
          setFormData({
            phone: userProfile.phone || '',
            preferred_stylist: userProfile.preferred_stylist || ''
          });
        }

        // Load saved hairstyles
        const saved = await getSavedHairstyles(currentUser.id);
        setSavedStyles(saved as SavedHairstyle[]);

        // Load appointments
        const userAppointments = await getUserAppointments(currentUser.id);
        setAppointments(userAppointments);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateUserProfile(user.id, formData);
      setProfile((prev: any) => ({ ...prev, ...formData }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleRemoveSavedStyle = async (hairstyleId: string) => {
    if (!user) return;

    try {
      await removeSavedHairstyle(user.id, hairstyleId);
      setSavedStyles(prev => prev.filter(style => style.hairstyle_id !== hairstyleId));
    } catch (error) {
      console.error('Error removing saved style:', error);
      alert('Failed to remove saved style');
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: 'cancelled' });
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Failed to delete appointment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                {profile?.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt="Profile" 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-16 w-16 text-white" />
                )}
              </div>
              <button className="absolute bottom-2 right-2 bg-white rounded-full p-3 text-primary hover:bg-gray-100 shadow-lg transition-all">
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-bold mb-2">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </h1>
              <p className="text-blue-100 text-lg mb-2">{user.email}</p>
              <p className="text-blue-200 text-sm">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
            <button 
              onClick={() => setEditing(!editing)}
              className="btn btn-lg bg-white text-primary hover:bg-gray-100 shadow-lg"
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8">

        {/* Tabs */}
        <div className="card mb-8 shadow-sm border border-gray-200">
          <div className="card-body p-0">
            <nav className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all duration-200 relative ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary bg-white shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all duration-200 relative ${
                  activeTab === 'saved'
                    ? 'border-primary text-primary bg-white shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <BookmarkIcon className="h-5 w-5" />
                  <span>Saved Styles ({savedStyles.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-all duration-200 relative ${
                  activeTab === 'appointments'
                    ? 'border-primary text-primary bg-white shadow-sm'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Appointments ({appointments.length})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="card shadow-sm border border-gray-200">
            <div className="card-body">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Personal Information</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="form-label font-medium">Full Name</label>
                  <input
                    type="text"
                    value={user.user_metadata?.full_name || user.email?.split('@')[0] || ''}
                    readOnly
                    className="form-input bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="form-label font-medium">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    readOnly
                    className="form-input bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="form-label font-medium">Phone</label>
                  <input
                    type="tel"
                    value={editing ? formData.phone : (profile?.phone || 'Not provided')}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    readOnly={!editing}
                    className={`form-input ${editing ? '' : 'bg-gray-50 cursor-not-allowed'}`}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="form-label font-medium">Preferred Stylist</label>
                  <input
                    type="text"   
                    value={editing ? formData.preferred_stylist : (profile?.preferred_stylist || 'Not specified')}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_stylist: e.target.value }))}
                    readOnly={!editing}
                    className={`form-input ${editing ? '' : 'bg-gray-50 cursor-not-allowed'}`}
                    placeholder="Enter preferred stylist"
                  />
                </div>
              </div>
              {editing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="card shadow-sm border border-gray-200">
            <div className="card-body">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Saved Hairstyles</h2>
              {savedStyles.length === 0 ? (
                <div className="text-center py-12">
                  <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No saved hairstyles yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Try on some hairstyles and save your favorites!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                  {savedStyles.map((style) => (
                    <div key={style.id} className="gallery-item group shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-ratio-4-5 bg-gray-200 overflow-hidden">
                        <img
                          src={style.hairstyles.image_url}
                          alt={style.hairstyles.name}
                          className="object-cover object-center w-full h-full"
                          onError={(e) => handleImageError(e, 'hairstyle')}
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <div className="mb-3">
                          <h3 className="text-sm font-medium text-gray-900">{style.hairstyles.name}</h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {style.hairstyles.gender === 'M' ? 'Men' : style.hairstyles.gender === 'F' ? 'Women' : 'Unisex'} • {style.hairstyles.length}
                          </p>
                          <p className="text-xs text-gray-500">Saved on {new Date(style.saved_at).toLocaleDateString()}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveSavedStyle(style.hairstyle_id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {appointments.length === 0 ? (
              <div className="card shadow-sm border border-gray-200">
                <div className="card-body text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Book your first appointment to get started!</p>
                </div>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="card shadow-sm border border-gray-200">
                  <div className="card-body">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {appointment.service.replace('_', ' ')}
                        </h3>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                          <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600">{appointment.notes}</p>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold self-start sm:self-center ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    {appointment.status === 'pending' && (
                      <div className="mt-6 flex space-x-4">
                        <button className="btn btn-secondary">
                          Reschedule
                        </button>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {appointment.status === 'cancelled' && (
                      <div className="mt-6">
                        <button 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}