// src/pages/Accommodations.jsx

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getAllVenues, searchVenues } from '../services/apiService';
import VenueCard from '../components/VenueCard';
import debounce from 'lodash.debounce';
import { FaArrowLeft } from 'react-icons/fa';
import Pagination from '../components/Pagination';

function Accommodations() {
    // **State Variables**
    const [allVenues, setAllVenues] = useState([]); // All fetched venues
    const [filteredVenues, setFilteredVenues] = useState([]); // Venues with valid media and location
    const [topVenues, setTopVenues] = useState([]);
    const [exploreVenues, setExploreVenues] = useState([]);
    const [trendingVenues, setTrendingVenues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [serverSearchResults, setServerSearchResults] = useState([]);
    const [clientSearchResults, setClientSearchResults] = useState([]);
    const [combinedSearchResults, setCombinedSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState(null);

    // **Pagination State for All Accommodations**
    const [currentPageAll, setCurrentPageAll] = useState(1);
    const venuesPerPage = 8; // Updated from 10 to 8

    const placeholderImage = '/src/assets/images/placeholder-hotel.png';

    // **Reference to All Accommodations Section**
    const allAccommodationsRef = useRef(null);

    // **Fetch All Venues on Component Mount**
    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const venuesData = await getAllVenues();
                // console.log('Venues Data:', venuesData);

                // **Set All Venues**
                setAllVenues(venuesData);

                // **Filter Venues for Categories:** Ensure venues have valid media and location
                const filtered = venuesData.filter(venue => {
                    const hasValidMedia =
                        venue.media?.some(
                            media =>
                                media.url &&
                                media.url.trim() !== '' &&
                                media.url !== placeholderImage
                        ) || false;
                    const hasValidLocation =
                        venue.location &&
                        venue.location.address &&
                        venue.location.city &&
                        venue.location.country;
                    return hasValidMedia && hasValidLocation;
                });
                // console.log('Filtered Venues:', filtered);
                setFilteredVenues(filtered);

                // **Sort Filtered Venues:** Descending order based on rating
                const sortedVenues = [...filtered].sort(
                    (a, b) => b.rating - a.rating
                );
                // console.log('Sorted Venues:', sortedVenues);

                // **Categorize Venues Without Overlap**
                const top = sortedVenues.slice(0, 3);
                const explore = sortedVenues.filter(
                    venue =>
                        venue.location.country.toLowerCase() === 'norway'
                ).slice(0, 4);
                const trending = sortedVenues.filter(
                    venue => !top.includes(venue) && !explore.includes(venue)
                ).slice(0, 3);

                // console.log('Top Venues:', top);
                // console.log('Explore Venues:', explore);
                // console.log('Trending Venues:', trending);

                // **Update State for Categories**
                setTopVenues(top);
                setExploreVenues(explore);
                setTrendingVenues(trending);
            } catch (error) {
                console.error('Failed to fetch venues:', error);
                setError('Failed to fetch venues. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    // **Handle Search Input with Debounce**
    const debouncedSearch = useMemo(
        () =>
            debounce(async (query) => {
                if (query.trim() === '') {
                    // If search query is empty, reset search
                    setIsSearching(false);
                    setServerSearchResults([]);
                    setClientSearchResults([]);
                    setCombinedSearchResults([]);
                    setError(null);
                    setSearchLoading(false);
                    setCurrentPageAll(1); // Reset All Accommodations to first page
                    return;
                }

                setIsSearching(true);
                setSearchLoading(true);
                setError(null);
                setCurrentPageAll(1); // Reset All Accommodations to first page

                try {
                    // **Server-Side Search: Name and Description**
                    const serverResults = await searchVenues(query);
                    // console.log('Server Search Results:', serverResults);

                    // **Client-Side Search: Location City**
                    const lowerCaseQuery = query.toLowerCase();
                    const clientResults = allVenues.filter(venue =>
                    (venue.location.city &&
                        venue.location.city.toLowerCase().includes(lowerCaseQuery))
                    );
                    // console.log('Client Search Results:', clientResults);

                    const combined = [
                        ...serverResults,
                        ...clientResults.filter(
                            clientVenue => !serverResults.some(serverVenue => serverVenue.id === clientVenue.id)
                        ),
                    ];
                    // console.log('Combined Search Results:', combined);

                    setServerSearchResults(serverResults);
                    setClientSearchResults(clientResults);
                    setCombinedSearchResults(combined);
                } catch (error) {
                    console.error('Failed to search venues:', error);
                    setError('Failed to search venues. Please try again later.');
                    setCombinedSearchResults([]);
                } finally {
                    setSearchLoading(false);
                }
            }, 500), // 500ms debounce delay
        [allVenues]
    );

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // **Cleanup Debounce on Unmount**
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // **Function to Reset Search**
    const resetSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        setServerSearchResults([]);
        setClientSearchResults([]);
        setCombinedSearchResults([]);
        setError(null);
        setCurrentPageAll(1); // Reset All Accommodations to first page
    };

    // **Calculate Current Venues for All Accommodations Based on Pagination**
    const indexOfLastVenueAll = currentPageAll * venuesPerPage;
    const indexOfFirstVenueAll = indexOfLastVenueAll - venuesPerPage;
    const currentVenuesAll = allVenues.slice(indexOfFirstVenueAll, indexOfLastVenueAll);
    const totalPagesAll = Math.ceil(allVenues.length / venuesPerPage);

    // **Handle Page Change for All Accommodations**
    const handlePageChangeAll = (newPage) => {
        if (newPage < 1 || newPage > totalPagesAll) return;
        setCurrentPageAll(newPage);
        if (allAccommodationsRef.current) {
            allAccommodationsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // **Conditional Rendering for Loading State**
    if (loading) {
        return (
            <div className="container mx-auto py-16 px-4">
                <p className="text-center text-gray-500">
                    Loading accommodations...
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-4">
            {/* **Search Bar** */}
            <div className="mb-12 flex justify-center relative">
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

            {/* **Error Message** */}
            {error && (
                <div className="mb-8 text-center text-red-500">
                    {error}
                </div>
            )}

            {/* **Conditional Rendering Based on Search State** */}
            {isSearching ? (
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">
                        {searchLoading
                            ? 'Searching...'
                            : `Search Results for "${searchQuery}"`
                        }
                    </h2>
                    {searchLoading ? (
                        <p className="text-center text-gray-500">Loading search results...</p>
                    ) : combinedSearchResults.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {combinedSearchResults.map(venue => (
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
                    {/* **Top Rated Accommodations Section** */}
                    {topVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Top Rated Accommodations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {topVenues.map(venue => (
                                    <VenueCard key={venue.id} venue={venue} topRated />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* **Explore Norway Section** */}
                    {exploreVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Explore Norway
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {exploreVenues.map(venue => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* **Trending Destinations Section** */}
                    {trendingVenues.length > 0 && (
                        <section className="mb-16">
                            <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                                Trending Destinations
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {trendingVenues.map(venue => (
                                    <VenueCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* **All Accommodations Section** */}
                    <section ref={allAccommodationsRef}>
                        <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">
                            All Accommodations
                        </h2>
                        {allVenues.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {currentVenuesAll.map(venue => (
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
                            <p className="text-center text-gray-700 text-lg">
                                No accommodations available.
                            </p>
                        )}
                    </section>
                </>
            )}
        </div>
    ); // **Closing Parenthesis for return **
} // **Closing Brace for function**

export default Accommodations;
