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
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Handles the form submission.
     * Validates the form and sets success or error messages accordingly.
     */
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the default form submission behavior

        // Form validation: Check if all fields are filled
        if (!formData.name || !formData.email || !formData.message) {
            setError('All fields are required.');
            setSuccess('');
            return;
        }

        // If validation passes, set success message and reset form
        setSuccess('Your message has been sent! We will contact you soon.');
        setError('');
        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Title */}
                <h2 className="text-center text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-red-500 to-yellow-500">
                    Contact Us
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Information Section */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold text-blue-900 mb-4">
                            Holidaze Contact Information
                        </h3>

                        {/* Address Information */}
                        <div className="flex items-center mb-4 hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                            <FaMapMarkerAlt className="text-red-600 mr-2 text-xl" />
                            <p className="text-gray-800">123 Holidaze St, Bergen, Norway</p>
                        </div>

                        {/* Phone Information */}
                        <div className="flex items-center mb-4 hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                            <FaPhone className="text-green-600 mr-2 text-xl" />
                            <p className="text-gray-800">+47 123 456 789</p>
                        </div>

                        {/* Email Information */}
                        <div className="flex items-center mb-4 hover:bg-gray-100 p-2 rounded transition-colors duration-200">
                            <FaEnvelope className="text-yellow-500 mr-2 text-xl" />
                            <p className="text-gray-800">contact@holidaze.com</p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 leading-relaxed">
                            At Holidaze, we are dedicated to providing you with a seamless and
                            personalized accommodation booking experience. Our collection
                            features top-rated properties curated for their quality and comfort,
                            ensuring every stay is exceptional.
                        </p>
                        <p className="mt-4 text-gray-700 leading-relaxed">
                            If you have any questions, need assistance, or require further
                            information, our team is here to support you. Simply reach out, and
                            we will be delighted to help make your stay perfect.
                        </p>
                    </div>

                    {/* Contact Form Section */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                            Get In Touch
                        </h3>

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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    rows="6"
                                    required
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg hover:opacity-90 transition duration-200"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
