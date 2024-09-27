// src/components/UpdateAvatarModal.jsx

import React, { useState } from 'react';
import { updateUserAvatar } from '../services/apiService'; // Adjust the path as necessary
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateAvatarModal({ onClose, onUpdate }) {
    const [newAvatarUrl, setNewAvatarUrl] = useState('');
    const [newAvatarAlt, setNewAvatarAlt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidImageUrl = (url) => {
        try {
            new URL(url);
        } catch (_) {
            return false;
        }
        return /\.(jpeg|jpg|gif|png)$/i.test(url);
    };

    const handleUpdate = async () => {
        if (newAvatarUrl.trim() === '') {
            setError('Please enter a valid URL.');
            return;
        }

        if (!isValidImageUrl(newAvatarUrl)) {
            setError('Please enter a valid image URL (jpg, jpeg, png, gif).');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const avatarData = {
                url: newAvatarUrl.trim(),
                alt: newAvatarAlt.trim() || 'User avatar',
            };

            // Call the API with the avatar object
            const updatedAvatarResponse = await updateUserAvatar(avatarData);
            // console.log('Avatar updated successfully:', updatedAvatarResponse);

            // Update localStorage
            localStorage.setItem('avatar', JSON.stringify(avatarData));

            // Update the parent component's state via callback
            if (onUpdate) {
                onUpdate(avatarData);
            }

            // Provide success feedback using react-toastify
            toast.success('Avatar updated successfully!');

            // Close the modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error updating avatar:', err.response?.data || err.message);

            // Log detailed error information
            if (err.response && err.response.data) {
                console.error('Error details:', JSON.stringify(err.response.data, null, 2));
            }

            if (
                err.response &&
                err.response.data &&
                err.response.data.errors &&
                err.response.data.errors.length > 0
            ) {
                const errorMessage = err.response.data.errors[0].message;
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                setError('Failed to update avatar. Please try again.');
                toast.error('Failed to update avatar. Please try again.');
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
                aria-labelledby="update-avatar-title"
            >
                {/* Modal Overlay */}
                <div
                    className="fixed inset-0 bg-black opacity-50"
                    onClick={onClose}
                    aria-label="Close modal"
                ></div>

                {/* Modal Content */}
                <div
                    className="bg-white p-6 rounded-lg shadow-lg z-10 relative w-11/12 max-w-md"
                    aria-labelledby="update-avatar-title"
                >
                    <h2 id="update-avatar-title" className="text-2xl font-bold mb-4">
                        Update Avatar
                    </h2>
                    <div className="mb-4">
                        <label htmlFor="avatar-url" className="block text-gray-700 mb-2">
                            Avatar URL
                        </label>
                        <input
                            id="avatar-url"
                            type="text"
                            value={newAvatarUrl}
                            onChange={(e) => setNewAvatarUrl(e.target.value)}
                            placeholder="Enter new avatar URL"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="avatar-alt" className="block text-gray-700 mb-2">
                            Alt Text (optional)
                        </label>
                        <input
                            id="avatar-alt"
                            type="text"
                            value={newAvatarAlt}
                            onChange={(e) => setNewAvatarAlt(e.target.value)}
                            placeholder="Enter alt text for the avatar"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className={`${loading
                                ? 'bg-orange-300 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600'
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

export default UpdateAvatarModal;
