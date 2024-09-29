// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Reusable input component for forms.
 * @param {Object} props - Props passed to the component.
 */
const FormInput = ({ label, type, name, value, onChange, required, ...props }) => (
    <div className="mb-4">
        <label className="block text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required={required}
            {...props}
        />
    </div>
);

/**
 * Reusable checkbox component for forms.
 * @param {Object} props - Props passed to the component.
 */
const FormCheckbox = ({ label, name, checked, onChange }) => (
    <div className="mb-4">
        <label className="flex items-center">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="mr-2"
            />
            {label}
        </label>
    </div>
);

/**
 * Registration component for new users.
 */
function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '',
        avatarAlt: '',
        venueManager: false,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /**
     * Handles input changes for both text and checkbox inputs.
     * @param {Object} e - Event object from the input.
     */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    /**
     * Handles the registration form submission.
     * Validates input and communicates with the API service.
     * @param {Object} e - Event object from the form submission.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, email, name, avatar, avatarAlt, venueManager } = formData;

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        // Validate name (Disallows punctuation except underscore)
        if (!/^[\w_]+$/.test(name)) {
            setError(
                'Name must not contain spaces or punctuation symbols apart from underscores (_) and should not be empty'
            );
            toast.error(
                'Name must not contain spaces or punctuation symbols apart from underscores (_) and should not be empty'
            );
            return;
        }

        // Validate password length
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            toast.error('Password must be at least 8 characters long');
            return;
        }

        // Validate email for all users
        if (!email.endsWith('@stud.noroff.no')) {
            setError('You must use a stud.noroff.no email address to register.');
            toast.error('You must use a stud.noroff.no email address to register.');
            return;
        }

        // Validate avatar URL if provided
        if (avatar) {
            try {
                const response = await fetch(avatar);
                if (!response.ok) {
                    setError('Avatar URL must be valid and accessible');
                    toast.error('Avatar URL must be valid and accessible');
                    return;
                }
            } catch {
                setError('Avatar URL must be valid and accessible');
                toast.error('Avatar URL must be valid and accessible');
                return;
            }
        }

        // Ensure avatarAlt is less than 120 characters if provided
        if (avatarAlt && avatarAlt.length > 120) {
            setError('Avatar alt text must be less than 120 characters');
            toast.error('Avatar alt text must be less than 120 characters');
            return;
        }

        // Prepare data for registration
        const registrationData = {
            name,
            email,
            password,
            venueManager,
            // Include avatar only if avatar URL is provided
            ...(avatar && {
                avatar: {
                    url: avatar,
                    alt: avatarAlt || '', // Default to empty string if alt text is not provided
                },
            }),
        };

        try {
            await registerUser(registrationData);
            toast.success('Registration successful! Redirecting to login page...');
            // Navigate to login page after a short delay to allow the toast to display
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            // Log the error for debugging purposes
            // console.error('Registration error:', error.response || error.message || error);

            let errorMsg = 'Username or Email may be in use. Try a different username or email.';

            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <div className="container mx-auto py-8 text-black">
            {/* Local ToastContainer */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <h2 className="text-4xl font-bold mb-6 text-center">Register</h2>
            <form
                onSubmit={handleRegister}
                className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg"
            >
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <FormInput
                    label="Username"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />
                <FormInput
                    label="Avatar URL (Optional)"
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                />
                <FormInput
                    label="Avatar Alt Text (Optional)"
                    type="text"
                    name="avatarAlt"
                    value={formData.avatarAlt}
                    onChange={handleInputChange}
                />
                <FormCheckbox
                    label="Register as Venue Manager"
                    name="venueManager"
                    checked={formData.venueManager}
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Register
                </button>
            </form>
            <p className="text-center mt-4 text-black">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default Register;
