'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('cinestash-token');
        const savedUser = localStorage.getItem('cinestash-user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }

        setLoading(false);
    }, []);

    // Register
    const register = async (name, email, password, referralCode = '') => {
        try {
            const res = await api.post('/auth/register', {
                name,
                email,
                password,
                referralCode,
            });

            const { user: userData, token: newToken } = res.data.data;

            setUser(userData);
            setToken(newToken);
            localStorage.setItem('cinestash-token', newToken);
            localStorage.setItem('cinestash-user', JSON.stringify(userData));
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            toast.success('Welcome to CineStash! 🎬');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            const { user: userData, token: newToken } = res.data.data;

            setUser(userData);
            setToken(newToken);
            localStorage.setItem('cinestash-token', newToken);
            localStorage.setItem('cinestash-user', JSON.stringify(userData));
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            toast.success(`Welcome back, ${userData.name}! 🎬`);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    // Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('cinestash-token');
        localStorage.removeItem('cinestash-user');
        delete api.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
    };

    // Forgot Password
    const forgotPassword = async (email) => {
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('Reset link sent! Check your email (or server console)');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset link';
            toast.error(message);
            return { success: false, message };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token,
                register,
                login,
                logout,
                forgotPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}