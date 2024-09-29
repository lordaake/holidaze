// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

// Create a new context for authentication
export const AuthContext = createContext();

/**
 * Provides authentication context to the component tree.
 * Manages user login state and information.
 * @param {Object} children - React children components.
 * @returns {JSX.Element} - Context provider component.
 */
export const AuthProvider = ({ children }) => {
    // State to manage if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State to store user details
    const [user, setUser] = useState(null);

    /**
     * On initial render, check localStorage for existing user session.
     * Updates the login state and user data if found.
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');

        if (token && apiKey) {
            setIsLoggedIn(true);

            // Retrieve user details from localStorage
            const userName = localStorage.getItem('userName');
            const email = localStorage.getItem('email');
            const avatar = JSON.parse(localStorage.getItem('avatar') || '{}');
            const banner = JSON.parse(localStorage.getItem('banner') || '{}');
            const bio = localStorage.getItem('bio') || '';
            const venueManager = localStorage.getItem('venueManager') === 'true';

            // Set user state with the retrieved data
            setUser({ userName, email, avatar, banner, bio, venueManager });
        } else {
            setIsLoggedIn(false);
            setUser(null); // No user found, clear state
        }
    }, []);

    /**
     * Logs the user in by storing token and API key in localStorage.
     * Updates the login state and retrieves user information from localStorage.
     * @param {string} token - User's authentication token.
     * @param {string} apiKey - User's API key.
     */
    const login = (token, apiKey) => {
        localStorage.setItem('token', token);
        localStorage.setItem('apiKey', apiKey);
        setIsLoggedIn(true); // User is logged in

        // Retrieve user details after successful login
        const userName = localStorage.getItem('userName');
        const email = localStorage.getItem('email');
        const avatar = JSON.parse(localStorage.getItem('avatar') || '{}');
        const banner = JSON.parse(localStorage.getItem('banner') || '{}');
        const bio = localStorage.getItem('bio') || '';
        const venueManager = localStorage.getItem('venueManager') === 'true';

        // Set user state with the retrieved data
        setUser({ userName, email, avatar, banner, bio, venueManager });
    };

    /**
     * Logs out the user by clearing user-related data from localStorage.
     * Resets the login state and user information.
     */
    const logout = () => {
        // Remove all stored data in localStorage related to the user
        localStorage.removeItem('token');
        localStorage.removeItem('apiKey');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');
        localStorage.removeItem('avatar');
        localStorage.removeItem('banner');
        localStorage.removeItem('bio');
        localStorage.removeItem('venueManager');

        // Reset authentication state
        setIsLoggedIn(false);
        setUser(null); // Clear user data
    };

    /**
     * Updates user data both in the component state and localStorage.
     * Only updates fields that are provided in the updatedUserData object.
     * @param {Object} updatedUserData - An object containing updated user information.
     */
    const updateUser = (updatedUserData) => {
        setUser((prevUser) => {
            const newUser = {
                ...prevUser,
                ...updatedUserData, // Merge old and new data
            };

            // Update localStorage with new data, if provided
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

            return newUser; // Return the updated user state
        });
    };

    // Return the context provider with all functions and state passed as value
    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
