// src/components/Navbar.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Navbar component that provides navigation links and user authentication options.
 * Handles mobile and desktop navigation, login/logout functionality, and displays different menus based on user authentication state.
 */
function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to control mobile menu visibility
    const { isLoggedIn, logout } = useContext(AuthContext); // Access login status and logout function from AuthContext
    const navigate = useNavigate(); // Hook for navigating to different routes

    /**
     * Handles the logout process.
     * Logs the user out and redirects them to the homepage.
     */
    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home page after logging out
    };

    /**
     * Toggles the visibility of the mobile menu.
     */
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu state
    };

    /**
     * Closes the mobile menu when a link is clicked.
     */
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg fixed w-full z-50 top-0 transition duration-300 ease-in-out transform">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4">
                    <img src="/holidaze-logo.png" alt="Holidaze Logo" className="h-10 w-auto" />
                    <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-800 transition duration-300">
                        <Link to="/" onClick={closeMobileMenu}>Holidaze</Link>
                    </h1>
                </div>

                {/* Toggle Button for Mobile Menu (visible on small screens) */}
                <div className="lg:hidden">
                    <button
                        className="p-2 rounded-md hover:bg-gray-100 transition duration-300"
                        onClick={handleMobileMenuToggle}
                    >
                        {isMobileMenuOpen ? (
                            <span className="text-2xl text-blue-600">&#10005;</span> // Cross icon when menu is open
                        ) : (
                            <span className="text-2xl text-blue-600">&#9776;</span> // Hamburger icon when menu is closed
                        )}
                    </button>
                </div>

                {/* Navigation Links for Desktop */}
                <ul className="hidden lg:flex lg:space-x-8 lg:justify-center text-lg font-medium text-blue-600">
                    {[
                        { to: "/", text: "Home" },
                        { to: "/accommodations", text: "Accommodations" },
                        { to: "/contact", text: "Contact" },
                    ].map((item, index) => (
                        <li key={index} className="relative group">
                            <Link to={item.to} className="flex items-center text-xl font-semibold hover:text-blue-800 transition duration-300">
                                {item.text}
                            </Link>
                            {/* Underline animation on hover */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </li>
                    ))}

                    {isLoggedIn ? (
                        <>
                            <li className="relative group">
                                <Link to="/user-dashboard" className="flex items-center text-xl font-semibold hover:text-blue-800 transition duration-300">
                                    My Page
                                </Link>
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </li>
                            <li className="relative group">
                                <button
                                    onClick={handleLogout}
                                    className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition duration-300"
                                >
                                    Logout
                                </button>
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </li>
                        </>
                    ) : (
                        <li className="relative group">
                            <Link to="/login" className="flex items-center text-xl font-semibold hover:text-blue-800 transition duration-300">
                                Login
                            </Link>
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu (visible when toggled open) */}
                <div className={`fixed inset-0 bg-blue-900 bg-opacity-5 z-20 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-end p-4">
                        <button
                            className="p-2 rounded-md hover:bg-blue-700 transition duration-300"
                            onClick={handleMobileMenuToggle}
                        >
                            <span className="text-2xl text-blue">&#10005;</span> {/* Cross symbol to close menu */}
                        </button>
                    </div>
                    <div className="flex justify-center bg-blue-900 z-50 relative bg-opacity-95">
                        {/* Navigation Links for Mobile */}
                        <ul className="flex flex-col space-y-4 p-6 rounded-lg mt-16 text-lg font-semibold text-white">
                            {[
                                { to: "/", text: "Home" },
                                { to: "/accommodations", text: "Accommodations" },
                                { to: "/contact", text: "Contact" },
                            ].map((item, index) => (
                                <li key={index} className="w-full text-center">
                                    <Link
                                        to={item.to}
                                        className="block p-2 rounded-md hover:bg-blue-700 transition duration-300"
                                        onClick={closeMobileMenu} // Close mobile menu when link is clicked
                                    >
                                        {item.text}
                                    </Link>
                                </li>
                            ))}

                            {isLoggedIn ? (
                                <>
                                    <li className="w-full text-center">
                                        <Link
                                            to="/user-dashboard"
                                            className="block p-2 rounded-md hover:bg-blue-700 transition duration-300"
                                            onClick={closeMobileMenu} // Close mobile menu when link is clicked
                                        >
                                            My Page
                                        </Link>
                                    </li>
                                    <li className="w-full text-center">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                closeMobileMenu(); // Close mobile menu after logout
                                            }}
                                            className="w-full p-2 rounded-md hover:bg-blue-700 transition duration-300"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li className="w-full text-center">
                                    <Link
                                        to="/login"
                                        className="block p-2 rounded-md hover:bg-blue-700 transition duration-300"
                                        onClick={closeMobileMenu} // Close mobile menu when link is clicked
                                    >
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
