// src/context/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Optimistically load from localStorage (for a faster UI)
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setAuthUser(JSON.parse(storedUser));
    }
    // Always verify with the backend.
    const verifyUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/auth-status', {
          withCredentials: true,
        });
        if (res.data.message === "OK") {
          const userData = { name: res.data.name, email: res.data.email, _id: res.data._id };
          setAuthUser(userData);
          localStorage.setItem('authUser', JSON.stringify(userData));
        } else {
          setAuthUser(null);
          localStorage.removeItem('authUser');
        }
      } catch (error) {
        console.error('User verification failed:', error);
        setAuthUser(null);
        localStorage.removeItem('authUser');
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('authUser', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
