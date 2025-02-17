// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVenues } from '../services/apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * HomePage component that displays a hero section, featured venues, and a call-to-action.
 * It fetches a list of venues from the API and randomly selects three to display as featured venues.
 */
function HomePage() {
    // State to store featured venues and loading status.
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch venues on mount.
    useEffect(() => {
        async function fetchData() {
            try {
                const venues = await getAllVenues();
                const venuesWithImages = venues.filter(
                    (venue) => venue.media && venue.media.length > 0
                );

                // Randomly select 3 venues.
                const selectedFeatured = [];
                while (selectedFeatured.length < 3 && venuesWithImages.length > 0) {
                    const randomIndex = Math.floor(Math.random() * venuesWithImages.length);
                    selectedFeatured.push(venuesWithImages.splice(randomIndex, 1)[0]);
                }
                setFeatured(selectedFeatured);
            } catch (error) {
                toast.error('Failed to fetch featured accommodations. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Loading spinner with "Loading" label.
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="mb-4 text-2xl font-semibold text-blue-700">Loading</div>
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="homepage bg-gray-50">
            {/* ToastContainer for notifications */}
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

            {/* Hero Section */}
            <section
                className="hero relative bg-cover bg-center h-screen flex items-center justify-center text-center"
                style={{ backgroundImage: "url('/images/peackcock_hotel.jpg')" }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-4">
                        Welcome to Holidaze
                    </h1>
                    <p className="text-xl md:text-3xl text-white mb-8">
                        Your perfect stay awaits you
                    </p>
                    <Link
                        to="/accommodations"
                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 px-8 py-4 rounded-full text-xl font-bold transition duration-300 shadow-lg"
                    >
                        Explore Accommodations
                    </Link>
                </div>
            </section>

            {/* Featured Accommodations Section */}
            <section className="featured py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-blue-900 mb-12 text-center">
                        Featured Accommodations
                    </h2>
                    <div className="flex justify-center overflow-x-auto space-x-8 pb-4">
                        {featured.length > 0 ? (
                            featured.map((venue, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-2xl p-6 w-80 flex-shrink-0 transform hover:scale-105 transition-transform duration-300"
                                >
                                    <Link to={`/venues/${venue.id}`}>
                                        {venue.media && venue.media.length > 0 ? (
                                            <img
                                                src={venue.media[0].url}
                                                alt={venue.name}
                                                className="rounded-xl mb-4 w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        'https://via.placeholder.com/400x300?text=No+Image+Available';
                                                    e.target.onerror = null;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                                No Image Available
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-semibold text-blue-900 mb-2">
                                            {venue.name}
                                        </h3>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700">
                                No featured accommodations available.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="cta py-16 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl font-extrabold text-blue-900 mb-6">
                        Become a Host or Find Your Next Getaway!
                    </h2>
                    <p className="text-2xl text-blue-800 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Whether you're looking to create unforgettable experiences for guests or planning your next adventure,
                        we've got you covered. Join Holidaze today!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link
                            to="/register"
                            className="inline-block bg-blue-900 hover:bg-blue-800 text-yellow-300 px-8 py-4 rounded-full text-xl font-bold shadow-xl transform hover:scale-105 transition duration-300"
                        >
                            Join as a Host
                        </Link>
                        <Link
                            to="/accommodations"
                            className="inline-block bg-blue-900 hover:bg-blue-800 text-yellow-300 px-8 py-4 rounded-full text-xl font-bold shadow-xl transform hover:scale-105 transition duration-300"
                        >
                            Find Your Stay
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
