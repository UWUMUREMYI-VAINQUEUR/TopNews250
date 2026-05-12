import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { loginApi, signupApi, verify2FA } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER FROM TOKEN
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        setUser(decoded);

        // Save decoded user
        localStorage.setItem('user', JSON.stringify(decoded));
      } catch (err) {
        console.error('Invalid token:', err);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (emailOrUsername, password) => {
    try {
      const res = await loginApi({
        emailOrUsername,
        password,
      });

      const { token } = res.data;

      // Decode JWT
      const decoded = jwtDecode(token);

      // Save token & user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decoded));

      // Set user state
      setUser(decoded);

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        message:
          err.response?.data?.message || 'Login failed',
      };
    }
  };

  /* =========================
     SIGNUP START
  ========================= */
  const signupStart = async ({
    email,
    phone,
    username,
    password,
  }) => {
    try {
      const res = await signupApi({
        email,
        phone,
        username,
        password,
      });

      return {
        ok: true,
        message: res.data.message,
      };
    } catch (err) {
      return {
        ok: false,
        message:
          err.response?.data?.message || 'Signup failed',
      };
    }
  };

  /* =========================
     VERIFY 2FA SIGNUP
  ========================= */
  const signupVerify = async ({
    email,
    code,
    phone,
    username,
    password,
  }) => {
    try {
      const res = await verify2FA({
        email,
        code,
        phone,
        username,
        password,
      });

      const { token } = res.data;

      // Decode token
      const decoded = jwtDecode(token);

      // Save token & user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decoded));

      // Set user
      setUser(decoded);

      return {
        ok: true,
      };
    } catch (err) {
      return {
        ok: false,
        message:
          err.response?.data?.message ||
          'Verification failed',
      };
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        signupStart,
        signupVerify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};