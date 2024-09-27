import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/apiService';

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { password, confirmPassword, email, name, avatar, avatarAlt, venueManager } = formData;

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate name
        if (!/^[\w\s]+$/.test(name)) {
            setError('Name must not contain punctuation symbols apart from underscores (_) and should not be empty');
            return;
        }

        // Validate passwords length
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Validate email for venue manager
        if (venueManager && !email.endsWith('@stud.noroff.no')) {
            setError('You must use a stud.noroff.no email address to register as a venue manager');
            return;
        }

        // Validate avatar URL if provided
        if (avatar) {
            try {
                const response = await fetch(avatar);
                if (!response.ok) {
                    setError('Avatar URL must be valid and accessible');
                    return;
                }
            } catch {
                setError('Avatar URL must be valid and accessible');
                return;
            }
        }

        // Prepare data for registration
        const registrationData = {
            name,
            email,
            password,
            ...(avatar && { avatar: { url: avatar, alt: avatarAlt } }),  // Include avatar only if provided
            venueManager
        };

        try {
            await registerUser(registrationData);
            // Navigate to user dashboard after successful registration
            navigate('/dashboard');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to register user. Please try again.';
            setError(errorMsg);
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleRegister} className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg">
                {error && <p className="text-red-500">{error}</p>}
                <FormInput
                    label="Full Name"
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
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                    Register
                </button>
            </form>
            <p className="text-center mt-4">
                Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
            </p>
        </div>
    );
}

export default Register;
