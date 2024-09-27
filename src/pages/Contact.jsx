import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form validation
        if (!formData.name || !formData.email || !formData.message) {
            setError('All fields are required.');
            return;
        }

        setSuccess('Your message has been sent! We will contact you soon.');
        setError('');
        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div className="container mx-auto py-12 px-6">
            <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">Contact Us</h2>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-2xl font-semibold text-blue-900 mb-4">Holidaze Contact Information</h3>
                <div className="flex items-center mb-4">
                    <FaMapMarkerAlt className="text-red-600 mr-2 text-xl" />
                    <p>123 Holidaze St, Bergen, Norway</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaPhone className="text-green-600 mr-2 text-xl" />
                    <p>+47 123 456 789</p>
                </div>
                <div className="flex items-center mb-4">
                    <FaEnvelope className="text-yellow-500 mr-2 text-xl" />
                    <p>contact@holidaze.com</p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                    Holidaze is a premium platform for booking accommodations in Bergen and beyond. We pride ourselves on offering
                    top-rated properties and exceptional customer service. Reach out to us for any inquiries or assistance, and we
                    will be happy to help.
                </p>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-blue-900 mb-6">Get In Touch</h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                <form onSubmit={handleSubmit}>
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
