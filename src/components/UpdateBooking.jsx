// src/pages/UpdateBooking.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { updateBooking, getVenueByIdWithBookings } from '../services/apiService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from 'react-tooltip';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Component for updating an existing booking.
 * Displays a form to update booking dates and guest numbers.
 * Provides real-time feedback on available dates and validation of input fields.
 * @returns {JSX.Element} - The rendered update booking page.
 */
function UpdateBooking() {
    const navigate = useNavigate(); // For programmatic navigation
    const { id: bookingId } = useParams(); // Get booking ID from URL parameters
    const { state } = useLocation(); // Get booking data from passed state
    const booking = state?.booking; // Retrieve booking data from the state

    // Redirect to bookings page if no booking data is available
    if (!booking) {
        navigate('/user-dashboard/bookings');
        return null;
    }

    // State to manage booking date range, number of guests, and any errors
    const [bookingDateRange, setBookingDateRange] = useState([
        new Date(booking.dateFrom),
        new Date(booking.dateTo),
    ]);
    const [guests, setGuests] = useState(booking.guests);
    const [error, setError] = useState('');

    // State for storing booked dates and maximum guests allowed for the venue
    const [bookedDates, setBookedDates] = useState([]);
    const [maxGuests, setMaxGuests] = useState(booking.venue.maxGuests || 1);

    // Fetch venue details and booked dates on component mount
    useEffect(() => {
        fetchVenueWithBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Fetches venue data along with the booked dates for the venue.
     * Excludes the current booking's dates to avoid conflicts during updates.
     */
    const fetchVenueWithBookings = async () => {
        try {
            const venueData = await getVenueByIdWithBookings(booking.venue.id);
            const venueBookings = venueData.data.bookings;

            // Filter out the current booking to avoid booking conflicts with itself
            const otherBookings = venueBookings.filter(
                (b) => b.id.toString() !== booking.id.toString()
            );

            // Extract booked dates and store them
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
            setBookedDates(dates); // Store the booked dates
        } catch (error) {
            toast.error('Failed to load venue bookings. Please try again.');
            setError('Failed to load venue bookings.');
        }
    };

    /**
     * Checks if a specific date is already booked.
     * @param {Date} date - The date to check.
     * @returns {boolean} - Returns true if the date is booked, false otherwise.
     */
    const isDateBooked = (date) => {
        return bookedDates.some(
            (bookedDate) =>
                bookedDate.getFullYear() === date.getFullYear() &&
                bookedDate.getMonth() === date.getMonth() &&
                bookedDate.getDate() === date.getDate()
        );
    };

    /**
     * Adds a CSS class to calendar tiles if the date is booked.
     * @param {Object} param0 - Calendar tile properties.
     * @returns {string|null} - Returns a CSS class for booked dates.
     */
    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return 'booked-date'; // Class for booked dates
        }
        return null;
    };

    /**
     * Adds a tooltip to calendar tiles if the date is booked.
     * @param {Object} param0 - Calendar tile properties.
     * @returns {JSX.Element|null} - Returns a tooltip element if the date is booked.
     */
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

    /**
     * Handles the submission of the update form.
     * Validates the input data and sends the update request to the API.
     * Provides feedback on success or failure using toast notifications.
     * @param {Event} e - Form submit event.
     */
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate that date range is selected and valid
        if (!bookingDateRange || bookingDateRange.length !== 2) {
            setError('Please select check-in and check-out dates.');
            toast.error('Please select check-in and check-out dates.');
            return;
        }

        const [dateFrom, dateTo] = bookingDateRange;

        // Ensure check-out date is after check-in date
        if (dateTo <= dateFrom) {
            setError('Check-out date must be after check-in date.');
            toast.error('Check-out date must be after check-in date.');
            return;
        }

        // Validate guest count is within the allowed range
        if (guests < 1 || guests > maxGuests) {
            setError(`Number of guests must be between 1 and ${maxGuests}.`);
            toast.error(`Number of guests must be between 1 and ${maxGuests}.`);
            return;
        }

        // Prepare booking data for the update request
        const bookingData = {
            dateFrom: dateFrom.toISOString(),
            dateTo: dateTo.toISOString(),
            guests: guests,
        };

        try {
            // Make the API call to update the booking
            await updateBooking(booking.id, bookingData);
            toast.success('Booking updated successfully.');
            // Navigate back to the bookings page after a short delay
            setTimeout(() => {
                navigate('/user-dashboard/bookings');
            }, 1500);
        } catch (error) {
            // Handle errors and show the appropriate error message
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessage = error.response.data.errors[0].message;
                setError(errorMessage);
                toast.error(errorMessage);
            } else {
                setError('Failed to update booking.');
                toast.error('Failed to update booking.');
            }
        }
    };

    return (
        <div className="container mx-auto py-12">
            {/* Local ToastContainer for this component */}
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
