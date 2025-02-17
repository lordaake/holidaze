// src/components/Navbar.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { to: '/', text: 'Home' },
        { to: '/accommodations', text: 'Accommodations' },
        { to: '/contact', text: 'Contact' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-white shadow-md transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Title */}
                    <div className="flex items-center">
                        <img
                            src="/holidaze-logo.png"
                            alt="Holidaze Logo"
                            className="h-10 w-auto"
                        />
                        <h1 className="ml-3 text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300">
                            <Link to="/" onClick={closeMobileMenu}>
                                Holidaze
                            </Link>
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-6">
                        {navLinks.map((link, index) => (
                            <div key={index} className="relative group">
                                <Link
                                    to={link.to}
                                    className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                >
                                    {link.text}
                                </Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                            </div>
                        ))}
                        {isLoggedIn ? (
                            <>
                                <div className="relative group">
                                    <Link
                                        to="/user-dashboard"
                                        className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                    >
                                        My Page
                                    </Link>
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                                </div>
                                <div className="relative group">
                                    <button
                                        onClick={handleLogout}
                                        className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                    >
                                        Logout
                                    </button>
                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                                </div>
                            </>
                        ) : (
                            <div className="relative group">
                                <Link
                                    to="/login"
                                    className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300"
                                >
                                    Login
                                </Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle (always hamburger) */}
                    <div className="flex lg:hidden items-center">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300 focus:outline-none"
                        >
                            {/* Hamburger Icon */}
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {/* Slide the entire container from the left */}
            <div
                className={`lg:hidden fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Side Drawer */}
                <div className="relative w-3/4 max-w-xs h-full bg-blue-900 shadow-lg z-50">
                    {/* Single Close Button (X) in the drawer */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-md text-white hover:bg-blue-700 transition-colors duration-300 focus:outline-none"
                        >
                            {/* X Icon */}
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Nav Links */}
                    <ul className="flex flex-col items-start px-6 space-y-4">
                        {navLinks.map((link, index) => (
                            <li key={index} className="w-full">
                                <Link
                                    onClick={closeMobileMenu}
                                    to={link.to}
                                    className="block text-xl font-medium text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                                >
                                    {link.text}
                                </Link>
                            </li>
                        ))}
                        {isLoggedIn ? (
                            <>
                                <li className="w-full">
                                    <Link
                                        onClick={closeMobileMenu}
                                        to="/user-dashboard"
                                        className="block text-xl font-medium text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        My Page
                                    </Link>
                                </li>
                                <li className="w-full">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeMobileMenu();
                                        }}
                                        className="w-full text-left text-xl font-medium text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="w-full">
                                <Link
                                    onClick={closeMobileMenu}
                                    to="/login"
                                    className="block text-xl font-medium text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Transparent Black Overlay (click to close) */}
                <div
                    onClick={toggleMobileMenu}
                    className="flex-1 bg-black bg-opacity-50"
                ></div>
            </div>
        </nav>
    );
}

export default Navbar;
