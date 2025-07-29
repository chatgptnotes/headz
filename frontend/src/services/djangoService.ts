// Django API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Hairstyle Categories
export const getDjangoHairstyleCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories/`);
  return handleResponse(response);
};

// Hairstyles
export const getDjangoHairstyles = async (filters?: {
  category?: string;
  gender?: string;
  length?: string;
  search?: string;
}) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.gender) params.append('gender', filters.gender);
  if (filters?.length) params.append('length', filters.length);
  if (filters?.search) params.append('search', filters.search);

  const url = `${API_BASE_URL}/hairstyles/${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

export const createDjangoHairstyle = async (hairstyleData: {
  name: string;
  description: string;
  category: string;
  gender: 'M' | 'F' | 'U';
  length: 'short' | 'medium' | 'long';
  image: File;
}) => {
  const formData = new FormData();
  formData.append('name', hairstyleData.name);
  formData.append('description', hairstyleData.description);
  formData.append('category', hairstyleData.category);
  formData.append('gender', hairstyleData.gender);
  formData.append('length', hairstyleData.length);
  formData.append('image', hairstyleData.image);

  const response = await fetch(`${API_BASE_URL}/hairstyles/`, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header, let the browser set it with boundary for FormData
  });

  return handleResponse(response);
};

// Like a hairstyle
export const likeDjangoHairstyle = async (hairstyleId: string) => {
  const response = await fetch(`${API_BASE_URL}/hairstyles/${hairstyleId}/like/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

// User Profiles (if needed)
export const getDjangoUserProfile = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/`);
  return handleResponse(response);
};

export const updateDjangoUserProfile = async (userId: string, profileData: any) => {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

// Try-on Sessions
export const createDjangoTryOnSession = async (sessionData: {
  original_photo: File;
  hairstyle: string;
  result_photo?: File;
  is_saved?: boolean;
}) => {
  const formData = new FormData();
  formData.append('original_photo', sessionData.original_photo);
  formData.append('hairstyle', sessionData.hairstyle);
  if (sessionData.result_photo) {
    formData.append('result_photo', sessionData.result_photo);
  }
  formData.append('is_saved', sessionData.is_saved ? 'true' : 'false');

  const response = await fetch(`${API_BASE_URL}/tryon-sessions/`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
};

export const getDjangoTryOnSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/tryon-sessions/`);
  return handleResponse(response);
};

// Saved Hairstyles
export const saveDjangoHairstyle = async (hairstyleId: string, tryonSessionId?: string) => {
  const response = await fetch(`${API_BASE_URL}/saved-hairstyles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hairstyle: hairstyleId,
      tryon_session: tryonSessionId || null,
    }),
  });
  return handleResponse(response);
};

export const getDjangoSavedHairstyles = async () => {
  const response = await fetch(`${API_BASE_URL}/saved-hairstyles/`);
  return handleResponse(response);
};

export const removeDjangoSavedHairstyle = async (savedHairstyleId: string) => {
  const response = await fetch(`${API_BASE_URL}/saved-hairstyles/${savedHairstyleId}/`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  // DELETE requests might not return JSON
  return response.status === 204 ? {} : handleResponse(response);
};

// Appointments
export const createDjangoAppointment = async (appointmentData: {
  service: string;
  date: string;
  time: string;
  notes?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/appointments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(response);
};

export const getDjangoAppointments = async () => {
  const response = await fetch(`${API_BASE_URL}/appointments/`);
  return handleResponse(response);
};

export const updateDjangoAppointment = async (appointmentId: string, updates: any) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const cancelDjangoAppointment = async (appointmentId: string) => {
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};
