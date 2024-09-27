// src/components/VenueCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaWifi, FaSwimmingPool, FaParking, FaUtensils, FaStar } from 'react-icons/fa';

function VenueCard({ venue, topRated = false }) {
    const placeholderImage = '/src/assets/images/placeholder-hotel.png';
    const venueImage = venue.media && venue.media.length > 0 ? venue.media[0].url : placeholderImage;

    return (
        <div
            className={`bg-white shadow-lg rounded-lg overflow-hidden transition-transform duration-300 transform ${topRated ? 'border-4 border-yellow-500 scale-105' : ''
                }`}
        >
            <div className="relative">
                <img
                    src={venueImage}
                    alt={venue.name ? `${venue.name} Image` : 'Venue Image'}
                    className="w-full h-64 object-cover rounded-t-lg"
                    onError={(e) => (e.target.src = placeholderImage)}
                />
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
                <h3 className="text-2xl font-semibold mb-3 truncate">{venue.name || 'Unnamed Venue'}</h3>
                <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-2xl mr-1">
                        <FaStar />
                    </span>
                    <span className="text-gray-800 text-lg">{venue.rating !== undefined ? venue.rating : 'No ratings'}</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 mb-4">{venue.price ? `$${venue.price},- / night` : 'Price not available'}</p>
                <Link
                    to={`/venues/${venue.id}`}
                    className="block bg-blue-600 text-white text-center py-3 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
                >
                    View Details
                </Link>
                {venue.meta && (
                    <div className="flex justify-center items-center mt-4 space-x-4 text-gray-600 text-sm">
                        {venue.meta.wifi && <FaWifi className="text-blue-500" title="WiFi" />}
                        {venue.meta.pool && <FaSwimmingPool className="text-blue-500" title="Pool" />}
                        {venue.meta.parking && <FaParking className="text-blue-500" title="Parking" />}
                        {venue.meta.breakfast && <FaUtensils className="text-blue-500" title="Breakfast" />}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VenueCard;
