// src/pages/VenueDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVenueById, createBooking } from '../services/apiService';
import {
    FaMapMarkerAlt,
    FaUsers,
    FaDollarSign,
    FaWifi,
    FaParking,
    FaConciergeBell,
    FaPaw,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
} from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from 'react-tooltip';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays } from 'date-fns';
import { FaTimes } from 'react-icons/fa';

/**
 * VenueDetails component displays detailed information about a specific venue,
 * including images, description, amenities, location, reviews, and a booking form.
 * It fetches venue data from the API, manages booking state, and handles user interactions.
 *
 * @component
 * @returns {JSX.Element} The rendered VenueDetails component.
 */
function VenueDetails() {
    // Extract the venue ID from the URL parameters
    const { id } = useParams();

    // Hook to navigate programmatically
    const navigate = useNavigate();

    // State to store the venue data
    const [venue, setVenue] = useState(null);

    // State to manage loading status
    const [loading, setLoading] = useState(true);

    // State to store error messages
    const [error, setError] = useState('');

    // Placeholder image URL for venues without images
    const placeholderImage = 'https://via.placeholder.com/400x300?text=No+Image+Available';

    // Booking-related states

    /**
     * Array of dates that are already booked for the venue.
     * Used to disable selection of these dates in the calendar.
     */
    const [bookedDates, setBookedDates] = useState([]);

    /**
     * Selected date range for booking (check-in and check-out dates).
     */
    const [bookingDateRange, setBookingDateRange] = useState(null);

    /**
     * Number of guests for the booking.
     */
    const [guests, setGuests] = useState(1);

    /**
     * Total price calculated based on the selected date range and venue price.
     */
    const [totalPrice, setTotalPrice] = useState(0);

    /**
     * Maximum number of guests allowed for the venue.
     */
    const [maxGuests, setMaxGuests] = useState(1);

    /**
     * Fetches venue data from the API based on the venue ID.
     * Includes bookings and reviews for comprehensive details.
     * Sets the venue state and processes booked dates.
     *
     * @async
     * @function fetchVenueData
     */
    const fetchVenueData = async () => {
        try {
            // Fetch venue data including bookings and reviews
            const venueData = await getVenueById(id, true, true);
            setVenue(venueData.data);

            // Extract booked dates from the bookings data
            if (venueData.data.bookings && venueData.data.bookings.length > 0) {
                const dates = [];
                venueData.data.bookings.forEach((booking) => {
                    const startDate = new Date(booking.dateFrom);
                    const endDate = new Date(booking.dateTo);
                    // Include all dates from start to end
                    for (
                        let d = new Date(startDate);
                        d <= endDate;
                        d.setDate(d.getDate() + 1)
                    ) {
                        dates.push(new Date(d));
                    }
                });
                setBookedDates(dates);
            } else {
                setBookedDates([]);
            }

            // Set the maximum number of guests allowed
            setMaxGuests(venueData.data.maxGuests || 1);
        } catch (error) {
            // Log the error and set error state
            console.error(`Failed to fetch data for venue with ID ${id}:`, error);
            setError('Failed to load venue data.');
            toast.error('Failed to load venue data. Please try again later.');
        } finally {
            // Set loading to false regardless of success or failure
            setLoading(false);
        }
    };

    /**
     * Scrolls the window to the top when the component mounts.
     */
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    /**
     * Fetch venue data whenever the venue ID changes.
     */
    useEffect(() => {
        fetchVenueData();
    }, [id]);

    /**
     * Checks if a given date is already booked.
     *
     * @param {Date} date - The date to check.
     * @returns {boolean} True if the date is booked, otherwise false.
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
     * Determines whether a date tile in the calendar should be disabled.
     *
     * @param {Object} param0 - Object containing date and view information.
     * @param {Date} param0.date - The date of the tile.
     * @param {string} param0.view - The current view of the calendar.
     * @returns {boolean} True if the date should be disabled, otherwise false.
     */
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            return isDateBooked(date);
        }
    };

    /**
     * Assigns a CSS class to booked dates in the calendar for styling purposes.
     *
     * @param {Object} param0 - Object containing date and view information.
     * @param {Date} param0.date - The date of the tile.
     * @param {string} param0.view - The current view of the calendar.
     * @returns {string|null} The CSS class name or null.
     */
    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return 'booked-date';
        }
        return null;
    };

    /**
     * Adds tooltip content to booked dates in the calendar.
     *
     * @param {Object} param0 - Object containing date and view information.
     * @param {Date} param0.date - The date of the tile.
     * @param {string} param0.view - The current view of the calendar.
     * @returns {JSX.Element|null} The JSX element for the tooltip or null.
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
     * Updates the total price whenever the booking date range or venue price changes.
     * Calculates the number of nights and multiplies by the venue's price per night.
     */
    useEffect(() => {
        if (bookingDateRange && bookingDateRange.length === 2) {
            const [startDate, endDate] = bookingDateRange;
            const nights = differenceInDays(endDate, startDate);
            setTotalPrice(nights * venue.price);
        } else {
            setTotalPrice(0);
        }
    }, [bookingDateRange, venue?.price]);

    /**
     * Handles the submission of the booking form.
     * Validates input, creates a booking via the API, and provides user feedback.
     *
     * @param {Event} e - The form submission event.
     */
    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in by verifying the presence of a token
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login page if not authenticated
            navigate('/login');
            return;
        }

        // Validate that a date range has been selected
        if (!bookingDateRange || bookingDateRange.length !== 2) {
            toast.error('Please select check-in and check-out dates.');
            return;
        }

        const [checkInDate, checkOutDate] = bookingDateRange;

        // Ensure that the check-out date is after the check-in date
        if (checkOutDate <= checkInDate) {
            toast.error('Check-out date must be after check-in date.');
            return;
        }

        // Validate the number of guests
        if (guests < 1 || guests > maxGuests) {
            toast.error(`Number of guests must be between 1 and ${maxGuests}.`);
            return;
        }

        // Prepare the booking data to be sent to the API
        const bookingData = {
            dateFrom: checkInDate.toISOString(),
            dateTo: checkOutDate.toISOString(),
            guests: guests,
            venueId: id,
        };

        try {
            // Create the booking via the API
            const response = await createBooking(bookingData);
            toast.success('Your booking was successful!');
            // Refresh the venue data to update the booked dates
            await fetchVenueData();
        } catch (error) {
            // Handle errors during booking creation
            console.error('Error creating booking:', error);
            let errorMessage = 'Failed to create booking. Please try again.';
            if (error.response) {
                if (error.response.status === 401) {
                    errorMessage = 'You are not authorized. Please log in.';
                    navigate('/login');
                } else if (error.response.data && error.response.data.errors) {
                    errorMessage = error.response.data.errors[0].message;
                } else {
                    errorMessage = 'An error occurred. Please try again later.';
                }
            } else if (error.request) {
                errorMessage = 'No response from the server. Please check your network connection.';
            }
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    // Render a loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color="#123abc" loading={loading} />
            </div>
        );
    }

    // Render an error message if there was an issue fetching data
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-center text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    // Render a message if the venue was not found
    if (!venue) {
        return <p className="text-center text-red-500 text-lg">Venue not found.</p>;
    }

    /**
     * Renders star icons based on the provided rating.
     * Supports full stars, half stars, and empty stars to represent the rating out of 5.
     *
     * @param {number} rating - The rating value (e.g., 4.5).
     * @returns {JSX.Element[]} An array of star icon elements.
     */
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        // Add full star icons
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-yellow-500" />);
        }

        // Add a half star icon if applicable
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-500" />);
        }

        // Add empty star icons
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-500" />);
        }

        return stars;
    };

    return (
        <>
            {/* Container for toast notifications */}
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
            <div className="relative bg-gray-100 py-12">
                <div className="container mx-auto px-4 lg:px-8">

                    {/* Close Button (X Icon) */}
                    <button
                        onClick={() => navigate('/accommodations')} // Navigate back to accommodations
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full z-10" // Relative positioning
                        aria-label="Close"
                    >
                        <FaTimes className="text-2xl" />
                    </button>


                    {/* Venue Name */}
                    <h2 className="text-4xl font-bold mb-6 text-blue-900 text-center">
                        {venue.name}
                    </h2>

                    {/* Venue Images Carousel */}
                    <div className="relative mb-8">
                        <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4">
                            {venue.media && venue.media.length > 0 ? (
                                venue.media.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center"
                                    >
                                        <img
                                            src={image.url || placeholderImage}
                                            alt={image.alt || `Venue Image ${index + 1}`}
                                            className="w-full h-72 object-cover rounded-lg shadow-lg"
                                            onError={(e) => (e.target.src = placeholderImage)}
                                            loading="lazy"
                                        />
                                    </div>
                                ))
                            ) : (
                                <img
                                    src={placeholderImage}
                                    alt="Default Venue"
                                    className="w-full h-72 object-cover rounded-lg shadow-lg"
                                    loading="lazy"
                                />
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        {/* Venue Pricing and Capacity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="flex items-center text-gray-800 text-lg md:text-xl">
                                <FaDollarSign className="text-green-600 mr-2 text-2xl" aria-hidden="true" />
                                <span>Price: ${venue.price} per night</span>
                            </div>
                            <div className="flex items-center text-gray-800 text-lg md:text-xl">
                                <FaUsers className="text-blue-600 mr-2 text-2xl" aria-hidden="true" />
                                <span>Max Guests: {venue.maxGuests}</span>
                            </div>
                        </div>

                        {/* Venue Description */}
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                            {venue.description}
                        </p>

                        {/* Meta Features (Amenities) */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {venue.meta?.wifi && (
                                <div className="flex items-center text-gray-700 text-base">
                                    <FaWifi className="text-blue-500 mr-2 text-xl" aria-hidden="true" />
                                    <span>WiFi Available</span>
                                </div>
                            )}
                            {venue.meta?.parking && (
                                <div className="flex items-center text-gray-700 text-base">
                                    <FaParking className="text-gray-600 mr-2 text-xl" aria-hidden="true" />
                                    <span>Parking Available</span>
                                </div>
                            )}
                            {venue.meta?.breakfast && (
                                <div className="flex items-center text-gray-700 text-base">
                                    <FaConciergeBell className="text-yellow-500 mr-2 text-xl" aria-hidden="true" />
                                    <span>Breakfast Included</span>
                                </div>
                            )}
                            {venue.meta?.pets && (
                                <div className="flex items-center text-gray-700 text-base">
                                    <FaPaw className="text-green-500 mr-2 text-xl" aria-hidden="true" />
                                    <span>Pets Allowed</span>
                                </div>
                            )}
                        </div>

                        {/* Venue Location */}
                        <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">Location</h3>
                        <div className="flex items-center text-gray-700 text-base md:text-lg mb-6">
                            <FaMapMarkerAlt className="text-red-600 mr-2 text-xl" aria-hidden="true" />
                            <p>
                                {venue?.location?.address || 'Address not provided'},{' '}
                                {venue?.location?.city || 'City not provided'},{' '}
                                {venue?.location?.country || 'Country not provided'}
                            </p>
                        </div>

                        {/* Venue Reviews */}
                        {venue.reviews && venue.reviews.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
                                    Reviews
                                </h3>
                                <div className="space-y-4">
                                    {venue.reviews.map((review, index) => (
                                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                                            <div className="flex items-center mb-2">
                                                <div className="flex">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="ml-2 text-gray-600">{review.rating}/5</span>
                                            </div>
                                            <p className="text-gray-700">{review.comment}</p>
                                            <p className="text-sm text-gray-500 mt-2">- {review.userName}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Booking Section */}
                        <div className="bg-gray-50 p-6 rounded-lg shadow-inner mt-8">
                            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">
                                Book Your Stay
                            </h3>
                            <form className="space-y-6" onSubmit={handleBookingSubmit}>
                                {/* Date Selection */}
                                <div>
                                    <label
                                        className="block text-gray-700 font-medium mb-2"
                                        htmlFor="booking-dates"
                                    >
                                        Select Dates
                                    </label>
                                    <Calendar
                                        selectRange
                                        onChange={setBookingDateRange}
                                        value={bookingDateRange}
                                        minDate={new Date()}
                                        tileDisabled={tileDisabled}
                                        tileClassName={tileClassName}
                                        tileContent={tileContent}
                                        className="mx-auto"
                                        aria-label="Booking Dates"
                                    />
                                    {/* Tooltip for booked dates */}
                                    <Tooltip id="booked-date-tooltip" />
                                </div>

                                {/* Total Price Display */}
                                {totalPrice > 0 && (
                                    <div className="text-gray-800 font-medium">
                                        Total Price for{' '}
                                        {differenceInDays(bookingDateRange[1], bookingDateRange[0])} night(s): $
                                        {totalPrice.toFixed(2)}
                                    </div>
                                )}

                                {/* Number of Guests Input */}
                                <div>
                                    <label htmlFor="guests" className="block text-gray-700 font-medium">
                                        Number of Guests
                                    </label>
                                    <input
                                        type="number"
                                        id="guests"
                                        name="guests"
                                        aria-label="Number of Guests"
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value))}
                                        min="1"
                                        max={maxGuests}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200"
                                        aria-label="Book Now"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VenueDetails;