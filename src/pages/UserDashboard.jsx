// src/pages/UserDashboard.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UpdateProfileModal from '../components/UpdateProfileModal';

/**
 * UserDashboard component serves as the main dashboard for authenticated users.
 * It displays user information, provides navigation to various user-related actions,
 * and allows users to update their profiles.
 */
function UserDashboard() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useContext(AuthContext);

    // State to store user data such as name, email, bio, avatar, banner, and role
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: { url: '', alt: '' },
        banner: { url: '', alt: '' },
        isVenueManager: false,
    });

    // State to control the visibility of the UpdateProfileModal component
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Update userData when the user object from AuthContext changes
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

    // Handle user logout by invoking logout function from AuthContext and navigating to login page
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Callback to update user profile and persist changes via AuthContext
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
                {/* Banner Section */}
                <div className="relative">
                    {userData.banner?.url ? (
                        <img
                            src={userData.banner.url}
                            alt={userData.banner.alt || 'User banner'}
                            className="w-full h-48 md:h-64 object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className="w-full h-48 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            aria-label="Default Banner Background"
                        ></div>
                    )}
                    <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                        <div className="flex items-center">
                            {userData.avatar?.url ? (
                                <img
                                    src={userData.avatar.url}
                                    alt={userData.avatar.alt || 'User avatar'}
                                    className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white shadow-xl"
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    className="w-20 h-20 md:w-28 md:h-28 bg-gray-300 rounded-full"
                                    aria-label="Default Avatar"
                                ></div>
                            )}
                            <div className="ml-4">
                                <h3 className="text-xl md:text-3xl font-bold text-white drop-shadow-lg">
                                    {userData.name}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-12">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800">
                            {userData.name}
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg mt-2">{userData.email}</p>
                        {userData.bio && (
                            <p className="mt-4 text-gray-700 max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
                                {userData.bio}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        <ActionButton label="Logout" color="red" onClick={handleLogout} />
                    </div>
                </div>
            </div>

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

/**
 * ActionButton component renders a stylized button used for various user actions
 * within the UserDashboard. It accepts a label, color, and an onClick handler as props.
 */
function ActionButton({ label, color, onClick }) {
    const colorClasses = {
        blue: 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 focus:ring-blue-700',
        green: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:ring-green-600',
        purple: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-purple-600',
        yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 focus:ring-yellow-600',
        teal: 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 focus:ring-teal-600',
        orange: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:ring-orange-600',
        red: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-600',
    };

    const buttonClasses =
        colorClasses[color] || 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500';

    return (
        <button
            onClick={onClick}
            className={`${buttonClasses} text-white text-sm sm:text-base py-3 px-4 sm:py-4 sm:px-6 rounded-lg shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
            aria-label={label}
        >
            {label}
        </button>
    );
}

export default UserDashboard;
