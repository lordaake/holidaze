import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-16">
            <div className="container mx-auto text-center">
                {/* Company Info */}
                <p className="text-lg font-semibold mb-2">
                    &copy; 2024 Holidaze. All rights reserved.
                </p>

                {/* Links Section */}
                <div className="mb-2">
                    <a href="/privacy" className="hover:text-yellow-400 transition duration-300 mx-2">Privacy Policy</a>
                    |
                    <a href="/terms" className="hover:text-yellow-400 transition duration-300 mx-2">Terms of Service</a>
                </div>

                {/* Contact Info */}
                <p className="text-sm">
                    <a href="mailto:info@holidaze.com" className="hover:text-yellow-400 transition duration-300">info@holidaze.com</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
