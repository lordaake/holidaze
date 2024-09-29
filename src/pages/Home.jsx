import React, { useEffect, useState } from 'react'; // Import React hooks for state and side effects
import { Link } from 'react-router-dom'; // Import Link component for navigation
import { getAllVenues } from '../services/apiService'; // Import API function to fetch all venues
import { ToastContainer, toast } from 'react-toastify'; // Import toast for notifications and ToastContainer for rendering
import 'react-toastify/dist/ReactToastify.css'; // Import default styles for react-toastify

/**
 * HomePage component that displays a hero section, featured venues, and a call-to-action.
 * It fetches a list of venues from the API and randomly selects three to display as featured venues.
 */
function HomePage() {
    // State to store the list of featured venues
    const [featured, setFeatured] = useState([]);

    /**
     * useEffect hook to fetch venue data when the component mounts.
     * The empty dependency array ensures this effect runs only once, after the initial render.
     */
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch all venues without passing any specific parameters
                const venues = await getAllVenues();

                // Filter out venues that don't have any images in their media array
                const venuesWithImages = venues.filter(venue => venue.media && venue.media.length > 0);

                // Randomly select 3 venues from the filtered list to display as featured
                const selectedFeatured = [];
                while (selectedFeatured.length < 3 && venuesWithImages.length > 0) {
                    const randomIndex = Math.floor(Math.random() * venuesWithImages.length); // Select a random venue
                    selectedFeatured.push(venuesWithImages.splice(randomIndex, 1)[0]); // Add selected venue and remove it from the array
                }

                // Set the selected featured venues in the state
                setFeatured(selectedFeatured);
            } catch (error) {
                // If there is an error during data fetching, show a toast notification
                toast.error('Failed to fetch featured accommodations. Please try again later.');
            }
        }

        // Call the fetchData function when the component mounts
        fetchData();
    }, []); // Empty dependency array means the effect runs only on component mount

    return (
        <div className="homepage bg-gray-100">
            {/* ToastContainer to render toast notifications */}
            <ToastContainer
                position="top-right" // Position the toast notifications at the top-right corner
                autoClose={3000} // Toasts will automatically close after 3 seconds
                hideProgressBar={false} // Display the progress bar in the toast
                newestOnTop // Show newer toasts on top of older ones
                closeOnClick // Close the toast when clicked
                rtl={false} // Set text direction as left-to-right (not right-to-left)
                pauseOnFocusLoss // Pause toast auto-close when the browser loses focus
                draggable // Allow the user to drag the toast around
                pauseOnHover // Pause the auto-close timer when hovering over the toast
            />

            {/* Hero Section */}
            <section
                className="hero bg-cover bg-center h-screen flex items-center justify-center text-center relative"
                style={{ backgroundImage: "url('/images/peackcock_hotel.jpg')" }} // Background image for the hero section
            >
                <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay to darken the background */}
                <div className="relative z-10 container mx-auto px-6 py-12">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white">Welcome to Holidaze</h1>
                    <p className="text-lg md:text-2xl mb-8 text-white">Your perfect stay awaits</p>
                    <Link
                        to="/accommodations"
                        className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-yellow-300 transition duration-300"
                    >
                        Explore Accommodations
                    </Link> {/* Button to navigate to the accommodations page */}
                </div>
            </section>

            {/* Featured Accommodations Section */}
            <section className="featured py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">Featured Accommodations</h2>

                    {/* Display featured venues if available */}
                    <div className="flex justify-center overflow-x-auto space-x-8">
                        {featured.length > 0 ? ( // If there are featured venues, map through them
                            featured.map((venue, index) => (
                                <div key={index} className="bg-white shadow-lg rounded-lg p-6 md:p-8 w-80 flex-shrink-0">
                                    <Link to={`/venues/${venue.id}`}>
                                        {/* Display the venue's first image, or a placeholder if not available */}
                                        {venue.media && venue.media.length > 0 ? (
                                            <img
                                                src={venue.media[0].url} // First image from the media array
                                                alt={venue.name} // Alt text using the venue's name
                                                className="rounded-lg mb-4 w-full h-48 object-cover" // Image styling
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available'; // Fallback image
                                                    e.target.onerror = null; // Prevent infinite loop in case of fallback error
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                                                No Image Available {/* Placeholder for venues without images */}
                                            </div>
                                        )}
                                        <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-2">{venue.name}</h3>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">No featured accommodations available.</p> // Message if no featured venues
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

                    {/* Buttons for call-to-action */}
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
