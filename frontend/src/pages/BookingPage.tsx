import React, { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { createAppointment, getCurrentUser, getUserProfile, createUserProfile } from '../services/supabaseService';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: 'consultation' as 'consultation' | 'hair_fixing' | 'maintenance' | 'styling',
    notes: ''
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          name: currentUser.user_metadata?.full_name || currentUser.email || '',
          email: currentUser.email || ''
        }));

        // Load user profile if exists
        const profile = await getUserProfile(currentUser.id);
        if (profile) {
          setFormData(prev => ({
            ...prev,
            phone: profile.phone || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to book an appointment');
      return;
    }

    try {
      setLoading(true);

      // Create or update user profile
      if (formData.phone) {
        try {
          await createUserProfile({
            user_id: user.id,
            phone: formData.phone,
            profile_picture_url: '',
            preferred_stylist: ''
          });
        } catch (error) {
          // Profile might already exist, that's okay
          console.log('Profile creation skipped:', error);
        }
      }

      // Create appointment
      await createAppointment({
        user_id: user.id,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending'
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: 'consultation',
        notes: ''
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CalendarIcon className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Appointment Booked!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for booking your appointment. We'll send you a confirmation email shortly.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="btn btn-primary"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-lg text-gray-600">
            Schedule your hair fixing consultation with our experts
          </p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                
                <div>
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    disabled={!!user}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="your@email.com"
                      disabled={!!user}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className="form-label">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="form-label">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="form-label">
                    Service Type
                  </label>
                  <select
                    name="service"
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="consultation">Initial Consultation</option>
                    <option value="hair_fixing">Hair Fixing Service</option>
                    <option value="maintenance">Maintenance Service</option>
                    <option value="styling">Styling Service</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="form-label">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Any specific requirements or questions..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Location Info */}
        <div className="mt-8 card">
          <div className="card-body">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visit Our Salon</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <h4 className="font-medium text-gray-700">Address</h4>
                <p className="mt-2 text-sm text-gray-600">
                  123 Hair Street<br />
                  Fashion District<br />
                  City, State 12345
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Hours</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Mon-Fri: 9:00 AM - 7:00 PM<br />
                  Saturday: 10:00 AM - 6:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Contact</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Phone: (123) 456-7890<br />
                  Email: info@headz.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}