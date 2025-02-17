// src/pages/Accommodations.jsx

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { getAllVenues, searchVenues } from '../services/apiService';
import VenueCard from '../components/VenueCard';
import debounce from 'lodash.debounce';
import { FaArrowLeft } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FilterVenues from '../components/FilterVenues';

/**
 * Utility function to shuffle an array using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

function Accommodations() {
    // -------------------- State Variables --------------------
    const [allVenues, setAllVenues] = useState([]);
    const [filteredVenues, setFilteredVenues] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [topVenues, setTopVenues] = useState([]);
    const [exploreVenues, setExploreVenues] = useState([]);
    const [trendingVenues, setTrendingVenues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPageAll, setCurrentPageAll] = useState(1);
    const venuesPerPage = 8;
    const allAccommodationsRef = useRef(null);

    // -------------------- Data Fetching & Categorization --------------------
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const venuesData = await getAllVenues();
                setAllVenues(venuesData);

                // Only use venues with valid media and location data
                const validVenues = venuesData.filter((venue) => {
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

                // Top venues: Prefer 5-star venues, but fill in with 4-star if needed.
                const fiveStarVenues = validVenues.filter((venue) => venue.rating === 5);
                const shuffledFiveStars = shuffleArray(fiveStarVenues);
                let top = shuffledFiveStars.slice(0, 3);
                if (top.length < 3) {
                    const additionalVenues = validVenues.filter(
                        (venue) => !top.includes(venue) && venue.rating >= 4
                    );
                    top = top.concat(shuffleArray(additionalVenues).slice(0, 3 - top.length));
                }

                // Explore Norway venues (exclude those already in top)
                const explore = validVenues
                    .filter(
                        (venue) =>
                            venue.location.country.toLowerCase() === 'norway' && !top.includes(venue)
                    )
                    .slice(0, 4);

                // Trending venues: Random selection from remaining venues.
                const remainingVenues = validVenues.filter(
                    (venue) => !top.includes(venue) && !explore.includes(venue)
                );
                const trending = shuffleArray(remainingVenues).slice(0, 3);

                setTopVenues(top);
                setExploreVenues(explore);
                setTrendingVenues(trending);
            } catch (err) {
                toast.error('Failed to fetch venues. Please try again later.');
                setError('Failed to fetch venues. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    // -------------------- Filtering --------------------
    const handleFilterChange = useCallback(
        (filters) => {
            const filtered = allVenues.filter((venue) => {
                const venueMeta = venue.meta || {};
                const venueLocation = venue.location || {};
                const venueRating = venue.rating ?? 0;
                const venuePrice = venue.price ?? 0;
                const venueMaxGuests = venue.maxGuests ?? 0;

                const matchesAmenities = ['wifi', 'parking', 'breakfast', 'pets'].every(
                    (amenity) => !filters[amenity] || venueMeta[amenity]
                );
                const matchesPrice =
                    (!filters.minPrice || venuePrice >= filters.minPrice) &&
                    (!filters.maxPrice || venuePrice <= filters.maxPrice);
                const matchesGuests =
                    (!filters.minGuests || venueMaxGuests >= filters.minGuests) &&
                    (!filters.maxGuests || venueMaxGuests <= filters.maxGuests);
                const matchesLocation =
                    (!filters.city ||
                        (venueLocation.city &&
                            venueLocation.city.toLowerCase().includes(filters.city.toLowerCase()))) &&
                    (!filters.country ||
                        (venueLocation.country &&
                            venueLocation.country.toLowerCase().includes(filters.country.toLowerCase())));
                const matchesRating =
                    !filters.rating ||
                    (filters.rating === 5
                        ? venueRating === 5
                        : venueRating >= filters.rating && venueRating < filters.rating + 1);

                return matchesAmenities && matchesPrice && matchesGuests && matchesLocation && matchesRating;
            });
            setFilteredVenues(filtered);
            setIsFiltering(true);
            setCurrentPageAll(1);
        },
        [allVenues]
    );

    const resetFilter = () => {
        setFilteredVenues([]);
        setIsFiltering(false);
        setCurrentPageAll(1);
    };

    // -------------------- Search --------------------
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
                    const serverResults = await searchVenues(query);
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
                    const combined = [
                        ...serverResults,
                        ...clientResults.filter(
                            (clientVenue) =>
                                !serverResults.some((serverVenue) => serverVenue.id === clientVenue.id)
                        ),
                    ];
                    setSearchResults(combined);
                } catch (err) {
                    toast.error('Failed to search venues. Please try again later.');
                    setError('Failed to search venues. Please try again later.');
                    setSearchResults([]);
                } finally {
                    setSearchLoading(false);
                }
            }, 500),
        [allVenues]
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    const resetSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setSearchResults([]);
        setError(null);
        setCurrentPageAll(1);
    };

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // -------------------- Pagination Helpers --------------------
    const getCurrentVenuesAll = () => {
        const venuesToDisplay = isFiltering ? filteredVenues : allVenues;
        const indexOfLastVenue = currentPageAll * venuesPerPage;
        const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
        return venuesToDisplay.slice(indexOfFirstVenue, indexOfLastVenue);
    };

    const totalPagesAll = Math.ceil(
        (isFiltering ? filteredVenues.length : allVenues.length) / venuesPerPage
    );

    const handlePageChangeAll = (newPage) => {
        if (newPage < 1 || newPage > totalPagesAll) return;
        setCurrentPageAll(newPage);
        if (allAccommodationsRef.current) {
            allAccommodationsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // -------------------- Render --------------------
    if (loading) {
        return (
            <div className="container mx-auto py-16 px-4">
                <p className="text-center text-gray-500">Loading accommodations...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
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

            {/* Search Bar */}
            <div className="mb-6 flex justify-center relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by name, city, or country"
                    className="w-full max-w-lg p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Filter Section */}
            {!isSearching && (
                <div className="mb-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="w-full sm:w-auto">
                        <FilterVenues onFilterChange={handleFilterChange} />
                    </div>
                    {isFiltering && (
                        <button
                            onClick={resetFilter}
                            className="w-full sm:w-auto bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 font-semibold flex items-center justify-center px-4 py-2 rounded-lg"
                            aria-label="Reset Filter"
                        >
                            <FaArrowLeft className="mr-1" /> Back
                        </button>
                    )}
                </div>
            )}

            {error && <div className="mb-8 text-center text-red-500">{error}</div>}

            {/* Search Results */}
            {isSearching ? (
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
                        {searchLoading ? 'Searching...' : `Search Results for "${searchQuery}"`}
                    </h2>
                    {searchLoading ? (
                        <p className="text-center text-gray-500">Loading search results...</p>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {searchResults.map((venue) => (
                                <VenueCard key={venue.id} venue={venue} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-700 text-lg">
                            No venues match your search.
                        </p>
                    )}
                </section>
            ) : (
                <>
                    {/* Top Rated Accommodations */}
                    {!isFiltering && topVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Top Rated Accommodations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {topVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} topRated />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Explore Norway */}
                    {!isFiltering && exploreVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Explore Norway
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {exploreVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Trending Destinations */}
                    {!isFiltering && trendingVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Trending Destinations
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {trendingVenues.map((venue) => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* All Accommodations / Filtered Results */}
                    <section ref={allAccommodationsRef}>
                        <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                            {isFiltering ? 'Filtered Results' : 'All Accommodations'}
                        </h2>
                        {getCurrentVenuesAll().length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {getCurrentVenuesAll().map((venue) => (
                                        <VenueCard key={venue.id} venue={venue} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPageAll}
                                    totalPages={totalPagesAll}
                                    onPageChange={handlePageChangeAll}
                                />
                            </>
                        ) : (
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
