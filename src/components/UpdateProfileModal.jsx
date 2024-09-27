// src/components/UpdateProfileModal.jsx

import React, { useState } from 'react';
import { updateUserProfile } from '../services/apiService'; // Ensure this function is defined in your apiService
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateProfileModal({ onClose, onUpdate, currentData }) {
    const [avatarUrl, setAvatarUrl] = useState(currentData.avatar.url || '');
    const [avatarAlt, setAvatarAlt] = useState(currentData.avatar.alt || '');
    const [bannerUrl, setBannerUrl] = useState(currentData.banner.url || '');
    const [bannerAlt, setBannerAlt] = useState(currentData.banner.alt || '');
    const [bio, setBio] = useState(currentData.bio || '');
    const [venueManager, setVenueManager] = useState(currentData.isVenueManager || false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidUrl = (url) => {
        if (url.trim() === '') return true; // Allow empty fields
        try {
            new URL(url);
        } catch (_) {
            return false;
        }
        return true;
    };

    const handleUpdate = async () => {
        // Validate URLs
        if (!isValidUrl(avatarUrl) || !isValidUrl(bannerUrl)) {
            setError('Please enter valid URLs for avatar and banner.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const profileData = {};

            if (bio.trim() !== currentData.bio) profileData.bio = bio.trim();

            if (avatarUrl.trim() !== currentData.avatar.url || avatarAlt.trim() !== currentData.avatar.alt) {
                profileData.avatar = {
                    url: avatarUrl.trim(),
                    alt: avatarAlt.trim() || 'User avatar',
                };
            }

            if (bannerUrl.trim() !== currentData.banner.url || bannerAlt.trim() !== currentData.banner.alt) {
                profileData.banner = {
                    url: bannerUrl.trim(),
                    alt: bannerAlt.trim() || 'User banner',
                };
            }

            if (venueManager !== currentData.isVenueManager) profileData.venueManager = venueManager;

            // Ensure at least one field is being updated
            if (Object.keys(profileData).length === 0) {
                setError('Please make changes before updating.');
                setLoading(false);
                return;
            }

            // Call the API with the profileData object
            const updatedProfileResponse = await updateUserProfile(profileData);
            // console.log('Profile updated successfully:', updatedProfileResponse);

            // Update localStorage
            if (profileData.bio !== undefined) localStorage.setItem('bio', profileData.bio);
            if (profileData.avatar) localStorage.setItem('avatar', JSON.stringify(profileData.avatar));
            if (profileData.banner) localStorage.setItem('banner', JSON.stringify(profileData.banner));
            if (profileData.venueManager !== undefined) localStorage.setItem('venueManager', profileData.venueManager);

            // Update the parent component's state via callback
            if (onUpdate) {
                onUpdate({
                    bio: profileData.bio !== undefined ? profileData.bio : currentData.bio,
                    avatar: profileData.avatar || currentData.avatar,
                    banner: profileData.banner || currentData.banner,
                    isVenueManager: profileData.venueManager !== undefined ? profileData.venueManager : currentData.isVenueManager,
                });
            }

            // Provide success feedback using react-toastify
            toast.success('Profile updated successfully!');

            // Close the modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err.response?.data || err.message);

            if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.length > 0) {
                const errorMessage = err.response.data.errors[0].message;
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                setError('Failed to update profile. Please try again.');
                toast.error('Failed to update profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                role="dialog"
                aria-modal="true"
                aria-labelledby="update-profile-title"
            >
                {/* Modal Overlay */}
                <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={onClose}
                    aria-label="Close modal"
                ></div>

                {/* Modal Content */}
                <div
                    className="bg-white p-6 rounded-lg shadow-lg z-10 relative w-11/12 max-w-lg"
                    aria-labelledby="update-profile-title"
                >
                    <h2 id="update-profile-title" className="text-2xl font-bold mb-4 text-center">
                        Update Profile
                    </h2>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {/* Avatar URL */}
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
                        {/* Avatar Alt */}
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
                        {/* Banner URL */}
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
                        {/* Banner Alt */}
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
                        {/* Bio */}
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
                        {/* Venue Manager */}
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
