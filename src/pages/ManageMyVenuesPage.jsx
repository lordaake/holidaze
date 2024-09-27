// src/pages/ManageMyVenuesPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserVenues, deleteVenue } from '../services/apiService';
import { FaArrowLeft } from 'react-icons/fa';

function ManageMyVenuesPage() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const username = localStorage.getItem('userName');

    useEffect(() => {
        async function fetchUserVenues() {
            try {
                const response = await getUserVenues(username);
                setVenues(Array.isArray(response.data) ? response.data : []); // Ensuring venuesData is an array
            } catch (error) {
                console.error('Failed to fetch user venues:', error);
                setError('Failed to load your venues.');
            } finally {
                setLoading(false);
            }
        }

        fetchUserVenues();
    }, [username]);

    const handleEdit = (venueId) => {
        // Navigate to the EditVenuePage with the venue ID to edit
        navigate(`/edit-venue/${venueId}`);
    };

    const handleDelete = async (venueId) => {
        if (window.confirm('Are you sure you want to delete this venue?')) {
            try {
                await deleteVenue(venueId);
                // Refresh the list of venues after deleting
                setVenues(venues.filter((venue) => venue.id !== venueId));
            } catch (error) {
                console.error('Failed to delete venue:', error);
                setError('Failed to delete the venue.');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-500 text-lg">Loading your venues...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* **Back Button and Heading** */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center mb-6">
                {/* Back Button */}
                <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                    <Link
                        to="/user-dashboard"
                        className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        aria-label="Back to User Dashboard"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Manage My Venues Heading */}
                <div className="text-center sm:text-center col-span-1">
                    <h2 className="text-3xl font-bold text-blue-900">
                        Manage My Venues
                    </h2>
                </div>

                {/* Empty div for grid alignment */}
                <div className="hidden sm:block"></div>
            </div>

            {/* **Render Venues** */}
            {venues.length === 0 ? (
                <p className="text-center text-gray-600">You have not created any venues yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.map((venue) => (
                        <div key={venue.id} className="bg-white p-4 rounded-lg shadow-md">
                            {/* Venue Image */}
                            <img
                                src={
                                    venue.media && venue.media.length > 0
                                        ? venue.media[0].url
                                        : '/src/assets/images/placeholder-hotel.png'
                                }
                                alt={
                                    venue.media && venue.media.length > 0
                                        ? venue.media[0].alt || 'Venue Image'
                                        : 'Venue Image'
                                }
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />

                            {/* Venue Name */}
                            <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>

                            {/* Venue Price */}
                            <p className="text-gray-600 mb-2">Price: ${venue.price}</p>

                            {/* Venue Max Guests */}
                            <p className="text-gray-600 mb-4">Max Guests: {venue.maxGuests}</p>

                            {/* Edit and Delete Buttons */}
                            <div className="flex justify-between">
                                <button
                                    onClick={() => handleEdit(venue.id)}
                                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={`Edit ${venue.name}`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(venue.id)}
                                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    aria-label={`Delete ${venue.name}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ManageMyVenuesPage;