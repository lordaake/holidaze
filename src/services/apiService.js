// src/services/apiService.js

import axios from 'axios';

const API_URL = 'https://v2.api.noroff.dev'; // Base API URL

/**
 * Retrieves authentication headers from localStorage.
 * Throws an error if token or API key is missing.
 */
const getHeaders = () => {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');

    if (!token || !apiKey) {
        throw new Error('Authentication error: Missing token or API key.');
    }

    return {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey
    };
};

/**
 * Monitors and ensures the API key is set in localStorage.
 * If missing, attempts to create and store it.
 */
const monitorApiKey = (accessToken) => {
    const intervalId = setInterval(async () => {
        let apiKey = localStorage.getItem('apiKey');

        if (!apiKey || apiKey === 'undefined') {
            try {
                apiKey = await createApiKey(accessToken);
                localStorage.setItem('apiKey', apiKey);
            } catch (error) {
                // Handle the error appropriately
            }
        } else {
            clearInterval(intervalId);
        }
    }, 1000);
};

/**
 * Logs in a user with given credentials.
 * Stores necessary data in localStorage upon successful login.
 * @param {Object} credentials - User's login credentials.
 * @returns {Object} - Response data from the login API.
 * @throws Will throw an error if the login fails.
 */
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        const { name, email, avatar, banner, accessToken } = response.data.data;

        // Store access token and user profile info in localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('userName', name);
        localStorage.setItem('email', email);
        localStorage.setItem('avatar', JSON.stringify(avatar));
        localStorage.setItem('banner', JSON.stringify(banner));

        // Create and store the API key
        const apiKey = await createApiKey(accessToken);
        localStorage.setItem('apiKey', apiKey);

        // Start monitoring the localStorage for the API key
        monitorApiKey(accessToken);

        // Fetch the user profile to get bio and venueManager status
        const userProfile = await getUserProfile();

        // Store bio and venueManager status
        localStorage.setItem('bio', userProfile.bio || '');
        localStorage.setItem('venueManager', userProfile.venueManager ? 'true' : 'false');

        return response.data;
    } catch (error) {
        // Re-throw the error to be handled by the calling component
        throw extractErrorMessage(error, 'Login failed. Please check your credentials and try again.');
    }
};

/**
 * Creates a new API key using the provided token.
 * @param {string} token - User's access token.
 * @returns {string} - Newly created API key.
 * @throws Will throw an error if API key creation fails.
 */
export const createApiKey = async (token) => {
    try {
        if (!token) throw new Error('Authentication error: No access token found.');

        const response = await axios.post(`${API_URL}/auth/create-api-key`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const apiKey = response.data.data.key;
        return apiKey;
    } catch (error) {
        // Clear localStorage on error to ensure the user re-authenticates
        localStorage.clear();
        throw extractErrorMessage(error, 'Failed to create API Key. Please try again.');
    }
};

/**
 * Registers a new user with the provided data.
 * @param {Object} data - User registration data.
 * @returns {Object} - Response data from the registration API.
 * @throws Will throw an error if registration fails.
 */
export const registerUser = async (data) => {
    try {
        const apiKey = localStorage.getItem('apiKey') || '';
        const response = await axios.post(`${API_URL}/auth/register`, data, {
            headers: {
                'X-Noroff-API-Key': apiKey
            }
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Registration failed. Please check your information and try again.');
    }
};

/**
 * Retrieves venues managed by the logged-in user, including detailed bookings.
 * @returns {Object} - Response data containing venues.
 * @throws Will throw an error if fetching venues fails.
 */
export const getManagerVenues = async () => {
    try {
        const headers = getHeaders();
        const userName = localStorage.getItem('userName');

        if (!userName) {
            throw new Error('User information missing. Please log in again.');
        }

        const response = await axios.get(
            `${API_URL}/holidaze/profiles/${userName}/venues`,
            {
                headers: headers,
                params: {
                    _bookings: true,
                    _bookings_user: true,
                    _customer: true, // Include detailed customer info
                    _venue: true      // Include detailed venue info
                }
            }
        );

        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to fetch your venues at this time.');
    }
};

/**
 * Retrieves the logged-in user's profile.
 * @returns {Object} - User profile data.
 * @throws Will throw an error if fetching the profile fails.
 */
export const getUserProfile = async () => {
    try {
        const userName = localStorage.getItem('userName');
        if (!userName) throw new Error('User information missing. Please log in again.');

        const response = await axios.get(`${API_URL}/holidaze/profiles/${userName}`, {
            headers: getHeaders()
        });

        return response.data.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Failed to load user profile.');
    }
};

/**
 * Searches venues by name and description on the server-side.
 * @param {string} query - Search query.
 * @returns {Array} - Array of matching venues.
 * @throws Will throw an error if the search fails.
 */
export const searchVenues = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/venues/search`, {
            params: { q: query },
        });
        return response.data.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Failed to search venues.');
    }
};

/**
 * Retrieves a specific venue by ID, optionally including bookings and reviews.
 * @param {string} id - Venue ID.
 * @param {boolean} includeBookings - Whether to include bookings.
 * @param {boolean} includeReviews - Whether to include reviews.
 * @returns {Object} - Venue data.
 * @throws Will throw an error if fetching the venue fails.
 */
export const getVenueById = async (id, includeBookings = false, includeReviews = false) => {
    try {
        const queryParams = new URLSearchParams();
        if (includeBookings) queryParams.append('_bookings', 'true');
        if (includeReviews) queryParams.append('_reviews', 'true');

        const url = `${API_URL}/holidaze/venues/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');

        let headers = {};

        if (token && apiKey) {
            headers = {
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': apiKey,
            };
        }

        const response = await axios.get(url, {
            headers: Object.keys(headers).length > 0 ? headers : undefined,
        });

        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, `Unable to fetch details for venue ID ${id}.`);
    }
};

/**
 * Fetches all venues with optional additional fields (like owner, bookings).
 * @param {Object} options - Query parameters for additional data (like `_owner`, `_bookings`).
 * @returns {Array} - Array of all venues.
 */
export const getAllVenues = async (options = {}) => {
    try {
        const params = new URLSearchParams();
        if (options.includeOwner) params.append('_owner', true);
        if (options.includeBookings) params.append('_bookings', true);

        const response = await axios.get(`${API_URL}/holidaze/venues`, { params });
        return response.data.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to fetch venues.');
    }
};

/**
 * Retrieves bookings for a specific venue by venueId.
 * @param {string} venueId - Venue ID.
 * @returns {Array} - Array of bookings for the venue.
 * @throws Will throw an error if fetching bookings fails.
 */
export const getVenueBookings = async (venueId) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/bookings`, {
            headers: getHeaders()
        });
        const filteredBookings = response.data.data.filter(booking => booking.venue.id === venueId);
        return filteredBookings;
    } catch (error) {
        throw extractErrorMessage(error, `Unable to fetch bookings for venue ID ${venueId}.`);
    }
};

/**
 * Retrieves bookings for a specific venue using the dedicated endpoint.
 * @param {string} venueId - Venue ID.
 * @returns {Array} - Array of bookings for the venue.
 * @throws Will throw an error if fetching bookings fails.
 */
export const getBookingsByVenueId = async (venueId) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/venues/${venueId}/bookings`, {
            headers: getHeaders(),
        });
        return response.data.data;
    } catch (error) {
        throw extractErrorMessage(error, `Unable to fetch bookings for venue ID ${venueId}.`);
    }
};

/**
 * Retrieves a specific venue by ID, including bookings.
 * @param {string} id - Venue ID.
 * @returns {Object} - Venue data including bookings.
 * @throws Will throw an error if fetching the venue fails.
 */
export const getVenueByIdWithBookings = async (id) => {
    try {
        const headers = getHeaders();
        const response = await axios.get(`${API_URL}/holidaze/venues/${id}?_bookings=true`, {
            headers: headers,
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, `Unable to fetch venue with ID ${id}.`);
    }
};

/**
 * Retrieves bookings by user profile.
 * @param {string} userName - User's username.
 * @returns {Object} - User's bookings.
 * @throws Will throw an error if fetching bookings fails.
 */
export const getUserBookings = async (userName) => {
    try {
        const headers = getHeaders();
        const response = await axios.get(
            `${API_URL}/holidaze/profiles/${userName}/bookings?_venue=true`,
            { headers: headers }
        );
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, `Unable to fetch bookings for user ${userName}.`);
    }
};

/**
 * Deletes a booking by booking ID.
 * @param {string} bookingId - Booking ID.
 * @throws Will throw an error if deleting the booking fails.
 */
export const deleteBooking = async (bookingId) => {
    try {
        const headers = getHeaders();
        const response = await axios.delete(`${API_URL}/holidaze/bookings/${bookingId}`, {
            headers: headers,
        });
        if (response.status !== 204) {
            throw new Error('Failed to delete booking.');
        }
    } catch (error) {
        throw extractErrorMessage(error, `Unable to delete booking ID ${bookingId}.`);
    }
};

/**
 * Updates a booking by booking ID.
 * @param {string} bookingId - Booking ID.
 * @param {Object} bookingData - Data to update the booking.
 * @returns {Object} - Updated booking data.
 * @throws Will throw an error if updating the booking fails.
 */
export const updateBooking = async (bookingId, bookingData) => {
    try {
        const headers = getHeaders();
        const response = await axios.put(
            `${API_URL}/holidaze/bookings/${bookingId}`,
            bookingData,
            { headers: headers }
        );
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, `Unable to update booking ID ${bookingId}.`);
    }
};

/**
 * Retrieves venues created by the logged-in user.
 * @param {string} username - User's username.
 * @returns {Object} - User's venues.
 * @throws Will throw an error if fetching venues fails.
 */
export const getUserVenues = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/profiles/${username}/venues`, {
            headers: getHeaders() // Include token and API key
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to fetch your venues.');
    }
};

/**
 * Updates a venue by venue ID.
 * @param {string} id - Venue ID.
 * @param {Object} venueData - Data to update the venue.
 * @returns {Object} - Updated venue data.
 * @throws Will throw an error if updating the venue fails.
 */
export const updateVenue = async (id, venueData) => {
    try {
        const response = await axios.put(`${API_URL}/holidaze/venues/${id}`, venueData, {
            headers: getHeaders() // Include token and API key
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to update venue.');
    }
};

/**
 * Deletes a venue by venue ID.
 * @param {string} id - Venue ID.
 * @throws Will throw an error if deleting the venue fails.
 */
export const deleteVenue = async (id) => {
    try {
        await axios.delete(`${API_URL}/holidaze/venues/${id}`, {
            headers: getHeaders()
        });
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to delete venue.');
    }
};

/**
 * Updates the user's profile.
 * @param {Object} profileData - Data to update the profile.
 * @returns {Object} - Updated profile data.
 * @throws Will throw an error if updating the profile fails.
 */
export const updateUserProfile = async (profileData) => {
    try {
        const profileName = localStorage.getItem('userName');
        if (!profileName) {
            throw new Error('User information missing. Please log in again.');
        }

        const endpoint = `${API_URL}/holidaze/profiles/${encodeURIComponent(profileName)}`;

        const response = await axios.put(endpoint, profileData, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to update your profile.');
    }
};

/**
 * Updates the user's avatar.
 * @param {Object} avatarData - Data for the new avatar.
 * @returns {Object} - Updated avatar data.
 * @throws Will throw an error if updating the avatar fails.
 */
export const updateUserAvatar = async (avatarData) => {
    try {
        const profileName = localStorage.getItem('userName');
        if (!profileName) {
            throw new Error('User information missing. Please log in again.');
        }

        const endpoint = `${API_URL}/holidaze/profiles/${encodeURIComponent(profileName)}`;

        const response = await axios.put(
            endpoint,
            { avatar: avatarData },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to update your avatar.');
    }
};

/**
 * Creates a new venue.
 * @param {Object} venueData - Data for the new venue.
 * @returns {Object} - Created venue data.
 * @throws Will throw an error if creating the venue fails.
 */
export const createVenue = async (venueData) => {
    try {
        const headers = getHeaders();
        if (!headers.Authorization || !headers['X-Noroff-API-Key']) {
            throw new Error('Authorization error: Missing token or API key for creating venue.');
        }

        const response = await axios.post(`${API_URL}/holidaze/venues`, venueData, {
            headers: headers // Use the headers returned by getHeaders
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to create venue.');
    }
};

/**
 * Creates a new booking.
 * @param {Object} bookingData - Data for the new booking.
 * @returns {Object} - Created booking data.
 * @throws Will throw an error if creating the booking fails.
 */
export const createBooking = async (bookingData) => {
    try {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');

        if (!token || !apiKey) {
            throw new Error('Authentication error: You need to log in to make a booking.');
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
            'Content-Type': 'application/json',
        };

        const response = await axios.post(`${API_URL}/holidaze/bookings`, bookingData, {
            headers: headers,
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error, 'Unable to create booking. Please try again.');
    }
};

/**
 * Extracts a meaningful error message from the Axios error object.
 * @param {Object} error - Axios error object.
 * @param {string} defaultMessage - Default message if none found.
 * @returns {string} - Extracted error message.
 */
const extractErrorMessage = (error, defaultMessage) => {
    if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
        return error.response.data.errors[0].message;
    }
    return defaultMessage;
};

export { getHeaders };
