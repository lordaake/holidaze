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

function VenueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const placeholderImage = 'https://via.placeholder.com/400x300?text=No+Image+Available';

    // Booking-related states
    const [bookedDates, setBookedDates] = useState([]);
    const [bookingDateRange, setBookingDateRange] = useState(null);
    const [guests, setGuests] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [maxGuests, setMaxGuests] = useState(1);

    // Move fetchVenueData function outside of useEffect
    const fetchVenueData = async () => {
        try {
            const venueData = await getVenueById(id, true, true); // Pass true to include bookings and reviews
            // console.log('Fetched Venue Data:', venueData);
            setVenue(venueData.data);

            // Extract booked dates from bookings
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

            // Set maxGuests
            setMaxGuests(venueData.data.maxGuests || 1);
        } catch (error) {
            console.error(`Failed to fetch data for venue with ID ${id}:`, error);
            setError('Failed to load venue data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        fetchVenueData();
    }, [id]);

    // Function to check if a date is booked
    const isDateBooked = (date) => {
        return bookedDates.some(
            (bookedDate) =>
                bookedDate.getFullYear() === date.getFullYear() &&
                bookedDate.getMonth() === date.getMonth() &&
                bookedDate.getDate() === date.getDate()
        );
    };

    // Disable booked dates in the calendar
    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            return isDateBooked(date);
        }
    };

    // Function to assign a class to booked dates
    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return 'booked-date';
        }
        return null;
    };

    // Function to add content to the tile (for tooltips)
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

    // Update total price when date range changes
    useEffect(() => {
        if (bookingDateRange && bookingDateRange.length === 2) {
            const [startDate, endDate] = bookingDateRange;
            const nights = differenceInDays(endDate, startDate);
            setTotalPrice(nights * venue.price);
        } else {
            setTotalPrice(0);
        }
    }, [bookingDateRange, venue?.price]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        if (!bookingDateRange || bookingDateRange.length !== 2) {
            toast.error('Please select check-in and check-out dates.');
            return;
        }

        const [checkInDate, checkOutDate] = bookingDateRange;

        if (checkOutDate <= checkInDate) {
            toast.error('Check-out date must be after check-in date.');
            return;
        }

        if (guests < 1 || guests > maxGuests) {
            toast.error(`Number of guests must be between 1 and ${maxGuests}.`);
            return;
        }

        const bookingData = {
            dateFrom: checkInDate.toISOString(),
            dateTo: checkOutDate.toISOString(),
            guests: guests,
            venueId: id,
        };

        try {
            const response = await createBooking(bookingData);
            // console.log('Booking successful:', response);
            toast.success('Your booking was successful!');
            // Refresh the venue data to update booked dates
            await fetchVenueData();
        } catch (error) {
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
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ClipLoader size={50} color="#123abc" loading={loading} />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 text-lg">{error}</p>;
    }

    if (!venue) {
        return <p className="text-center text-red-500 text-lg">Venue not found.</p>;
    }

    // Function to render star ratings
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-yellow-500" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-500" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-500" />);
        }
        return stars;
    };

    return (
        <>
            <ToastContainer />
            <div className="bg-gray-100 py-12">
                <div className="container mx-auto px-4 lg:px-8">
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
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                            {venue.description}
                        </p>

                        {/* Meta features */}
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

                        {/* Location */}
                        <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">Location</h3>
                        <div className="flex items-center text-gray-700 text-base md:text-lg mb-6">
                            <FaMapMarkerAlt className="text-red-600 mr-2 text-xl" aria-hidden="true" />
                            <p>
                                {venue?.location?.address || 'Address not provided'},{' '}
                                {venue?.location?.city || 'City not provided'},{' '}
                                {venue?.location?.country || 'Country not provided'}
                            </p>
                        </div>

                        {/* Reviews */}
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
                                    <Tooltip id="booked-date-tooltip" />
                                </div>
                                {totalPrice > 0 && (
                                    <div className="text-gray-800 font-medium">
                                        Total Price for{' '}
                                        {differenceInDays(bookingDateRange[1], bookingDateRange[0])} night(s): $
                                        {totalPrice.toFixed(2)}
                                    </div>
                                )}
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
