import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, CameraIcon, CalendarIcon, ShareIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Virtual Try-On',
    description: 'Try different hairstyles instantly using AI technology',
    icon: CameraIcon,
  },
  {
    name: 'AI-Powered Matching',
    description: 'Get personalized hairstyle recommendations based on your face shape',
    icon: SparklesIcon,
  },
  {
    name: 'Book Appointment',
    description: 'Schedule your hair fixing appointment with our experts',
    icon: CalendarIcon,
  },
  {
    name: 'Share Results',
    description: 'Save and share your virtual try-on results with friends',
    icon: ShareIcon,
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Transform Your Look with</span>{' '}
                <span className="block text-primary xl:inline">Virtual Hair Try-On</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Experience the future of hair styling. Try different hairstyles instantly using advanced AI technology, 
                find your perfect match, and book an appointment with our expert stylists.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/try-on"
                    className="btn btn-primary btn-lg w-full md:px-10"
                  >
                    Try Now
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/gallery"
                    className="btn btn-secondary btn-lg w-full md:px-10"
                  >
                    View Gallery
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="bg-gray-50 py-16 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base font-semibold uppercase tracking-wide text-primary mb-4">Features</h2>
            <p className="text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for your perfect hairstyle
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white mb-6 shadow-lg">
                  <feature.icon className="h-10 w-10" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-white">Ready to transform your look?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of satisfied customers who found their perfect hairstyle
            </p>
            <Link
              to="/try-on"
              className="mt-8 btn btn-lg bg-white text-primary hover:bg-gray-50"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}