import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserBookings, deleteBooking } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * UserBookings component displays the user's bookings.
 * It allows users to view, update, and delete their bookings.
 *
 * @component
 * @returns {JSX.Element} The rendered UserBookings component.
 */
function UserBookings() {
    const { user } = useContext(AuthContext);  // Access the current user from AuthContext
    const [bookings, setBookings] = useState([]);  // State to store the user's bookings
    const [loading, setLoading] = useState(true);  // State to manage loading status
    const navigate = useNavigate();  // Hook to navigate programmatically

    /**
     * useEffect hook to fetch the user's bookings when the user object is available.
     */
    useEffect(() => {
        if (user) {
            fetchUserBookings();  // Fetch the bookings for the logged-in user
        }
    }, [user]);

    /**
     * Fetches the user's bookings from the API and updates the state.
     * Displays a toast notification if the request fails.
     */
    const fetchUserBookings = async () => {
        try {
            const bookingsData = await getUserBookings(user.userName);  // API call to get bookings
            setBookings(bookingsData.data);  // Update state with fetched bookings
        } catch (error) {
            toast.error('Failed to load your bookings. Please try again later.');  // Show error message if fetching fails
        } finally {
            setLoading(false);  // Set loading to false once data is fetched
        }
    };

    /**
     * Deletes a booking by its ID and removes it from the state.
     * Displays a confirmation prompt and handles errors.
     *
     * @param {string} bookingId - The ID of the booking to delete.
     */
    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await deleteBooking(bookingId);  // API call to delete booking
                setBookings(bookings.filter((booking) => booking.id !== bookingId));  // Remove the deleted booking from state
                toast.success('Booking deleted successfully.');  // Show success message
            } catch (error) {
                toast.error('Failed to delete the booking. Please try again later.');  // Show error message if deletion fails
            }
        }
    };

    /**
     * Navigates to the update booking page with the selected booking data.
     *
     * @param {Object} booking - The booking to be updated.
     */
    const handleUpdateBooking = (booking) => {
        navigate(`/update-booking/${booking.id}`, { state: { booking } });  // Navigate to the booking update page
    };

    /**
     * Handler to navigate back to the user dashboard.
     */
    const handleBackToDashboard = () => {
        navigate('/user-dashboard');  // Navigate back to the user dashboard
    };

    // Show a loading message while the bookings are being fetched
    if (loading) {
        return <p className="text-center text-gray-500 text-lg">Loading your bookings...</p>;
    }

    return (
        <div className="container mx-auto py-12">
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

            {/* Header Section with Title and Back Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
                <button
                    onClick={handleBackToDashboard}
                    className="flex items-center bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                    <FaArrowLeft className="mr-2" />  {/* Left-pointing arrow icon */}
                    Back to Dashboard
                </button>
            </div>

            {/* If no bookings are available, display a message */}
            {bookings.length === 0 ? (
                <p className="text-center text-gray-700">You have no bookings.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                            <img
                                src={booking.venue.media[0]?.url || '/placeholder-image.jpg'}
                                alt={booking.venue.media[0]?.alt || booking.venue.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                                onError={(e) => (e.target.src = '/placeholder-image.jpg')}  // Fallback image if loading fails
                            />
                            <h3 className="text-xl font-semibold mb-2">{booking.venue.name}</h3>
                            <p className="text-gray-600">
                                <strong>From:</strong> {new Date(booking.dateFrom).toLocaleDateString()} <br />
                                <strong>To:</strong> {new Date(booking.dateTo).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                <strong>Guests:</strong> {booking.guests}
                            </p>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => navigate(`/venues/${booking.venue.id}`)}
                                    className="text-blue-600 hover:underline"
                                >
                                    View Venue
                                </button>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateBooking(booking)}
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <FaEdit />  {/* Edit icon for updating booking */}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />  {/* Trash icon for deleting booking */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserBookings;