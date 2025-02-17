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
    FaTimes,
} from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Tooltip } from 'react-tooltip';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { differenceInDays } from 'date-fns';

/**
 * VenueDetails component displays detailed information about a specific venue,
 * including images, description, amenities, location, reviews, and a booking form.
 */
function VenueDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Placeholder image
    const placeholderImage = 'https://via.placeholder.com/400x300?text=No+Image+Available';

    // Booking states
    const [bookedDates, setBookedDates] = useState([]);
    const [bookingDateRange, setBookingDateRange] = useState(null);
    const [guests, setGuests] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [maxGuests, setMaxGuests] = useState(1);

    // Fetch venue data
    const fetchVenueData = async () => {
        try {
            const venueData = await getVenueById(id, true, true);
            setVenue(venueData.data);

            if (venueData.data.bookings && venueData.data.bookings.length > 0) {
                const dates = [];
                venueData.data.bookings.forEach((booking) => {
                    const startDate = new Date(booking.dateFrom);
                    const endDate = new Date(booking.dateTo);
                    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                        dates.push(new Date(d));
                    }
                });
                setBookedDates(dates);
            } else {
                setBookedDates([]);
            }

            setMaxGuests(venueData.data.maxGuests || 1);
        } catch (err) {
            console.error(`Failed to fetch data for venue with ID ${id}:`, err);
            setError('Failed to load venue data.');
            toast.error('Failed to load venue data. Please try again later.');
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

    // Calendar helpers
    const isDateBooked = (date) => {
        return bookedDates.some(
            (bookedDate) =>
                bookedDate.getFullYear() === date.getFullYear() &&
                bookedDate.getMonth() === date.getMonth() &&
                bookedDate.getDate() === date.getDate()
        );
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            return isDateBooked(date);
        }
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return 'booked-date';
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && isDateBooked(date)) {
            return (
                <div data-tooltip-id="booked-date-tooltip" data-tooltip-content="This date is booked" />
            );
        }
        return null;
    };

    // Calculate total price
    useEffect(() => {
        if (bookingDateRange && bookingDateRange.length === 2) {
            const [startDate, endDate] = bookingDateRange;
            const nights = differenceInDays(endDate, startDate);
            setTotalPrice(nights * (venue?.price || 0));
        } else {
            setTotalPrice(0);
        }
    }, [bookingDateRange, venue?.price]);

    // Booking submission
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
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
            await createBooking(bookingData);
            toast.success('Your booking was successful!');
            await fetchVenueData(); // refresh booked dates
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
                errorMessage = 'No response from the server. Check your network connection.';
            }
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-200">
                <ClipLoader size={50} color="#1f2937" loading={loading} />
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-center text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    // Venue not found
    if (!venue) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-center text-red-500 text-lg">Venue not found.</p>
            </div>
        );
    }

    // Rating stars
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
        }
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
        }
        return stars;
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                toastClassName="!rounded-xl !shadow-lg !bg-white !text-gray-800"
                bodyClassName="!p-4"
            />

            {/* Enhanced Banner Section */}
            <div className="relative h-64 sm:h-96 overflow-hidden group">
                {venue?.media?.length > 0 ? (
                    <div className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105">
                        <img
                            src={venue.media[0].url}
                            alt={venue.media[0].alt || venue.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.src = placeholderImage)}
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/60 via-pink-500/40 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500" />
                )}

                <div className="absolute inset-0 z-10">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white/20 rounded-full animate-float"
                            style={{
                                width: `${Math.random() * 10 + 5}px`,
                                height: `${Math.random() * 10 + 5}px`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-20 h-full flex flex-col justify-end p-6 sm:p-8 text-white">
                    <button
                        onClick={() => navigate('/accommodations')}
                        className="absolute top-6 right-6 p-2 rounded-full backdrop-blur-sm bg-black/30 hover:bg-black/50 transition-all duration-300"
                        aria-label="Close"
                    >
                        <FaTimes className="text-xl" />
                    </button>

                    <div className="space-y-2 animate-slideUp">
                        {venue?.rating > 0 && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
                                <div className="flex text-amber-400">
                                    {renderStars(venue.rating)}
                                </div>
                                <span className="font-medium">{venue.rating.toFixed(1)}</span>
                            </div>
                        )}

                        <h1 className="text-4xl sm:text-6xl font-bold drop-shadow-2xl max-w-2xl">
                            {venue?.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="shrink-0" />
                                <span>
                                    {venue?.location?.city || 'Unknown City'}, {venue?.location?.country || 'Unknown Country'}
                                </span>
                            </div>
                            <span className="opacity-70">•</span>
                            <div className="flex items-center gap-2">
                                <FaUsers className="shrink-0" />
                                <span>Up to {venue?.maxGuests} guests</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Section */}
            <main className="bg-gray-50 py-8">
                <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Image Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {venue?.media?.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-lg group">
                                        <img
                                            src={image.url}
                                            alt={image.alt || `Venue image ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                    </div>
                                ))}
                            </div>

                            {/* Details Sections */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">About this space</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                    {venue?.description}
                                </p>
                            </div>

                            {/* Amenities Section */}
                            {venue?.meta && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {venue.meta.wifi && (
                                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                <FaWifi className="text-blue-500 text-xl" />
                                                <span>WiFi</span>
                                            </div>
                                        )}
                                        {/* Other amenities... */}
                                    </div>
                                </div>
                            )}

                            {/* Reviews Section */}
                            {venue?.reviews?.length > 0 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Guest Reviews</h3>
                                    <div className="space-y-6">
                                        {venue.reviews.map((review, index) => (
                                            <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{review.userName}</span>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Booking Card */}
                        <div className="lg:sticky lg:top-4 h-fit">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-semibold mb-6 text-center">Plan Your Stay</h3>
                                <form onSubmit={handleBookingSubmit} className="space-y-6">
                                    <div>
                                        <Calendar
                                            selectRange
                                            onChange={setBookingDateRange}
                                            value={bookingDateRange}
                                            minDate={new Date()}
                                            tileDisabled={tileDisabled}
                                            tileClassName={tileClassName}
                                            tileContent={tileContent}
                                            className="react-calendar-custom !w-full"
                                        />
                                        <Tooltip id="booked-date-tooltip" />
                                    </div>

                                    <div>
                                        <input
                                            type="number"
                                            value={guests}
                                            onChange={(e) => setGuests(Math.min(maxGuests, Math.max(1, e.target.value)))}
                                            min="1"
                                            max={maxGuests}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total:</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                ${totalPrice || '0'}
                                            </span>
                                        </div>
                                        {bookingDateRange?.length === 2 && (
                                            <p className="text-sm text-gray-500 mt-1 text-center">
                                                {differenceInDays(bookingDateRange[1], bookingDateRange[0])} nights
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        Reserve Now
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default VenueDetails;
