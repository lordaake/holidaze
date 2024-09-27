import axios from 'axios';

const API_URL = 'https://v2.api.noroff.dev'; // Base API URL

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');

    // console.log('getHeaders - Token:', token);
    // console.log('getHeaders - API Key:', apiKey);

    if (!token || !apiKey) {
        console.warn('Missing token or API key.');
        // Here, optionally throw an error or handle it gracefully
        throw new Error('Missing token or API key');
    }

    return {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': apiKey
    };
};


// Function to monitor and ensure the API key is set in localStorage
const monitorApiKey = (accessToken) => {
    const intervalId = setInterval(async () => {
        // Get the current API key from localStorage
        let apiKey = localStorage.getItem('apiKey');

        // If the API key is missing or undefined, create and store it again
        if (!apiKey || apiKey === 'undefined') {
            console.warn('API Key is missing or undefined. Attempting to create and store the API key again.');

            try {
                // Create a new API key
                apiKey = await createApiKey(accessToken);

                // Store the new API key in localStorage
                localStorage.setItem('apiKey', apiKey);
                // console.log('API Key created and stored by monitor function:', apiKey);
            } catch (error) {
                console.error('Error creating API key during monitoring:', error);
            }
        } else {
            // console.log('API Key is present:', apiKey);
            // Stop the interval if the API key is present
            clearInterval(intervalId);
        }
    }, 1000);
};

export const loginUser = async (credentials) => {
    try {
        // Make the login request
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
        // console.log('Fetched user profile:', userProfile); // For debugging

        // Store bio and venueManager status
        if (typeof userProfile.bio !== 'undefined') {
            localStorage.setItem('bio', userProfile.bio);
        } else {
            localStorage.setItem('bio', '');
        }

        if (typeof userProfile.venueManager !== 'undefined') {
            localStorage.setItem('venueManager', userProfile.venueManager.toString());
        } else {
            localStorage.setItem('venueManager', 'false'); // Default to false if undefined
        }

        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error.response?.data || error.message);
        throw error;
    }
};



export const createApiKey = async (token) => {
    try {
        if (!token) throw new Error('No access token found');

        const response = await axios.post(`${API_URL}/auth/create-api-key`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const apiKey = response.data.data.key;
        // console.log('API Key created:', apiKey);
        return apiKey;
    } catch (error) {
        console.error('Error creating API key:', error);

        // Clear localStorage on error
        localStorage.clear();

        throw error;
    }
};

// Function to register a new user
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
        console.error('Error registering user:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get venues managed by the logged-in user, including detailed bookings
export const getManagerVenues = async () => {
    try {
        const headers = getHeaders();
        const userName = localStorage.getItem('userName');

        if (!userName) {
            throw new Error('No userName found in localStorage');
        }

        // Updated URL with additional query parameters
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

        return response.data; // Adjust based on your API's response structure
    } catch (error) {
        console.error('Error fetching manager venues:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get the logged-in user's profile
export const getUserProfile = async () => {
    try {
        const userName = localStorage.getItem('userName'); // Get the logged-in user's name from localStorage
        if (!userName) throw new Error('No user logged in');

        const response = await axios.get(`${API_URL}/holidaze/profiles/${userName}`, {
            headers: getHeaders() // Use headers with the token and API key
        });

        // Return the actual user data
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user profile:', error.response?.data || error.message);
        throw error;
    }
};

// Function to get all venues
export const getAllVenues = async () => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/venues`);
        // Extract the venues array from response.data.data
        return response.data.data; // This should be the array of venues
    } catch (error) {
        console.error('Error fetching venues:', error.response?.data || error.message);
        throw error;
    }
};

// Function to search venues by name and description (server-side)
export const searchVenues = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/venues/search`, {
            params: { q: query },
        });
        // Extract the venues array from response.data.data
        return response.data.data; // This should be the array of matching venues
    } catch (error) {
        console.error('Error searching venues:', error.response?.data || error.message);
        throw error;
    }
};


// Function to get a specific venue by ID
export const getVenueById = async (id, includeBookings = false, includeReviews = false) => {
    try {
        // Construct query parameters based on flags
        const queryParams = new URLSearchParams();
        if (includeBookings) queryParams.append('_bookings', 'true');
        if (includeReviews) queryParams.append('_reviews', 'true');

        // Construct the full URL with query parameters
        const url = `${API_URL}/holidaze/venues/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        // Retrieve token and API key from localStorage
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');

        // Initialize headers object
        let headers = {};

        // Conditionally include headers only if both token and API key are present
        if (token && apiKey) {
            headers = {
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': apiKey,
            };
        }

        // Make the GET request with headers if available
        const response = await axios.get(url, {
            headers: Object.keys(headers).length > 0 ? headers : undefined,
        });

        return response.data;
    } catch (error) {
        console.error(
            `Failed to fetch data for venue with ID ${id}:`,
            error.response?.data || error.message
        );
        throw error;
    }
};



export const getVenues = async (params) => {
    try {
        const headers = getHeaders();
        const response = await axios.get(`${API_URL}/holidaze/venues`, {
            params,
            headers
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching venues with parameters:', error.response?.data || error.message);
        throw error;
    }
};


// Function to get bookings for a specific venue by venueId
export const getVenueBookings = async (venueId) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/bookings`, {
            headers: getHeaders()
        });
        const filteredBookings = response.data.data.filter(booking => booking.venue.id === venueId);
        return filteredBookings;
    } catch (error) {
        console.error(`Error fetching bookings for venue ID ${venueId}:`, error.response?.data || error.message);
        throw error;
    }
};

// Function to get bookings for a specific venue using the dedicated endpoint
export const getBookingsByVenueId = async (venueId) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/venues/${venueId}/bookings`, {
            headers: getHeaders(),
        });
        return response.data.data;
    } catch (error) {
        console.error(
            `Error fetching bookings for venue ID ${venueId}:`,
            error.response?.data || error.message
        );
        throw error;
    }
};

// Function to get a specific venue by ID including bookings
export const getVenueByIdWithBookings = async (id) => {
    try {
        const headers = getHeaders();
        const response = await axios.get(`${API_URL}/holidaze/venues/${id}?_bookings=true`, {
            headers: headers,
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching venue with ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Function to get bookings by user profile
export const getUserBookings = async (userName) => {
    try {
        const headers = getHeaders();
        const response = await axios.get(
            `${API_URL}/holidaze/profiles/${userName}/bookings?_venue=true`,
            { headers: headers }
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching bookings for user ${userName}:`, error.response?.data || error.message);
        throw error;
    }
};

// Function to delete a booking
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
        console.error(`Error deleting booking with ID ${bookingId}:`, error.response?.data || error.message);
        throw error;
    }
};

// Function to update a booking
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
        console.error(`Error updating booking with ID ${bookingId}:`, error.response?.data || error.message);
        throw error;
    }
};



// Function to get venues created by the logged-in user
export const getUserVenues = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/holidaze/profiles/${username}/venues`, {
            headers: getHeaders() // Include token and API key
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user venues:', error.response?.data || error.message);
        throw error;
    }
};

// Function to update a venue
export const updateVenue = async (id, venueData) => {
    try {
        const response = await axios.put(`${API_URL}/holidaze/venues/${id}`, venueData, {
            headers: getHeaders() // Include token and API key
        });
        return response.data;
    } catch (error) {
        console.error('Error updating venue:', error.response?.data || error.message);
        throw error;
    }
};

// Function to delete a venue
export const deleteVenue = async (id) => {
    try {
        await axios.delete(`${API_URL}/holidaze/venues/${id}`, {
            headers: getHeaders() // Include token and API key
        });
    } catch (error) {
        console.error('Error deleting venue:', error.response?.data || error.message);
        throw error;
    }
};

// Function to update the user's profile
export const updateUserProfile = async (profileData) => {
    try {
        const profileName = localStorage.getItem('userName');
        if (!profileName) {
            throw new Error('No userName found in localStorage');
        }

        const endpoint = `${API_URL}/holidaze/profiles/${encodeURIComponent(profileName)}`;
        // console.log('Attempting to update profile at endpoint:', endpoint);

        const response = await axios.put(endpoint, profileData, { headers: getHeaders() });
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error.response?.data || error.message);

        // Log detailed error information
        if (error.response && error.response.data) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }

        throw error;
    }
};


// Function to update the user's avatar
export const updateUserAvatar = async (avatarData) => {
    try {
        const profileName = localStorage.getItem('userName');
        if (!profileName) {
            throw new Error('No userName found in localStorage');
        }

        const endpoint = `${API_URL}/holidaze/profiles/${encodeURIComponent(profileName)}`;
        // console.log('Attempting to update avatar at endpoint:', endpoint);

        const response = await axios.put(
            endpoint,
            { avatar: avatarData },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating avatar:', error.response?.data || error.message);

        // Log detailed error information
        if (error.response && error.response.data) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }

        throw error;
    }
};


export const createVenue = async (venueData) => {
    try {
        const headers = getHeaders();
        if (!headers.Authorization || !headers['X-Noroff-API-Key']) {
            throw new Error('Missing authorization or API key for creating venue.');
        }

        const response = await axios.post(`${API_URL}/holidaze/venues`, venueData, {
            headers: headers // Use the headers returned by getHeaders
        });
        return response.data;
    } catch (error) {
        console.error('Error creating venue:', error.response?.data || error.message);
        throw error;
    }
};

// Function to create a new booking
export const createBooking = async (bookingData) => {
    try {
        const token = localStorage.getItem('token');
        const apiKey = localStorage.getItem('apiKey');

        if (!token || !apiKey) {
            throw new Error('User is not authenticated.');
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
        console.error('Error creating booking:', error.response?.data || error.message);
        throw error;
    }
};



export { getHeaders };