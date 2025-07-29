import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Try On', href: '/try-on' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Book Appointment', href: '/booking' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <Disclosure as="nav" className="bg-white shadow-lg">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="text-2xl font-bold text-primary">HEADZ</Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-700 hidden sm:block">
                        Welcome, {user.firstName}
                      </span>
                      <div className="relative group">
                        <Link
                          to="/profile"
                          className="relative rounded-full bg-gray-100 p-1 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View profile</span>
                          <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                        </Link>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={logout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="text-sm font-medium text-gray-700 hover:text-primary"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setShowRegisterModal(true)}
                        className="btn btn-primary btn-sm"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                {!user && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-primary"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                {user && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="px-3 py-2">
                      <p className="text-base font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Disclosure.Button
                      as={Link}
                      to="/profile"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      View Profile
                    </Disclosure.Button>
                    <button
                      onClick={logout}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}