// src/components/UpdateProfileModal.jsx

import React, { useState } from 'react';
import { updateUserProfile } from '../services/apiService'; // Import function to handle profile update API call
import { ToastContainer, toast } from 'react-toastify'; // Import toast notification library
import 'react-toastify/dist/ReactToastify.css'; // Import toast notification styles

/**
 * Modal component for updating a user's profile.
 * Allows the user to update their avatar, banner, bio, and venue manager status.
 * Provides real-time validation of URL fields and success/error feedback.
 * @param {function} onClose - Callback function to close the modal.
 * @param {function} onUpdate - Callback function to update parent component state after successful profile update.
 * @param {Object} currentData - Current profile data (avatar, banner, bio, etc.) passed as props.
 * @returns {JSX.Element} - The rendered modal component.
 */
function UpdateProfileModal({ onClose, onUpdate, currentData }) {
    // State hooks to manage form inputs and loading/error states
    const [avatarUrl, setAvatarUrl] = useState(currentData.avatar.url || '');
    const [avatarAlt, setAvatarAlt] = useState(currentData.avatar.alt || '');
    const [bannerUrl, setBannerUrl] = useState(currentData.banner.url || '');
    const [bannerAlt, setBannerAlt] = useState(currentData.banner.alt || '');
    const [bio, setBio] = useState(currentData.bio || '');
    const [venueManager, setVenueManager] = useState(currentData.isVenueManager || false);
    const [loading, setLoading] = useState(false); // Track if the form is submitting
    const [error, setError] = useState(''); // Store error messages

    /**
     * Validates a URL to ensure it's properly formatted.
     * Allows empty fields but rejects invalid URL formats.
     * @param {string} url - The URL to validate.
     * @returns {boolean} - Whether the URL is valid.
     */
    const isValidUrl = (url) => {
        if (url.trim() === '') return true; // Allow empty fields
        try {
            new URL(url); // Attempt to parse the URL
        } catch (_) {
            return false; // Return false if URL parsing fails
        }
        return true;
    };

    /**
     * Handles updating the user's profile.
     * Validates the form fields, updates localStorage, and makes an API call to save the changes.
     * Provides feedback on success or error using toast notifications.
     */
    const handleUpdate = async () => {
        // Validate URL fields before proceeding
        if (!isValidUrl(avatarUrl) || !isValidUrl(bannerUrl)) {
            setError('Please enter valid URLs for avatar and banner.');
            return;
        }

        setLoading(true); // Start loading
        setError(''); // Clear any previous errors

        try {
            const profileData = {}; // Create an object to store updated profile fields

            // Update the bio if it has changed
            if (bio.trim() !== currentData.bio) profileData.bio = bio.trim();

            // Update avatar if URL or alt text has changed
            if (avatarUrl.trim() !== currentData.avatar.url || avatarAlt.trim() !== currentData.avatar.alt) {
                profileData.avatar = {
                    url: avatarUrl.trim(),
                    alt: avatarAlt.trim() || 'User avatar',
                };
            }

            // Update banner if URL or alt text has changed
            if (bannerUrl.trim() !== currentData.banner.url || bannerAlt.trim() !== currentData.banner.alt) {
                profileData.banner = {
                    url: bannerUrl.trim(),
                    alt: bannerAlt.trim() || 'User banner',
                };
            }

            // Update venue manager status if it has changed
            if (venueManager !== currentData.isVenueManager) profileData.venueManager = venueManager;

            // Ensure at least one field is being updated
            if (Object.keys(profileData).length === 0) {
                setError('Please make changes before updating.');
                setLoading(false);
                return;
            }

            // Call the API to update the profile
            const updatedProfileResponse = await updateUserProfile(profileData);

            // Update localStorage with new profile data
            if (profileData.bio !== undefined) localStorage.setItem('bio', profileData.bio);
            if (profileData.avatar) localStorage.setItem('avatar', JSON.stringify(profileData.avatar));
            if (profileData.banner) localStorage.setItem('banner', JSON.stringify(profileData.banner));
            if (profileData.venueManager !== undefined) localStorage.setItem('venueManager', profileData.venueManager);

            // Trigger the parent component's update handler to refresh the data
            if (onUpdate) {
                onUpdate({
                    bio: profileData.bio !== undefined ? profileData.bio : currentData.bio,
                    avatar: profileData.avatar || currentData.avatar,
                    banner: profileData.banner || currentData.banner,
                    isVenueManager: profileData.venueManager !== undefined ? profileData.venueManager : currentData.isVenueManager,
                });
            }

            // Show success toast notification
            toast.success('Profile updated successfully!');

            // Close the modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            // Handle and display errors
            const errorMessage = err.response?.data?.errors?.[0]?.message || 'Failed to update profile. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false); // Stop loading after API call finishes
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center z-50 text-black"
                role="dialog"
                aria-modal="true"
                aria-labelledby="update-profile-title"
            >
                {/* Modal Overlay: Clicking this will close the modal */}
                <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={onClose}
                    aria-label="Close modal"
                ></div>

                {/* Modal Content: Contains form elements and buttons */}
                <div
                    className="bg-white p-6 rounded-lg shadow-lg z-10 relative w-11/12 max-w-lg"
                    aria-labelledby="update-profile-title"
                >
                    <h2 id="update-profile-title" className="text-2xl font-bold mb-4 text-center">
                        Update Profile
                    </h2>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {/* Avatar URL Input */}
                        <div>
                            <label htmlFor="avatar-url" className="block text-gray-700 mb-2">
                                Avatar URL
                            </label>
                            <input
                                id="avatar-url"
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="Enter avatar URL"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Avatar Alt Text Input */}
                        <div>
                            <label htmlFor="avatar-alt" className="block text-gray-700 mb-2">
                                Avatar Alt Text
                            </label>
                            <input
                                id="avatar-alt"
                                type="text"
                                value={avatarAlt}
                                onChange={(e) => setAvatarAlt(e.target.value)}
                                placeholder="Enter avatar alt text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Banner URL Input */}
                        <div>
                            <label htmlFor="banner-url" className="block text-gray-700 mb-2">
                                Banner URL
                            </label>
                            <input
                                id="banner-url"
                                type="text"
                                value={bannerUrl}
                                onChange={(e) => setBannerUrl(e.target.value)}
                                placeholder="Enter banner URL"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Banner Alt Text Input */}
                        <div>
                            <label htmlFor="banner-alt" className="block text-gray-700 mb-2">
                                Banner Alt Text
                            </label>
                            <input
                                id="banner-alt"
                                type="text"
                                value={bannerAlt}
                                onChange={(e) => setBannerAlt(e.target.value)}
                                placeholder="Enter banner alt text"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Bio Input */}
                        <div>
                            <label htmlFor="bio" className="block text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                            ></textarea>
                        </div>
                        {/* Venue Manager Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="venue-manager"
                                type="checkbox"
                                checked={venueManager}
                                onChange={(e) => setVenueManager(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="venue-manager" className="text-gray-700">
                                Are you a Venue Manager?
                            </label>
                        </div>
                    </div>
                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-6">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className={`${loading
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                                } text-white py-2 px-4 rounded transition duration-300`}
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
            {/* Toast notifications container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default UpdateProfileModal;
