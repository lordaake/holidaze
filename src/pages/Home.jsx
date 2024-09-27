import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllVenues } from '../services/apiService';


function HomePage() {
    const [featured, setFeatured] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch venues without any parameters
                const venues = await getAllVenues();

                // Filter venues that have at least one image in the media array
                const venuesWithImages = venues.filter(venue => venue.media && venue.media.length > 0);

                // Randomly select 3 featured venues with images
                const selectedFeatured = [];
                while (selectedFeatured.length < 3 && venuesWithImages.length > 0) {
                    const randomIndex = Math.floor(Math.random() * venuesWithImages.length);
                    selectedFeatured.push(venuesWithImages.splice(randomIndex, 1)[0]);
                }

                setFeatured(selectedFeatured);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }

        fetchData();
    }, []);


    return (
        <div className="homepage bg-gray-100">
            {/* Hero Section */}
            <section
                className="hero bg-cover bg-center h-screen flex items-center justify-center text-center relative"
                style={{ backgroundImage: "url('/images/peackcock_hotel.webp')" }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white">Welcome to Holidaze</h1>
                    <p className="text-lg md:text-2xl mb-8 text-white">Your perfect stay awaits</p>
                    <Link to="/accommodations" className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-yellow-300 transition duration-300">
                        Explore Accommodations
                    </Link>
                </div>
            </section>

            {/* Featured Section */}
            <section className="featured py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">Featured Accommodations</h2>
                    <div className="flex justify-center overflow-x-auto space-x-8">
                        {featured.length > 0 ? (
                            featured.map((venue, index) => (
                                <div key={index} className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-80 flex-shrink-0">
                                    <Link to={`/venues/${venue.id}`}>
                                        {venue.media && venue.media.length > 0 ? (
                                            <img
                                                src={venue.media[0].url} // Correctly access the URL property
                                                alt={venue.name}
                                                className="rounded-lg mb-4 w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available'; // Fallback image if original fails
                                                    e.target.onerror = null; // Prevent infinite loop
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                                No Image Available
                                            </div>
                                        )}
                                        <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-2">{venue.name}</h3>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No featured accommodations available.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="cta py-16 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6">
                        Become a Host or Find Your Next Getaway!
                    </h2>
                    <p className="text-lg md:text-2xl text-blue-800 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Whether you're looking to create unforgettable experiences for guests or planning your next adventure, we've got you covered. Join Holidaze today!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-block bg-blue-900 text-yellow-300 px-8 py-4 rounded-full text-xl font-bold shadow-lg transform hover:scale-105 hover:bg-blue-800 transition duration-300"
                        >
                            Join as a Host
                        </Link>
                        <Link
                            to="/accommodations"
                            className="inline-block bg-blue-900 text-yellow-300 px-8 py-4 rounded-full text-xl font-bold shadow-lg transform hover:scale-105 hover:bg-blue-800 transition duration-300"
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
