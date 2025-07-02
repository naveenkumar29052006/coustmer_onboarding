import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useOnboarding } from './OnboardingContext';

const AuthContext = createContext();

// Session timeout in milliseconds (3 minutes)
const SESSION_TIMEOUT = 3 * 60 * 1000;

function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessionExpiry, setSessionExpiry] = useState(null);
    const timeoutRef = useRef(null);

    // Clear onboarding and form data
    const clearAllUserData = () => {
        localStorage.removeItem('onboardingState');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('formData');
        // Add any other keys you want to clear
    };

    // Reset session timer on user activity
    const resetSessionTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (user) {
            const newExpiry = Date.now() + SESSION_TIMEOUT;
            setSessionExpiry(newExpiry);
            localStorage.setItem('sessionExpiry', newExpiry.toString());
            timeoutRef.current = setTimeout(() => {
                logout();
            }, SESSION_TIMEOUT);
        }
    };

    // Listen for user activity
    useEffect(() => {
        if (!user) return;
        const handleUserActivity = () => {
            resetSessionTimer();
        };
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, handleUserActivity, true);
        });
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserActivity, true);
            });
        };
    }, [user]);

    // On mount, check for sessionId and expiry, and load user if valid, else logout
    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        const storedExpiry = localStorage.getItem('sessionExpiry');
        const storedUser = localStorage.getItem('user');
        if (!storedSessionId || !storedExpiry || Date.now() > Number(storedExpiry)) {
            logout();
        } else if (storedUser) {
            setUser(JSON.parse(storedUser));
            setSessionExpiry(Number(storedExpiry));
            resetSessionTimer();
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // Generate and store a session ID
        const sessionId = generateSessionId();
        localStorage.setItem('sessionId', sessionId);
        resetSessionTimer();
    };

    const logout = () => {
        setUser(null);
        setSessionExpiry(null);
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
        localStorage.removeItem('sessionId');
        clearAllUserData();
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};