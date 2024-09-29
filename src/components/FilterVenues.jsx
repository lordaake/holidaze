// src/components/FilterVenues.jsx

import React, { useState, useEffect } from 'react';

/**
 * FilterVenues Component
 * Provides simplified and user-friendly filter options with hide/show functionality.
 *
 * @param {Function} onFilterChange - Callback to pass selected filters back to the parent component.
 */
function FilterVenues({ onFilterChange }) {
    // Load initial filters from localStorage if available
    const initialFilters = JSON.parse(localStorage.getItem('venueFilters')) || {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
        minPrice: '',
        maxPrice: '',
        minGuests: '',
        maxGuests: '',
        city: '',
        country: '',
        rating: 0,
    };

    const [filters, setFilters] = useState(initialFilters);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // Handle filter input changes
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        const updatedFilters = {
            ...filters,
            [name]: type === 'checkbox' ? checked : value,
        };
        setFilters(updatedFilters);
        localStorage.setItem('venueFilters', JSON.stringify(updatedFilters)); // Save in localStorage
    };

    // Handle rating selection (with toggle functionality)
    const handleRatingChange = (ratingValue) => {
        const newRating = filters.rating === ratingValue ? 0 : ratingValue;
        const updatedFilters = { ...filters, rating: newRating };
        setFilters(updatedFilters);
        localStorage.setItem('venueFilters', JSON.stringify(updatedFilters)); // Save in localStorage
    };

    // Apply filters (persisting the current filter state)
    const applyFilters = () => {
        onFilterChange(filters); // Pass the selected filters to the parent component
        setIsFilterVisible(false); // Optionally hide filters after applying
    };

    // Reset all filters
    const resetFilters = () => {
        const resetFilters = {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false,
            minPrice: '',
            maxPrice: '',
            minGuests: '',
            maxGuests: '',
            city: '',
            country: '',
            rating: 0,
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters); // Apply reset filters
        localStorage.removeItem('venueFilters'); // Remove from localStorage
    };

    // Toggle filter visibility
    const toggleFilterVisibility = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    // Load filters from localStorage on component mount (if any exist)
    useEffect(() => {
        const savedFilters = JSON.parse(localStorage.getItem('venueFilters'));
        if (savedFilters) {
            setFilters(savedFilters);
        }
    }, []);

    return (
        <div className="mb-4">
            {/* Toggle Filter Button */}
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={toggleFilterVisibility}
            >
                {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Filter Options (Initially Hidden) */}
            {isFilterVisible && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Filter Options</h3>

                    {/* Price Filter */}
                    <div className="mb-4">
                        <label className="block mb-2">Price Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Guests Filter */}
                    <div className="mb-4">
                        <label className="block mb-2">Guests Capacity</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="minGuests"
                                placeholder="Min Guests"
                                value={filters.minGuests}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                            <input
                                type="number"
                                name="maxGuests"
                                placeholder="Max Guests"
                                value={filters.maxGuests}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div className="mb-4">
                        <label className="block mb-2">Location</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={filters.city}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                value={filters.country}
                                onChange={handleInputChange}
                                className="p-2 border rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="mb-4">
                        <label className="block mb-2">Rating</label>
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((ratingValue) => (
                                <button
                                    key={ratingValue}
                                    type="button"
                                    onClick={() => handleRatingChange(ratingValue)}
                                    className={`p-1 rounded ${filters.rating >= ratingValue
                                        ? 'text-yellow-400'
                                        : 'text-gray-400'
                                        }`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.166c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.37-2.455a1 1 0 00-1.175 0l-3.37 2.455c-.784.57-1.838-.197-1.539-1.118l1.285-3.966a1 1 0 00-.364-1.118L2.049 9.393c-.784-.57-.38-1.81.588-1.81h4.166a1 1 0 00.95-.69l1.286-3.966z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities Checkboxes */}
                    <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {['wifi', 'parking', 'breakfast', 'pets'].map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name={amenity}
                                    checked={filters[amenity]}
                                    onChange={handleInputChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                            </label>
                        ))}
                    </div>

                    {/* Apply and Reset Buttons */}
                    <div className="flex justify-between">
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FilterVenues;
