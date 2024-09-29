// src/components/Contact.jsx

import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

/**
 * Contact component renders the contact information and a contact form.
 * Allows users to send messages and view contact details.
 */
const Contact = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    // State to handle error messages
    const [error, setError] = useState('');

    // State to handle success messages
    const [success, setSuccess] = useState('');

    /**
     * Handles input changes for the contact form.
     * Updates the corresponding field in the formData state.
     * @param {Object} e - The event object from the input change.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    /**
     * Handles the form submission.
     * Validates the form and sets success or error messages accordingly.
     * @param {Object} e - The event object from the form submission.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the default form submission behavior

        // Form validation: Check if all fields are filled
        if (!formData.name || !formData.email || !formData.message) {
            setError('All fields are required.');
            return;
        }

        // If validation passes, set success message and reset form
        setSuccess('Your message has been sent! We will contact you soon.');
        setError(''); // Clear any existing errors
        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div className="container mx-auto sm:py-12 sm:px-6 px-0 pt-6">
            {/* Page Title */}
            <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">Contact Us</h2>

            {/* Contact Information Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Holidaze Contact Information</h3>

                {/* Address Information */}
                <div className="flex items-center mb-4">
                    <FaMapMarkerAlt className="text-red-600 mr-2 text-xl" />
                    <p>123 Holidaze St, Bergen, Norway</p>
                </div>

                {/* Phone Information */}
                <div className="flex items-center mb-4">
                    <FaPhone className="text-green-600 mr-2 text-xl" />
                    <p>+47 123 456 789</p>
                </div>

                {/* Email Information */}
                <div className="flex items-center mb-4">
                    <FaEnvelope className="text-yellow-500 mr-2 text-xl" />
                    <p>contact@holidaze.com</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                    At Holidaze, we are dedicated to providing you with a seamless and personalized accommodation booking experience. Our collection features top-rated properties, curated for their quality and comfort, to ensure that every stay is exceptional.

                    If you have any questions, need assistance, or require further information, our team is here to support you. Simply reach out, and we will be delighted to help make your stay perfect.
                </p>
            </div>

            {/* Contact Form Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-blue-900 mb-6">Get In Touch</h3>

                {/* Display error message if any */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Display success message if any */}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                {/* Contact Form */}
                <form onSubmit={handleSubmit}>
                    {/* Name Input Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Email Input Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Message Textarea Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="message">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows="6"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
