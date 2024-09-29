// src/pages/CreateVenuePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createVenue, getVenueById, updateVenue } from '../services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Component for creating or editing a venue.
 * Handles form state, validation, and submission.
 */
function CreateVenuePage() {
    const { id } = useParams(); // Retrieve the venue ID from the URL (if editing)
    const navigate = useNavigate();

    // Single state object for all form fields
    const [venue, setVenue] = useState({
        name: '',
        description: '',
        location: {
            address: '',
            city: '',
            country: ''
        },
        price: '',
        maxGuests: '',
        media: [''],
        meta: {
            wifi: false,
            parking: false,
            breakfast: false,
            pets: false
        },
        rating: 0  // Added rating here
    });

    const [error, setError] = useState(''); // State to hold error messages
    const [loading, setLoading] = useState(false); // Loading state

    // Determine if the component is in edit mode based on the presence of an ID
    const isEditMode = Boolean(id);

    /**
     * Fetches existing venue data if in edit mode.
     * Populates the form with existing data.
     */
    useEffect(() => {
        if (isEditMode) {
            const fetchVenue = async () => {
                setLoading(true); // Start loading
                try {
                    // Fetch venue data by ID
                    const existingVenueResponse = await getVenueById(id);
                    const venueData = existingVenueResponse.data || existingVenueResponse;

                    // Process media data to extract URLs
                    const mediaData = Array.isArray(venueData.media)
                        ? (venueData.media.length > 0 && typeof venueData.media[0] === 'object'
                            ? venueData.media.map(image => image.url)
                            : venueData.media)
                        : [''];

                    // Populate the venue state with fetched data
                    setVenue({
                        name: venueData.name || '',
                        description: venueData.description || '',
                        location: {
                            address: venueData.location?.address || '',
                            city: venueData.location?.city || '',
                            country: venueData.location?.country || ''
                        },
                        price: venueData.price !== undefined ? venueData.price.toString() : '',
                        maxGuests: venueData.maxGuests !== undefined ? venueData.maxGuests.toString() : '',
                        media: mediaData.length > 0 ? mediaData : [''],
                        meta: {
                            wifi: venueData.meta?.wifi || false,
                            parking: venueData.meta?.parking || false,
                            breakfast: venueData.meta?.breakfast || false,
                            pets: venueData.meta?.pets || false,
                        },
                        rating: venueData.rating !== undefined ? venueData.rating.toString() : '0' // Load rating
                    });
                } catch (err) {
                    // Handle errors during data fetching
                    toast.error('Failed to load venue data for editing.');
                    setError('Failed to load venue data for editing.');
                } finally {
                    setLoading(false); // End loading
                }
            };

            fetchVenue(); // Initiate data fetch
        }
    }, [id, isEditMode]);

    /**
     * Handles the save action for creating or updating a venue.
     * Validates input and submits data to the server.
     */
    const handleSave = async () => {
        // Validate venue name
        if (!venue.name.trim()) {
            setError('Venue name is required.');
            toast.error('Venue name is required.');
            return;
        }

        // Validate max guests
        const maxGuestsNumber = parseInt(venue.maxGuests, 10);
        if (isNaN(maxGuestsNumber) || maxGuestsNumber < 1) {
            setError('Max Guests must be a positive number.');
            toast.error('Max Guests must be a positive number.');
            return;
        }

        if (maxGuestsNumber > 100) {
            setError('A venue cannot accommodate more than 100 guests.');
            toast.error('A venue cannot accommodate more than 100 guests.');
            return;
        }

        // Reset error state if validation passes
        setError('');

        try {
            // Prepare venue data for submission
            const venueData = {
                name: venue.name,
                description: venue.description,
                price: parseFloat(venue.price),
                maxGuests: maxGuestsNumber,
                media: venue.media
                    .filter(image => image.trim() !== '') // Remove empty image URLs
                    .map(url => ({ url, alt: 'Venue image' })), // Format media objects
                meta: venue.meta,
                location: {
                    address: venue.location.address,
                    city: venue.location.city,
                    country: venue.location.country
                },
                rating: parseFloat(venue.rating) // Convert rating to float
            };

            if (isEditMode) {
                // Update existing venue
                await updateVenue(id, venueData);
                toast.success('Venue updated successfully.');
            } else {
                // Create new venue
                await createVenue(venueData);
                toast.success('Venue created successfully.');
            }

            // Navigate back to user dashboard after a short delay to allow the toast to display
            setTimeout(() => {
                navigate('/manage-venues');
            }, 1500);
        } catch (err) {
            // Handle errors during submission
            if (err.response) {
                const serverErrors = err.response.data.errors;
                if (serverErrors && serverErrors.length > 0) {
                    const combinedErrorMessage = serverErrors.map(e => e.message).join(' ');
                    setError(combinedErrorMessage);
                    toast.error(combinedErrorMessage);
                } else {
                    const genericError = `Failed to ${isEditMode ? 'update' : 'create'} venue: ${err.response.data.message || 'Unknown error.'}`;
                    setError(genericError);
                    toast.error(genericError);
                }
            } else if (err.request) {
                // No response from server
                setError('No response from the server. Please try again later.');
                toast.error('No response from the server. Please try again later.');
            } else {
                // Other unexpected errors
                setError('An unexpected error occurred.');
                toast.error('An unexpected error occurred.');
            }
        }
    };

    /**
     * Handles changes to image URLs in the media array.
     * @param {number} index - Index of the image to update.
     * @param {string} value - New image URL.
     */
    const handleImageChange = (index, value) => {
        const newMedia = [...venue.media];
        newMedia[index] = value;
        setVenue({ ...venue, media: newMedia });
    };

    /**
     * Adds a new empty image field to the media array.
     */
    const addImageField = () => {
        setVenue({ ...venue, media: [...venue.media, ''] });
    };

    /**
     * Removes an image field from the media array based on index.
     * @param {number} index - Index of the image to remove.
     */
    const removeImageField = (index) => {
        const newMedia = venue.media.filter((_, i) => i !== index);
        setVenue({ ...venue, media: newMedia });
    };

    /**
     * Handles changes to the amenities checkboxes.
     * @param {string} amenity - The amenity being toggled.
     * @param {boolean} checked - Whether the amenity is checked.
     */
    const handleMetaChange = (amenity, checked) => {
        setVenue({
            ...venue,
            meta: {
                ...venue.meta,
                [amenity]: checked
            }
        });
    };

    // Render a loading indicator while fetching data
    if (loading) {
        return (
            <div className="container mx-auto py-12">
                <div className="text-center text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12">
            {/* Local ToastContainer for displaying notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className={`max-w-3xl mx-auto shadow-lg rounded-lg p-8 ${isEditMode ? 'bg-yellow-100' : 'bg-white'}`}>
                {/* Form Title */}
                <h2 className="text-3xl font-bold mb-6 text-center">
                    {isEditMode ? 'Edit Venue' : 'Create a New Venue'}
                </h2>
                {/* Display error message if any */}
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form>
                    {/* Venue Name Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Venue Name</label>
                        <input
                            type="text"
                            value={venue.name}
                            onChange={(e) => setVenue({ ...venue, name: e.target.value })}
                            placeholder="Enter venue name"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            value={venue.description}
                            onChange={(e) => setVenue({ ...venue, description: e.target.value })}
                            placeholder="Enter venue description"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows="4"
                        />
                    </div>

                    {/* Location Address Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Location Address</label>
                        <input
                            type="text"
                            value={venue.location.address}
                            onChange={(e) => setVenue({
                                ...venue,
                                location: {
                                    ...venue.location,
                                    address: e.target.value
                                }
                            })}
                            placeholder="Enter venue address"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* City Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={venue.location.city}
                            onChange={(e) => setVenue({
                                ...venue,
                                location: {
                                    ...venue.location,
                                    city: e.target.value
                                }
                            })}
                            placeholder="Enter venue city"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Country Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            value={venue.location.country}
                            onChange={(e) => setVenue({
                                ...venue,
                                location: {
                                    ...venue.location,
                                    country: e.target.value
                                }
                            })}
                            placeholder="Enter venue country"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* Price Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            value={venue.price}
                            onChange={(e) => setVenue({ ...venue, price: e.target.value })}
                            placeholder="Enter venue price"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Max Guests Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Max Guests</label>
                        <input
                            type="number"
                            value={venue.maxGuests}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Validate that maxGuests is between 1 and 100
                                if (value === '' || (parseInt(value, 10) <= 100 && parseInt(value, 10) >= 1)) {
                                    setVenue({ ...venue, maxGuests: value });
                                    setError(''); // Clear error if valid
                                } else {
                                    setError('A venue cannot accommodate more than 100 guests.');
                                    toast.error('A venue cannot accommodate more than 100 guests.');
                                }
                            }}
                            placeholder="Enter maximum number of guests"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            min="1"
                            max="100" // Enforce the limit
                        />
                        {/* Display validation message if maxGuests exceeds 100 */}
                        {venue.maxGuests && parseInt(venue.maxGuests, 10) > 100 && (
                            <p className="text-red-500 text-sm mt-1">A venue cannot accommodate more than 100 guests.</p>
                        )}
                    </div>

                    {/* Rating Input */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Rating</label>
                        <input
                            type="number"
                            value={venue.rating}
                            onChange={(e) => setVenue({ ...venue, rating: e.target.value })}
                            placeholder="Enter venue rating (0-5)"
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            min="0"
                            max="5"
                            step="0.1"
                        />
                    </div>

                    {/* Amenities Checkboxes */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Amenities</label>
                        <div className="flex flex-wrap space-x-4">
                            {['wifi', 'parking', 'breakfast', 'pets'].map((amenity) => (
                                <label key={amenity} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={venue.meta[amenity]}
                                        onChange={(e) => handleMetaChange(amenity, e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Images Input Fields */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Images</label>
                        {venue.media.map((image, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => handleImageChange(index, e.target.value)}
                                    placeholder="Enter image URL"
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {/* Show remove button only if there's more than one image field */}
                                {venue.media.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="ml-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        {/* Button to add another image field */}
                        <button
                            type="button"
                            onClick={addImageField}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-300 mt-2"
                        >
                            Add Another Image
                        </button>
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex justify-end space-x-4">
                        {/* Cancel button navigates back to user dashboard */}
                        <button
                            type="button"
                            onClick={() => navigate('/manage-venues')}
                            className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300"
                        >
                            Cancel
                        </button>
                        {/* Save/Create button triggers handleSave */}
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            {isEditMode ? 'Save Changes' : 'Create Venue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateVenuePage;
