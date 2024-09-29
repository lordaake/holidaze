import React, { useState, useContext } from 'react'; // Import React hooks for state and context management
import { useNavigate, Link } from 'react-router-dom'; // Import navigation hooks and Link for routing
import { loginUser } from '../services/apiService'; // Import API service to handle login
import { AuthContext } from '../context/AuthContext'; // Import authentication context for managing login state
import { ToastContainer, toast } from 'react-toastify'; // Import toast notification system
import 'react-toastify/dist/ReactToastify.css'; // Import default CSS for toast notifications

/**
 * Login component handles user authentication.
 * It captures email and password, attempts to log in, and provides feedback via toast notifications.
 */
function Login() {
    // State variables for storing the email and password inputs
    const [email, setEmail] = useState(''); // Tracks the email input from the user
    const [password, setPassword] = useState(''); // Tracks the password input from the user

    // Hook for programmatic navigation after successful login
    const navigate = useNavigate();

    // Destructure the login function from AuthContext to manage login state across the app
    const { login } = useContext(AuthContext);

    /**
     * Handles the form submission when the user attempts to log in.
     * Calls the loginUser API and, on success, saves the token and navigates to the user dashboard.
     * @param {Event} e - The form submit event to prevent the default form action.
     */
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submit action

        try {
            // Send the email and password to the API to log in the user
            const userData = await loginUser({ email, password });

            // Call the login function from AuthContext to store access token and API key
            login(userData.data.accessToken, userData.data.apiKey);

            // Navigate to the user dashboard upon successful login
            navigate('/user-dashboard');
        } catch (error) {
            // Handle error and display a toast notification to the user
            if (error.response && error.response.data && error.response.data.errors) {
                // If there is a specific error message from the API, show it
                const errorMessage = error.response.data.errors[0].message;
                toast.error(errorMessage); // Show the error message in a toast notification
            } else {
                // If no specific error message is provided, show a generic error
                toast.error('Invalid email or password');
            }
        }
    };

    return (
        <div className="container mx-auto py-8">
            {/* ToastContainer to display toast notifications to the user */}
            <ToastContainer
                position="top-right"
                autoClose={3000} // Toast closes automatically after 3 seconds
                hideProgressBar={false} // Show the progress bar in the toast
                newestOnTop // Newer toasts appear on top of older ones
                closeOnClick // Allow closing the toast by clicking on it
                rtl={false} // Text direction is left to right (not right-to-left)
                pauseOnFocusLoss // Pause the toast auto-close timer when window loses focus
                draggable // Allow dragging the toast around
                pauseOnHover // Pause the auto-close timer when hovering over the toast
            />

            {/* Login heading */}
            <h2 className="text-4xl font-bold mb-6 text-center text-black">Login</h2>

            {/* Login form */}
            <form
                onSubmit={handleLogin} // Call the handleLogin function when the form is submitted
                className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg"
            >
                {/* Email input field */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update state when the user types
                        className="form-input w-full text-black"
                        required
                    />
                </div>

                {/* Password input field */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password} // Bind the password state to the input field
                        onChange={(e) => setPassword(e.target.value)} // Update state when the user types
                        className="form-input w-full" // Basic styling for the input
                        required // Make this field required
                    />
                </div>

                {/* Submit button to trigger the login */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700" // Styling for the button
                >
                    Login
                </button>
            </form>

            {/* Link to navigate to the registration page for new users */}
            <p className="text-center mt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default Login; // Export the component to be used in other parts of the app
