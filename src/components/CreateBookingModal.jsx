// src/pages/CreateBookingModal.jsx
import React, { useState } from 'react';

/**
 * CreateBookingModal is a modal component for creating a new booking.
 * It allows users to enter booking details and submit or close the modal.
 * @param {function} onClose - Function to handle closing the modal.
 */
function CreateBookingModal({ onClose }) {
    // State to store the entered booking details
    const [bookingDetails, setBookingDetails] = useState('');

    /**
     * Handles the form submission.
     * Currently, it logs the booking details and closes the modal.
     */
    const handleSubmit = () => {
        // console.log(bookingDetails); // You can replace this with actual booking logic
        onClose(); // Close the modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Modal content container */}
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Create a Booking</h2>

                {/* Textarea to input booking details */}
                <textarea
                    value={bookingDetails}
                    onChange={(e) => setBookingDetails(e.target.value)}
                    placeholder="Enter booking details"
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Submit and Close buttons */}
                <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded mr-2">
                    Submit
                </button>
                <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
                    Close
                </button>
            </div>

            {/* Modal background overlay */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        </div>
    );
}

export default CreateBookingModal;
