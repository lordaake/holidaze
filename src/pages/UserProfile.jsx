// src/pages/UserProfile.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const customer = location.state?.customer;

    // If no customer data is passed, redirect back or show an error
    if (!customer) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <p className="text-red-500 text-lg">No customer data available.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            {/* Banner Image */}
            {customer.banner?.url && (
                <div className="w-full h-64 bg-cover bg-center rounded-lg mb-6" style={{ backgroundImage: `url(${customer.banner.url})` }}>
                    {/* Optional: Overlay text or effects */}
                </div>
            )}

            {/* Profile Section */}
            <div className="flex flex-col items-center">
                {/* Avatar */}
                {customer.avatar?.url && (
                    <img
                        src={customer.avatar.url}
                        alt={customer.avatar.alt || `${customer.name}'s avatar`}
                        className="w-32 h-32 rounded-full mb-4 object-cover"
                    />
                )}

                {/* Customer Name */}
                <h2 className="text-3xl font-bold mb-2">{customer.name || 'N/A'}</h2>

                {/* Customer Email */}
                <p className="text-gray-600 mb-4">{customer.email || 'No email provided'}</p>

                {/* Customer Bio */}
                <p className="text-center max-w-2xl">{customer.bio || 'No bio available.'}</p>
            </div>
        </div>
    );
}

export default UserProfile;
