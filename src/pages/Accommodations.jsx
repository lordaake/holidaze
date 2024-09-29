// src/pages/Accommodations.jsx

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getAllVenues, searchVenues } from '../services/apiService';
import VenueCard from '../components/VenueCard';
import debounce from 'lodash.debounce';
import { FaArrowLeft } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterVenues from '../components/FilterVenues';

/**
 * Accommodations component fetches and displays various categories of venues.
 * It includes search functionality with debouncing, pagination, and categorized sections.
 */
function Accommodations() {
    // **State Variables**

    // All fetched venues from the API
    const [allVenues, setAllVenues] = useState([]);

    // Venues filtered by the filter component
    const [filteredVenues, setFilteredVenues] = useState([]);

    // State to track if filtering is active
    const [isFiltering, setIsFiltering] = useState(false);

    // Venues with top ratings
    const [topVenues, setTopVenues] = useState([]);

    // Venues located in Norway
    const [exploreVenues, setExploreVenues] = useState([]);

    // Trending venues based on popularity or other criteria
    const [trendingVenues, setTrendingVenues] = useState([]);

    // Current search query input by the user
    const [searchQuery, setSearchQuery] = useState('');

    // Combined search results from both server and client-side searches
    const [searchResults, setSearchResults] = useState([]);

    // Indicates if a search operation is in progress
    const [isSearching, setIsSearching] = useState(false);

    // Indicates if the initial data fetching is in progress
    const [loading, setLoading] = useState(true);

    // Indicates if a search operation is loading
    const [searchLoading, setSearchLoading] = useState(false);

    // Holds any error messages
    const [error, setError] = useState(null);

    // **Pagination State**

    // Current page number for the "All Accommodations" or "Filtered Results" section
    const [currentPageAll, setCurrentPageAll] = useState(1);

    // Number of venues to display per page
    const venuesPerPage = 8;

    // **Reference to All Accommodations Section**

    // Reference to the "All Accommodations" section for scrolling
    const allAccommodationsRef = useRef(null);

    /**
     * Fetches all venues from the API on component mount.
     * Filters and categorizes venues into top, explore, and trending sections.
     */
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                // Fetch all venues from the API
                const venuesData = await getAllVenues();
                setAllVenues(venuesData);

                // **Filter Venues for Categories:** Ensure venues have valid media and location
                const filtered = venuesData.filter((venue) => {
                    const hasValidMedia =
                        venue.media?.some(
                            (media) =>
                                media.url &&
                                media.url.trim() !== '' &&
                                media.url !== '/src/assets/images/placeholder-hotel.png'
                        ) || false;
                    const hasValidLocation =
                        venue.location &&
                        venue.location.address &&
                        venue.location.city &&
                        venue.location.country;
                    return hasValidMedia && hasValidLocation;
                });

                // **Filter Venues with 5-Star Rating**
                const fiveStarVenues = filtered.filter((venue) => venue.rating === 5);

                /**
                 * Shuffles an array using the Fisher-Yates algorithm.
                 * @param {Array} array - The array to shuffle.
                 * @returns {Array} - The shuffled array.
                 */
                function shuffleArray(array) {
                    const arr = [...array];
                    for (let i = arr.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [arr[i], arr[j]] = [arr[j], arr[i]];
                    }
                    return arr;
                }

                // **Shuffle the Five-Star Venues**
                const shuffledFiveStarVenues = shuffleArray(fiveStarVenues);

                // **Select Top Venues**
                let top = [];

                if (shuffledFiveStarVenues.length >= 3) {
                    // If there are 3 or more five-star venues, select the first three
                    top = shuffledFiveStarVenues.slice(0, 3);
                } else {
                    // If less than 3 five-star venues, take them all
                    top = shuffledFiveStarVenues;

                    // Fill the rest with other high-rated venues
                    const remainingVenuesForTop = filtered.filter(
                        (venue) => !top.includes(venue) && venue.rating >= 4
                    );
                    const shuffledRemainingVenuesForTop = shuffleArray(remainingVenuesForTop);
                    const needed = 3 - top.length;
                    top = top.concat(shuffledRemainingVenuesForTop.slice(0, needed));
                }

                // **Explore Norway Venues**
                const explore = filtered
                    .filter(
                        (venue) =>
                            venue.location.country.toLowerCase() === 'norway' && !top.includes(venue)
                    )
                    .slice(0, 4);

                // **Trending Venues**
                const remainingVenues = filtered.filter(
                    (venue) => !top.includes(venue) && !explore.includes(venue)
                );
                const shuffledRemainingVenues = shuffleArray(remainingVenues);
                const trending = shuffledRemainingVenues.slice(0, 3);

                // **Update State for Categories**
                setTopVenues(top);
                setExploreVenues(explore);
                setTrendingVenues(trending);
            } catch (error) {
                // Handle errors during data fetching
                toast.error('Failed to fetch venues. Please try again later.');
                setError('Failed to fetch venues. Please try again later.');
            } finally {
                // End loading state
                setLoading(false);
            }
        };

        // Initiate data fetch
        fetchVenues();
    }, []);

    /**
     * Handles filter changes from the FilterVenues component.
     * Applies filters to the existing venues without refetching.
     */
    const handleFilterChange = (filters) => {
        // Apply filtering logic on the fetched venues
        const filtered = allVenues.filter((venue) => {
            // Handle missing data gracefully
            const venueMeta = venue.meta || {};
            const venueLocation = venue.location || {};
            const venueRating = venue.rating !== undefined ? venue.rating : 0;
            const venuePrice = venue.price !== undefined ? venue.price : 0;
            const venueMaxGuests = venue.maxGuests !== undefined ? venue.maxGuests : 0;

            // **Amenities Filter**
            const matchesAmenities = ['wifi', 'parking', 'breakfast', 'pets'].every(
                (amenity) => !filters[amenity] || venueMeta[amenity]
            );

            // **Price Filter**
            const matchesPrice =
                (!filters.minPrice || venuePrice >= filters.minPrice) &&
                (!filters.maxPrice || venuePrice <= filters.maxPrice);

            // **Guests Filter**
            const matchesGuests =
                (!filters.minGuests || venueMaxGuests >= filters.minGuests) &&
                (!filters.maxGuests || venueMaxGuests <= filters.maxGuests);

            // **Location Filter**
            const matchesLocation =
                (!filters.city ||
                    (venueLocation.city &&
                        venueLocation.city.toLowerCase().includes(filters.city.toLowerCase()))) &&
                (!filters.country ||
                    (venueLocation.country &&
                        venueLocation.country.toLowerCase().includes(filters.country.toLowerCase())));

            // **Rating Filter**
            const matchesRating = !filters.rating || (() => {
                if (filters.rating === 5) {
                    return venueRating === 5;
                } else if (filters.rating === 1) {
                    return venueRating >= 0 && venueRating < 2;
                } else {
                    return venueRating >= filters.rating && venueRating < filters.rating + 1;
                }
            })();

            // Only return venues that match all the filters
            return (
                matchesAmenities &&
                matchesPrice &&
                matchesGuests &&
                matchesLocation &&
                matchesRating
            );
        });

        // Update state with filtered venues
        setFilteredVenues(filtered);
        setIsFiltering(true);
        setCurrentPageAll(1); // Reset to first page when filters change
    };

    /**
     * Resets the filter state to show all accommodations.
     */
    const resetFilter = () => {
        setFilteredVenues([]);
        setIsFiltering(false);
        setCurrentPageAll(1);
    };

    /**
     * Debounced search function to handle user input with a delay.
     */
    const debouncedSearch = useMemo(
        () =>
            debounce(async (query) => {
                if (query.trim() === '') {
                    setIsSearching(false);
                    setSearchResults([]);
                    setError(null);
                    setSearchLoading(false);
                    setCurrentPageAll(1);
                    return;
                }

                setIsSearching(true);
                setSearchLoading(true);
                setError(null);
                setCurrentPageAll(1);

                try {
                    // **Server-Side Search: Name and Description**
                    const serverResults = await searchVenues(query);

                    // **Client-Side Search: Location City and Country**
                    const lowerCaseQuery = query.toLowerCase();
                    const clientResults = allVenues.filter(
                        (venue) =>
                            (venue.location &&
                                venue.location.city &&
                                venue.location.city.toLowerCase().includes(lowerCaseQuery)) ||
                            (venue.location &&
                                venue.location.country &&
                                venue.location.country.toLowerCase().includes(lowerCaseQuery))
                    );

                    // **Combine Server and Client Search Results**
                    const combined = [
                        ...serverResults,
                        ...clientResults.filter(
                            (clientVenue) =>
                                !serverResults.some((serverVenue) => serverVenue.id === clientVenue.id)
                        ),
                    ];

                    setSearchResults(combined);
                } catch (error) {
                    toast.error('Failed to search venues. Please try again later.');
                    setError('Failed to search venues. Please try again later.');
                    setSearchResults([]);
                } finally {
                    setSearchLoading(false);
                }
            }, 500),
        [allVenues]
    );

    /**
     * Handles changes in the search input field.
     */
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    /**
     * Cleanup function to cancel the debounced search when the component unmounts.
     */
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    /**
     * Resets the search state to show all accommodations.
     */
    const resetSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
        setError(null);
        setCurrentPageAll(1); // Reset to first page
    };

    /**
     * Calculates the venues to display on the current page.
     */
    const getCurrentVenuesAll = () => {
        const venuesToDisplay = isFiltering ? filteredVenues : allVenues;

        const indexOfLastVenue = currentPageAll * venuesPerPage;
        const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;

        return venuesToDisplay.slice(indexOfFirstVenue, indexOfLastVenue);
    };

    const totalPagesAll = Math.ceil(
        (isFiltering ? filteredVenues.length : allVenues.length) / venuesPerPage
    );

    /**
     * Handles page changes for pagination.
     */
    const handlePageChangeAll = (newPage) => {
        if (newPage < 1 || newPage > totalPagesAll) return; // Prevent invalid page numbers
        setCurrentPageAll(newPage);
        if (allAccommodationsRef.current) {
            // Scroll to the top of the section smoothly
            allAccommodationsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // **Conditional Rendering for Loading State**
    if (loading) {
        return (
            <div className="container mx-auto py-16 px-4">
                <p className="text-center text-gray-500">Loading accommodations...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-4">
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

            {/* **Search Bar** */}
            <div className="mb-6 flex justify-center relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by name, city, or country"
                    className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isSearching && (
                    <button
                        onClick={resetSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 font-semibold flex items-center px-3 py-1 rounded-full"
                        aria-label="Reset Search"
                    >
                        <FaArrowLeft className="mr-1" /> Back
                    </button>
                )}
            </div>

            {/* **Filter Component** */}
            {!isSearching && (
                <div className="mb-12 flex flex-col sm:flex-row justify-between sm:justify-center items-center space-y-4 sm:space-y-0 relative sm:space-x-4 sm:items-start">
                    {/* Filter Input Section */}
                    <div className="w-full sm:w-auto">
                        <FilterVenues onFilterChange={handleFilterChange} />
                    </div>

                    {/* Reset Filter Button */}
                    {isFiltering && (
                        <div className="w-full sm:w-auto">
                            <button
                                onClick={resetFilter}
                                className="w-full sm:w-auto bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 font-semibold flex items-center justify-center px-4 py-2 rounded-lg"
                                aria-label="Reset Filter"
                            >
                                <FaArrowLeft className="mr-1" /> Back
                            </button>
                        </div>
                    )}
                </div>
            )}


            {/* **Error Message** */}
            {error && <div className="mb-8 text-center text-red-500">{error}</div>}

            {/* **Conditional Rendering Based on Search and Filter State** */}
            {isSearching ? (
                <section className="mb-16">
                    {/* Search Results Title */}
                    <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
                        {searchLoading ? 'Searching...' : `Search Results for "${searchQuery}"`}
                    </h2>
                    {/* Loading Indicator for Search */}
                    {searchLoading ? (
                        <p className="text-center text-gray-500">Loading search results...</p>
                    ) : searchResults.length > 0 ? (
                        // **Search Results Grid**
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {searchResults.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                    ) : (
                        // Message when no search results are found
                        <p className="text-center text-gray-700 text-lg">
                            No venues match your search.
                        </p>
                    )}
                </section>
            ) : (
                <>
                    {/* **Top Rated Accommodations Section** */}
                    {!isFiltering && topVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Top Rated Accommodations
                            </h2>
                            {/* Top Venues Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {topVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} topRated />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* **Explore Norway Section** */}
                    {!isFiltering && exploreVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Explore Norway
                            </h2>
                            {/* Explore Norway Venues Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {exploreVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* **Trending Destinations Section** */}
                    {!isFiltering && trendingVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Trending Destinations
                            </h2>
                            {/* Trending Venues Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {trendingVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* **Filtered Results or All Accommodations Section** */}
                    <section ref={allAccommodationsRef}>
                        <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                            {isFiltering ? 'Filtered Results' : 'All Accommodations'}
                        </h2>
                        {getCurrentVenuesAll().length > 0 ? (
                            <>
                                {/* Venues Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {getCurrentVenuesAll().map((venue) => (
                                        <VenueCard key={venue.id} venue={venue} />
                                    ))}
                                </div>

                                {/* **Pagination Controls** */}
                                <Pagination
                                    currentPage={currentPageAll}
                                    totalPages={totalPagesAll}
                                    onPageChange={handlePageChangeAll}
                                />
                            </>
                        ) : (
                            // Message when no results are found
                            <p className="text-center text-gray-700 text-lg">
                                No venues match your {isFiltering ? 'filters' : 'search'}.
                            </p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default Accommodations;