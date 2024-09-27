// src/pages/CreateBookingModal.jsx
import React, { useState } from 'react';

function CreateBookingModal({ onClose }) {
    const [bookingDetails, setBookingDetails] = useState('');

    const handleSubmit = () => {
        // console.log(bookingDetails);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Create a Booking</h2>
                <textarea
                    value={bookingDetails}
                    onChange={(e) => setBookingDetails(e.target.value)}
                    placeholder="Enter booking details"
                    className="w-full p-2 border rounded mb-4"
                />
                <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded mr-2">
                    Submit
                </button>
                <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
                    Close
                </button>
            </div>
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        </div>
    );
}

export default CreateBookingModal;
