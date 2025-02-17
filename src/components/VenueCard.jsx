// src/components/VenueCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaParking, FaUtensils, FaStar, FaPaw } from 'react-icons/fa';

/**
 * Renders a venue card component.
 * Displays the venue's image, name, rating, price, and available amenities.
 * Highlights top-rated venues with a special gold border overlay.
 * @param {Object} venue - The venue object containing its details.
 * @param {boolean} topRated - Flag to indicate if the venue is top-rated.
 * @returns {JSX.Element} - The rendered venue card.
 */
function VenueCard({ venue, topRated = false }) {
    // Fallback placeholder image
    const placeholderImage =
        'https://via.placeholder.com/400x300?text=No+Image+Available';
    // Use the first media URL or fallback to placeholder
    const venueImage =
        venue.media && venue.media.length > 0 ? venue.media[0].url : placeholderImage;

    return (
        <div
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform hover:scale-105"
        >
            <div className="relative">
                {/* For top-rated, add an overlay border that follows the container's rounded corners */}
                {topRated && (
                    <div className="absolute inset-0 pointer-events-none rounded-t-lg border-2 border-yellow-500"></div>
                )}
                <div className="w-full h-64 overflow-hidden">
                    <img
                        src={venueImage}
                        alt={venue.name ? `${venue.name} Image` : 'Venue Image'}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = placeholderImage)}
                    />
                </div>
                {venue.location && venue.location.city && (
                    <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full text-sm">
                        {venue.location.city}
                    </div>
                )}
                {topRated && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full text-sm flex items-center">
                        <FaStar className="mr-1" /> Top Rated
                    </div>
                )}
            </div>
            <div className="p-6 bg-gray-50">
                <h3 className="text-2xl font-semibold mb-3 truncate text-black">
                    {venue.name || 'Unnamed Venue'}
                </h3>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-2xl mr-1">
                        <FaStar />
                    </span>
                    <span className="text-gray-800 text-lg">
                        {venue.rating !== undefined ? venue.rating : 'No ratings'}
                    </span>
                </div>
                <p className="text-2xl font-bold text-blue-700 mb-4">
                    {venue.price ? `$${venue.price},- / night` : 'Price not available'}
                </p>
                <Link
                    to={`/venues/${venue.id}`}
                    className="block bg-blue-600 text-white text-center py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
                >
                    View Details
                </Link>
                {venue.meta && (
                    <div className="flex justify-center items-center mt-4 space-x-4 text-gray-600 text-sm">
                        {venue.meta.wifi && <FaWifi className="text-blue-500" title="WiFi" />}
                        {venue.meta.parking && <FaParking className="text-blue-500" title="Parking" />}
                        {venue.meta.breakfast && <FaUtensils className="text-blue-500" title="Breakfast" />}
                        {venue.meta.pets && <FaPaw className="text-blue-500" title="Pets Allowed" />}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VenueCard;
