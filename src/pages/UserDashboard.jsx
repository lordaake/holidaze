// src/pages/UserDashboard.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UpdateProfileModal from '../components/UpdateProfileModal';

function UserDashboard() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useContext(AuthContext);

    // Initialize userData state
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: { url: '', alt: '' },
        banner: { url: '', alt: '' },
        isVenueManager: false,
    });

    // State to manage the visibility of the UpdateProfileModal
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.userName,
                email: user.email,
                bio: user.bio || '',
                avatar: user.avatar || { url: '', alt: '' },
                banner: user.banner || { url: '', alt: '' },
                isVenueManager: user.venueManager,
            });
        }
    }, [user]);

    // Handle user logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Callback to update user data in state and AuthContext
    const handleProfileUpdate = (updatedData) => {
        setUserData((prevData) => ({
            ...prevData,
            ...updatedData,
        }));

        updateUser({
            bio: updatedData.bio,
            avatar: updatedData.avatar,
            banner: updatedData.banner,
            venueManager: updatedData.isVenueManager,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* Banner Section */}
                <div className="relative">
                    {userData.banner?.url ? (
                        <img
                            src={userData.banner.url}
                            alt={userData.banner.alt || 'User banner'}
                            className="w-full h-64 object-cover"
                        />
                    ) : (
                        <div className="w-full h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    )}
                    <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/70 to-transparent w-full">
                        <div className="flex items-center">
                            {/* Avatar */}
                            {userData.avatar?.url ? (
                                <img
                                    src={userData.avatar.url}
                                    alt={userData.avatar.alt || 'User avatar'}
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                            )}
                            <div className="ml-4">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">{userData.name}</h3>
                                <p className="text-sm md:text-base text-gray-200">{userData.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12">
                    {/* User Information */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">{userData.name}</h2>
                        <p className="text-gray-600 text-md md:text-lg mt-2">{userData.email}</p>
                        {userData.bio && (
                            <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                                {userData.bio}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ActionButton
                            label="My Bookings"
                            color="blue"
                            onClick={() => navigate('/user-dashboard/bookings')}
                        />
                        {userData.isVenueManager && (
                            <>
                                <ActionButton
                                    label="Create a Venue"
                                    color="purple"
                                    onClick={() => navigate('/create-venue')}
                                />
                                <ActionButton
                                    label="Manage My Venues"
                                    color="yellow"
                                    onClick={() => navigate('/manage-venues')}
                                />
                                <ActionButton
                                    label="Venue Bookings"
                                    color="teal"
                                    onClick={() => navigate('/manage-bookings')}
                                />
                            </>
                        )}
                        <ActionButton
                            label="Update Profile"
                            color="orange"
                            onClick={() => setIsProfileModalOpen(true)}
                        />
                        <ActionButton
                            label="Logout"
                            color="red"
                            onClick={handleLogout}
                        />
                    </div>
                </div>
            </div>

            {/* Conditionally render the UpdateProfileModal */}
            {isProfileModalOpen && (
                <UpdateProfileModal
                    onClose={() => setIsProfileModalOpen(false)}
                    onUpdate={handleProfileUpdate}
                    currentData={userData}
                />
            )}
        </div>
    );
}

// Reusable ActionButton component for styling consistency
function ActionButton({ label, color, onClick }) {
    const colorClasses = {
        blue: 'bg-blue-600 hover:bg-blue-700',
        green: 'bg-green-600 hover:bg-green-700',
        purple: 'bg-purple-600 hover:bg-purple-700',
        yellow: 'bg-yellow-500 hover:bg-yellow-600',
        teal: 'bg-teal-600 hover:bg-teal-700',
        orange: 'bg-orange-500 hover:bg-orange-600',
        red: 'bg-red-600 hover:bg-red-700',
    };

    const buttonClasses = colorClasses[color] || 'bg-gray-500 hover:bg-gray-600';

    return (
        <button
            onClick={onClick}
            className={`${buttonClasses} text-white py-4 px-6 rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
        >
            {label}
        </button>
    );
}

export default UserDashboard;
