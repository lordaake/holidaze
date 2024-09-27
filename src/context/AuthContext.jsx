// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');

        if (token && apiKey) {
            setIsLoggedIn(true);

            const userName = localStorage.getItem('userName');
            const email = localStorage.getItem('email');
            const avatar = JSON.parse(localStorage.getItem('avatar') || '{}');
            const banner = JSON.parse(localStorage.getItem('banner') || '{}');
            const bio = localStorage.getItem('bio') || '';
            const venueManager = localStorage.getItem('venueManager') === 'true';

            // Set user data
            setUser({ userName, email, avatar, banner, bio, venueManager });
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const login = (token, apiKey) => {
        localStorage.setItem('token', token);
        localStorage.setItem('apiKey', apiKey);
        setIsLoggedIn(true); // Update the login state

        // Retrieve user information from localStorage
        const userName = localStorage.getItem('userName');
        const email = localStorage.getItem('email');
        const avatar = JSON.parse(localStorage.getItem('avatar') || '{}');
        const banner = JSON.parse(localStorage.getItem('banner') || '{}');
        const bio = localStorage.getItem('bio') || '';
        const venueManager = localStorage.getItem('venueManager') === 'true';

        // Set user data
        setUser({ userName, email, avatar, banner, bio, venueManager });
    };

    const logout = () => {
        // Clear all user-related data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('apiKey');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        localStorage.removeItem('avatar');
        localStorage.removeItem('banner');
        localStorage.removeItem('bio');
        localStorage.removeItem('venueManager');

        setIsLoggedIn(false); // Update the login state
        setUser(null); // Clear user data
    };

    const updateUser = (updatedUserData) => {
        setUser((prevUser) => {
            const newUser = {
                ...prevUser,
                ...updatedUserData,
            };

            // Update localStorage
            if (updatedUserData.bio !== undefined) {
                localStorage.setItem('bio', updatedUserData.bio);
            }
            if (updatedUserData.avatar) {
                localStorage.setItem('avatar', JSON.stringify(updatedUserData.avatar));
            }
            if (updatedUserData.banner) {
                localStorage.setItem('banner', JSON.stringify(updatedUserData.banner));
            }
            if (updatedUserData.venueManager !== undefined) {
                localStorage.setItem('venueManager', updatedUserData.venueManager.toString());
            }

            return newUser;
        });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
