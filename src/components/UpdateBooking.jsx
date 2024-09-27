// src/pages/UpdateBooking.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateBooking, getVenueByIdWithBookings } from '../services/apiService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from 'react-tooltip';

function UpdateBooking() {
    const navigate = useNavigate();
    const { id: bookingId } = useParams();
    const { state } = useLocation();
    const booking = state?.booking;

    // Handle if booking data is not available
    if (!booking) {
        navigate('/user-dashboard/bookings');
        return null;
    }

    const [bookingDateRange, setBookingDateRange] = useState([
        new Date(booking.dateFrom),
        new Date(booking.dateTo),
    ]);
    const [guests, setGuests] = useState(booking.guests);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State for booked dates
    const [bookedDates, setBookedDates] = useState([]);
    const [maxGuests, setMaxGuests] = useState(booking.venue.maxGuests || 1);

    useEffect(() => {
        fetchVenueWithBookings();
    }, []);

    const fetchVenueWithBookings = async () => {
        try {
            const venueData = await getVenueByIdWithBookings(booking.venue.id);
            const venueBookings = venueData.data.bookings;

            // Exclude the current booking from the list
            const otherBookings = venueBookings.filter(
                (b) => b.id.toString() !== booking.id.toString()
            );

            // Extract booked dates
            const dates = [];
            otherBookings.forEach((booking) => {
                const startDate = new Date(booking.dateFrom);
                const endDate = new Date(booking.dateTo);
                for (
                    let d = new Date(startDate);
                    d <= endDate;
                    d.setDate(d.getDate() + 1)
                ) {
                    dates.push(new Date(d));
                }
            });
            setBookedDates(dates);
        } catch (error) {
            console.error('Error fetching venue bookings:', error);
            setError('Failed to load venue bookings.');
        }
    };

    // Function to check if a date is booked
    const isDateBooked = (date) => {
        return bookedDates.some(
            (bookedDate) =>
                bookedDate.getFullYear() === date.getFullYear() &&
                bookedDate.getMonth() === date.getMonth() &&
                bookedDate.getDate() === date.getDate()
        );
    };

    // Define tileClassName function
    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return 'booked-date';
        }
        return null;
    };

    // Define tileContent function
    const tileContent = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return (
                <div
                    data-tooltip-id={`booked-date-tooltip`}
                    data-tooltip-content="This date is booked"
                />
            );
        }
        return null;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!bookingDateRange || bookingDateRange.length !== 2) {
            setError('Please select check-in and check-out dates.');
            return;
        }

        const [dateFrom, dateTo] = bookingDateRange;

        if (dateTo <= dateFrom) {
            setError('Check-out date must be after check-in date.');
            return;
        }

        if (guests < 1 || guests > maxGuests) {
            setError(`Number of guests must be between 1 and ${maxGuests}.`);
            return;
        }

        const bookingData = {
            dateFrom: dateFrom.toISOString(),
            dateTo: dateTo.toISOString(),
            guests: guests,
        };

        try {
            await updateBooking(booking.id, bookingData);
            setSuccess('Booking updated successfully.');
            // Navigate back to bookings page
            navigate('/user-dashboard/bookings');
        } catch (error) {
            console.error('Error updating booking:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                setError(error.response.data.errors[0].message);
            } else {
                setError('Failed to update booking.');
            }
        }
    };

    return (
        <div className="container mx-auto py-12">
            <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Update Booking</h2>
            <form
                className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
                onSubmit={handleUpdateSubmit}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Select Dates</label>
                    <Calendar
                        selectRange
                        onChange={setBookingDateRange}
                        value={bookingDateRange}
                        minDate={new Date()}
                        tileDisabled={({ date }) => isDateBooked(date)}
                        tileClassName={tileClassName}
                        tileContent={tileContent}
                        className="mx-auto"
                    />
                    <Tooltip id="booked-date-tooltip" />
                </div>
                <div className="mb-4">
                    <label htmlFor="guests" className="block text-gray-700 font-medium">
                        Number of Guests
                    </label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        min="1"
                        max={maxGuests}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                {error && (
                    <div className="p-2 bg-red-100 text-red-700 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-2 bg-green-100 text-green-700 rounded mb-4">
                        {success}
                    </div>
                )}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate('/user-dashboard/bookings')}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                        Update Booking
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UpdateBooking;
