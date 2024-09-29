// src/pages/ManageMyVenuesPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserVenues, deleteVenue } from '../services/apiService';
import { FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

/**
 * ManageMyVenuesPage component allows the user to manage their created venues.
 * It displays the user's venues and allows them to view, edit, or delete them.
 *
 * @component
 * @returns {JSX.Element} The rendered ManageMyVenuesPage component.
 */
function ManageMyVenuesPage() {
    // State to store the list of venues created by the user
    const [venues, setVenues] = useState([]);
    // State to manage loading status while fetching data
    const [loading, setLoading] = useState(true);
    // State to store any errors encountered during data fetching
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // Retrieve the username from localStorage (assuming the user is authenticated)
    const username = localStorage.getItem('userName');

    // State to control the visibility of the delete confirmation modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    // State to store the ID of the venue to be deleted
    const [venueToDelete, setVenueToDelete] = useState(null);

    /**
     * useEffect hook to fetch the user's venues when the component mounts.
     * It fetches the venues from the API using the getUserVenues function.
     */
    useEffect(() => {
        async function fetchUserVenues() {
            try {
                // Fetch venues from the API and ensure the response is an array
                const response = await getUserVenues(username);
                setVenues(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                // Display an error message if the API call fails
                toast.error('Failed to load your venues. Please try again later.');
            } finally {
                // Set loading to false once the API call is complete
                setLoading(false);
            }
        }

        fetchUserVenues();
    }, [username]);

    /**
     * Handles the venue editing by navigating to the EditVenuePage.
     *
     * @param {string} venueId - The ID of the venue to edit.
     */
    const handleEdit = (venueId) => {
        navigate(`/edit-venue/${venueId}`); // Navigate to the edit page for the selected venue
    };

    /**
     * Opens the delete confirmation modal for the selected venue.
     *
     * @param {string} venueId - The ID of the venue to delete.
     */
    const handleDeleteClick = (venueId) => {
        setVenueToDelete(venueId);
        setShowDeleteModal(true);
    };

    /**
     * Confirms the deletion of the venue and calls the API.
     */
    const confirmDelete = async () => {
        try {
            // API call to delete the venue
            await deleteVenue(venueToDelete);
            // Update the list of venues after successful deletion
            setVenues(venues.filter((venue) => venue.id !== venueToDelete));
            toast.success('Venue deleted successfully.');
        } catch (error) {
            // Display an error message if the API call fails
            toast.error('Failed to delete the venue. Please try again later.');
        } finally {
            // Close the modal and reset the venueToDelete state
            setShowDeleteModal(false);
            setVenueToDelete(null);
        }
    };

    /**
     * Cancels the deletion and closes the modal.
     */
    const cancelDelete = () => {
        setShowDeleteModal(false);
        setVenueToDelete(null);
    };

    // Display a loading message while the data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-500 text-lg">Loading your venues...</p>
            </div>
        );
    }

    // Display an error message if any errors occurred during the data fetching process
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* ToastContainer to render toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">
                            Are you sure you want to delete this venue? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Back Button and Heading Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center mb-6">
                {/* Back Button to return to the User Dashboard */}
                <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                    <Link
                        to="/user-dashboard"
                        className="flex items-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        aria-label="Back to User Dashboard"
                    >
                        <FaArrowLeft className="mr-2" /> {/* Left-pointing arrow icon */}
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

            {/* Render Venues if available, otherwise display a message */}
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
                                        : '/src/assets/images/placeholder-hotel.png' // Fallback image if no media available
                                }
                                alt={
                                    venue.media && venue.media.length > 0
                                        ? venue.media[0].alt || 'Venue Image'
                                        : 'Venue Image' // Fallback alt text if no media available
                                }
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />

                            {/* Venue Name */}
                            <h3 className="text-xl font-semibold mb-2">{venue.name}</h3>

                            {/* Venue Price */}
                            <p className="text-gray-600 mb-2">Price: ${venue.price}</p>

                            {/* Venue Max Guests */}
                            <p className="text-gray-600 mb-4">Max Guests: {venue.maxGuests}</p>

                            {/* View, Edit, and Delete Buttons */}
                            <div className="flex justify-between">
                                {/* View Venue Button */}
                                <Link
                                    to={`/venues/${venue.id}`} // Corrected route
                                    className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    aria-label={`View ${venue.name}`}
                                >
                                    View
                                </Link>
                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEdit(venue.id)}
                                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={`Edit ${venue.name}`}
                                >
                                    Edit
                                </button>
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeleteClick(venue.id)}
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
