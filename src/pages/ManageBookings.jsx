import React, { useState, useEffect } from 'react'; // Import necessary hooks from React
import { getManagerVenues } from '../services/apiService'; // Import the function to fetch venues from an external API
import { Link } from 'react-router-dom'; // Import the Link component for navigation
import { FaChevronDown, FaChevronUp, FaArrowLeft } from 'react-icons/fa'; // Import icons for UI
import { ToastContainer, toast } from 'react-toastify'; // Import toast notification system
import 'react-toastify/dist/ReactToastify.css'; // Import toastify default styles

/**
 * ManageBookings component allows the user to view, expand, and interact with the venues they manage.
 * It fetches venue data from an API and displays relevant bookings for each venue.
 */
function ManageBookings() {
    // State to store the list of venues fetched from the API
    const [venues, setVenues] = useState([]);

    // State to manage the loading state while the API call is being processed
    const [loading, setLoading] = useState(true);

    // State to handle any error messages during the API call or data processing
    const [error, setError] = useState('');

    // State to track which venue's bookings are currently expanded for viewing
    const [activeVenueId, setActiveVenueId] = useState(null);

    /**
     * useEffect hook runs once on component mount to fetch the list of venues.
     * The empty dependency array ensures this effect is called only once when the component loads.
     */
    useEffect(() => {
        fetchManagerVenues();
    }, []);

    /**
     * Fetches the list of venues managed by the user from the API.
     * Updates the venues state with the fetched data or displays an error notification in case of failure.
     */
    const fetchManagerVenues = async () => {
        try {
            // Make API call to get the user's managed venues
            const response = await getManagerVenues();

            // Ensure the response data is an array before setting the venues state
            const venuesData = Array.isArray(response.data) ? response.data : [];
            setVenues(venuesData); // Update venues state with the received data
        } catch (error) {
            // Display an error message to the user if the API call fails
            toast.error('Failed to load your venues. Please try again later.');
        } finally {
            // Set loading state to false after data is fetched or an error occurs
            setLoading(false);
        }
    };

    /**
     * Toggles the active state of a venue to show or hide its bookings.
     * If the venue is already active, it will collapse; otherwise, it will expand.
     * @param {number} venueId - The unique ID of the venue being toggled.
     */
    const toggleVenue = (venueId) => {
        setActiveVenueId(activeVenueId === venueId ? null : venueId); // Toggle between active and inactive state
    };

    // Display a loading message while the venues are being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-500 text-lg">Loading your venues...</p>
            </div>
        );
    }

    // Display a message if no venues are found for the user
    if (!Array.isArray(venues) || venues.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-gray-700 text-lg">You have no venues.</p>
            </div>
        );
    }

    // Main component rendering the list of venues and their associated bookings
    return (
        <div className="container mx-auto py-8 px-4">
            {/* ToastContainer for displaying toast notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000} // Toast will auto close after 3 seconds
                hideProgressBar={false} // Show the progress bar in the toast
                newestOnTop // Newer toasts appear on top
                closeOnClick // Toast can be closed by clicking on it
                rtl={false} // Text direction is not right-to-left
                pauseOnFocusLoss // Pauses the toast timer when the window loses focus
                draggable // Allows dragging the toast on the screen
                pauseOnHover // Pauses the toast timer on hover
            />

            {/* Back button to navigate to the User Dashboard */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <Link
                    to="/user-dashboard"
                    className="flex items-center mb-4 sm:mb-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Back to User Dashboard"
                >
                    <FaArrowLeft className="mr-2" /> {/* Back arrow icon */}
                    Back to Dashboard
                </Link>

                {/* Heading for the Manage Bookings section */}
                <h2 className="text-3xl font-bold text-blue-900 text-center sm:text-left">
                    Manage Bookings
                </h2>
            </div>

            {/* List of venues with their respective bookings */}
            <div className="space-y-4">
                {venues.map((venue) => (
                    <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Venue header: Clicking this toggles the visibility of its bookings */}
                        <button
                            onClick={() => toggleVenue(venue.id)}
                            className="w-full flex justify-between items-center px-4 py-3 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-expanded={activeVenueId === venue.id}
                            aria-controls={`venue-details-${venue.id}`}
                        >
                            <h3 className="text-xl font-semibold text-blue-800">{venue.name}</h3>
                            {activeVenueId === venue.id ? (
                                <FaChevronUp className="text-blue-600" /> // Up arrow if expanded
                            ) : (
                                <FaChevronDown className="text-blue-600" /> // Down arrow if collapsed
                            )}
                        </button>

                        {/* Booking details for the venue, shown when the venue is active */}
                        {activeVenueId === venue.id && (
                            <div
                                id={`venue-details-${venue.id}`}
                                className="px-4 py-3 bg-gray-50"
                            >
                                {/* Check if there are any bookings for the venue */}
                                {Array.isArray(venue.bookings) && venue.bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {venue.bookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                                            >
                                                {/* Booking ID and guest name */}
                                                <div className="flex flex-col sm:flex-row sm:justify-between">
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
                                                                'N/A' // Display 'N/A' if no guest name is available
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Check-in and check-out dates */}
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

                                                {/* Guests count and contact information */}
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
                                    <p className="text-gray-600">No bookings for this venue.</p> // Message if no bookings
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageBookings; // Export the component for use in other parts of the application
