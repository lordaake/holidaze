// src/pages/ManageBookings.jsx

import React, { useState, useEffect } from 'react';
import { getManagerVenues } from '../services/apiService';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaArrowLeft } from 'react-icons/fa';

function ManageBookings() {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeVenueId, setActiveVenueId] = useState(null);

    useEffect(() => {
        fetchManagerVenues();
    }, []);

    const fetchManagerVenues = async () => {
        try {
            const response = await getManagerVenues();
            // console.log('Fetched venues data with detailed bookings:', response);

            const venuesData = Array.isArray(response.data) ? response.data : [];

            setVenues(venuesData);
        } catch (error) {
            console.error('Error fetching manager venues:', error);
            setError('Failed to load your venues.');
        } finally {
            setLoading(false);
        }
    };

    const toggleVenue = (venueId) => {
        setActiveVenueId(activeVenueId === venueId ? null : venueId);
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

    if (!Array.isArray(venues) || venues.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-700 text-lg">You have no venues.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* **Back Button and Heading** */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                {/* Back Button */}
                <Link
                    to="/user-dashboard"
                    className="flex items-center mb-4 sm:mb-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Back to User Dashboard"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>

                {/* Manage Bookings Heading */}
                <h2 className="text-3xl font-bold text-blue-900 text-center sm:text-left">
                    Manage Bookings
                </h2>
            </div>

            {/* **Render Venues** */}
            <div className="space-y-4">
                {venues.map((venue) => (
                    <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Venue Header */}
                        <button
                            onClick={() => toggleVenue(venue.id)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-expanded={activeVenueId === venue.id}
                            aria-controls={`venue-details-${venue.id}`}
                        >
                            <h3 className="text-xl font-semibold text-blue-800">{venue.name}</h3>
                            {activeVenueId === venue.id ? (
                                <FaChevronUp className="text-blue-600" />
                            ) : (
                                <FaChevronDown className="text-blue-600" />
                            )}
                        </button>

                        {/* Venue Details */}
                        {activeVenueId === venue.id && (
                            <div
                                id={`venue-details-${venue.id}`}
                                className="px-4 py-3 bg-gray-50"
                            >
                                {Array.isArray(venue.bookings) && venue.bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {venue.bookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    {/* Booking ID and Guest Name */}
                                                    <div>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Booking ID:</span> {booking.id}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Guest Name:</span>{' '}
                                                            {booking.customer?.name ? (
                                                                <Link
                                                                    to="/user-profile"
                                                                    state={{ customer: booking.customer }}
                                                                    className="text-blue-500 hover:underline"
                                                                    aria-label={`View profile of ${booking.customer.name}`}
                                                                >
                                                                    {booking.customer.name}
                                                                </Link>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Check-in and Check-out Dates */}
                                                    <div className="mt-2 sm:mt-0 sm:text-right">
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Check-in:</span>{' '}
                                                            {new Date(booking.dateFrom).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-gray-700">
                                                            <span className="font-semibold">Check-out:</span>{' '}
                                                            {new Date(booking.dateTo).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Guests and Contact */}
                                                <div className="mt-3 sm:flex sm:justify-between">
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">Guests:</span> {booking.guests}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <span className="font-semibold">Contact:</span>{' '}
                                                        {booking.customer?.email || 'No contact info'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">No bookings for this venue.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageBookings;
