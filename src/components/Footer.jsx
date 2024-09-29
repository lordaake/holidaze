import React from 'react';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-4 mt-16">
            {/* Footer container with background and padding */}

            <div className="container mx-auto text-center">
                {/* Centered content inside a responsive container */}

                {/* Company Info */}
                <p className="text-base sm:text-lg font-semibold mb-2">
                    &copy; 2024 Holidaze. All rights reserved.
                </p>

                {/* Contact Info */}
                <p className="text-xs sm:text-sm">
                    {/* Email link with hover effect */}
                    <a href="mailto:info@holidaze.com" className="hover:text-yellow-400 transition duration-300">info@holidaze.com</a>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
