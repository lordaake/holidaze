// src/pages/UserBookings.jsx

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserBookings, deleteBooking } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaArrowLeft } from 'react-icons/fa';

function UserBookings() {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            const bookingsData = await getUserBookings(user.userName);
            setBookings(bookingsData.data);
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            setError('Failed to load your bookings.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            await deleteBooking(bookingId);
            // Remove the booking from the state
            setBookings(bookings.filter((booking) => booking.id !== bookingId));
        } catch (error) {
            console.error('Error deleting booking:', error);
            setError('Failed to delete booking.');
        }
    };

    const handleUpdateBooking = (booking) => {
        navigate(`/update-booking/${booking.id}`, { state: { booking } });
    };

    // Handler to navigate back to the dashboard
    const handleBackToDashboard = () => {
        navigate('/user-dashboard');
    };

    if (loading) {
        return <p className="text-center text-gray-500 text-lg">Loading your bookings...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 text-lg">{error}</p>;
    }

    return (
        <div className="container mx-auto py-12">
            {/* Header Section with Title and Back Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
                <button
                    onClick={handleBackToDashboard}
                    className="flex items-center bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                    <FaArrowLeft className="mr-2" /> {/* Left-pointing arrow */}
                    Back to Dashboard
                </button>
            </div>

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
                                onError={(e) => (e.target.src = '/placeholder-image.jpg')}
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
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <FaTrash />
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
