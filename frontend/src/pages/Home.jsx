// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

// Array of background image URLs.
const backgroundImages = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80"
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { authUser } = useAuth();

  // Preload all background images once when the component mounts.
  useEffect(() => {
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Cycle through the background images every 5 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Images */}
      {backgroundImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl font-extrabold text-white sm:text-6xl">
          Welcome to EventLify
        </h1>
        {authUser ? (
          <>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
              Welcome back, {authUser.name}! Ready to explore new events?
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/events"
                className="px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
              >
                Explore Events
              </Link>
              <Link 
                to="/my-events"
                className="px-8 py-3 border border-transparent text-lg font-medium rounded-md text-green-600 bg-white hover:bg-gray-100 transition duration-300"
              >
                My Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
              Discover and create amazing events in your area. Join our community of event enthusiasts!
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/signup"
                className="px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
              >
                Sign Up
              </Link>
              <Link 
                to="/login"
                className="px-8 py-3 border border-transparent text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-100 transition duration-300"
              >
                Login
              </Link>
              <Link 
                to="/events"
                className="px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300"
              >
                Explore as Guest
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
