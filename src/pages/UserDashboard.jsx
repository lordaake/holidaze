// src/pages/UserDashboard.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UpdateProfileModal from '../components/UpdateProfileModal';

/**
 * UserDashboard component serves as the main dashboard for authenticated users.
 * It displays user information, provides navigation to various user-related actions,
 * and allows users to update their profiles.
 *
 * @component
 * @returns {JSX.Element} The rendered UserDashboard component.
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

    // Updates the userData state when the user object from AuthContext changes
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

    // Handles user logout by invoking logout function from AuthContext and navigating to login page
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
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* Banner Section */}
                <div className="relative">
                    {userData.banner?.url ? (
                        <img
                            src={userData.banner.url}
                            alt={userData.banner.alt || 'User banner'}
                            className="w-full h-40 md:h-64 object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className="w-full h-40 md:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                            aria-label="Default Banner Background"
                        ></div>
                    )}
                    <div className="absolute bottom-0 left-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent w-full">
                        <div className="flex items-center">
                            {userData.avatar?.url ? (
                                <img
                                    src={userData.avatar.url}
                                    alt={userData.avatar.alt || 'User avatar'}
                                    className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md"
                                    loading="lazy"
                                />
                            ) : (
                                <div
                                    className="w-16 h-16 md:w-24 md:h-24 bg-gray-300 rounded-full"
                                    aria-label="Default Avatar"
                                ></div>
                            )}
                            <div className="ml-4">
                                <h3 className="text-xl md:text-3xl font-bold text-white">
                                    {userData.name}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-12">
                    <div className="text-center mb-8 md:mb-10">
                        <h2 className="text-2xl md:text-4xl font-semibold text-gray-800">
                            {userData.name}
                        </h2>
                        <p className="text-gray-600 text-sm md:text-lg mt-2">
                            {userData.email}
                        </p>
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
                        <ActionButton
                            label="Logout"
                            color="red"
                            onClick={handleLogout}
                        />
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
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.label - The text to display on the button.
 * @param {string} props.color - The color theme of the button (e.g., blue, red).
 * @param {Function} props.onClick - The function to execute on button click.
 * @returns {JSX.Element} The rendered ActionButton component.
 */
function ActionButton({ label, color, onClick }) {
    const colorClasses = {
        blue: 'bg-blue-800 hover:bg-blue-900 focus:ring-blue-700',
        green: 'bg-green-700 hover:bg-green-800 focus:ring-green-600',
        purple: 'bg-purple-700 hover:bg-purple-800 focus:ring-purple-600',
        yellow: 'bg-yellow-900 hover:bg-yellow-700 focus:ring-yellow-600',
        teal: 'bg-teal-700 hover:bg-teal-800 focus:ring-teal-600',
        orange: 'bg-orange-900 hover:bg-orange-700 focus:ring-orange-600',
        red: 'bg-red-700 hover:bg-red-800 focus:ring-red-600',
    };

    const buttonClasses =
        colorClasses[color] ||
        'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500';

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