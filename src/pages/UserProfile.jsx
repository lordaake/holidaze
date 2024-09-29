// src/pages/UserProfile.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * UserProfile component displays the profile information of a customer.
 * It retrieves customer data passed via the router's location state.
 * If no customer data is available, it prompts the user to navigate back.
 *
 * @component
 * @returns {JSX.Element} The rendered UserProfile component.
 */
function UserProfile() {
    // Hook to access the current location object, which may contain state passed via navigation
    const location = useLocation();

    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    /**
     * Extracts the customer data from the location state.
     * This data is expected to be passed when navigating to the UserProfile component.
     */
    const customer = location.state?.customer;

    /**
     * Conditional Rendering:
     * If no customer data is available, display an error message and a button to go back.
     */
    if (!customer) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                {/* Error Message */}
                <p className="text-red-500 text-lg">No customer data available.</p>

                {/* "Go Back" Button */}
                <button
                    onClick={() => navigate(-1)} // Navigates back to the previous page
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    aria-label="Go Back"
                >
                    Go Back
                </button>
            </div>
        );
    }

    /**
     * Main Render:
     * Displays the customer's profile, including banner image, avatar, name, email, and bio.
     */
    return (
        <div className="container mx-auto py-12 px-4">
            {/* Banner Image */}
            {customer.banner?.url && (
                <div
                    className="w-full h-64 bg-cover bg-center rounded-lg mb-6"
                    style={{ backgroundImage: `url(${customer.banner.url})` }}
                    aria-label="Customer Banner Image"
                >
                    {/* Empty div used solely for background image */}
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
                        loading="lazy"
                    />
                )}

                {/* Customer Name */}
                <h2 className="text-3xl font-bold mb-2">
                    {customer.name || 'N/A'}
                </h2>

                {/* Customer Email */}
                <p className="text-gray-600 mb-4">
                    {customer.email || 'No email provided'}
                </p>

                {/* Customer Bio */}
                <p className="text-center max-w-2xl">
                    {customer.bio || 'No bio available.'}
                </p>
            </div>
        </div>
    );
}

export default UserProfile;