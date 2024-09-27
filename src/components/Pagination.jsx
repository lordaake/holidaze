// src/components/Pagination.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useSwipeable } from 'react-swipeable';

/**
 * Pagination Component
 *
 * Props:
 * - currentPage (number): The current active page.
 * - totalPages (number): The total number of pages.
 * - onPageChange (function): Callback function to handle page changes.
 *
 * This component displays pagination controls with Previous, Next buttons,
 * and dynamic page numbers. It also supports swipe gestures for navigation
 * on touch-enabled devices. The layout adapts based on screen size for
 * enhanced responsiveness.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Define swipe handlers using react-swipeable
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentPage < totalPages) onPageChange(currentPage + 1);
        },
        onSwipedRight: () => {
            if (currentPage > 1) onPageChange(currentPage - 1);
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: false, // Disable mouse tracking for swipe
    });

    /**
     * Generates an array of visible page numbers with ellipsis where appropriate.
     * Ensures that the first, last, and a range of pages around the current page are displayed.
     *
     * @returns {Array} Array containing page numbers and ellipsis strings.
     */
    const getVisiblePages = () => {
        const pages = [];
        const delta = 1; // Number of pages to show on either side of currentPage

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (
                (i === currentPage - delta - 1 && i > 1) ||
                (i === currentPage + delta + 1 && i < totalPages)
            ) {
                pages.push('...');
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div
            {...handlers}
            className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-8"
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md text-sm min-w-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                aria-label="Previous Page"
            >
                Previous
            </button>

            {/* Page Number Buttons for Desktop */}
            <div className="hidden sm:flex space-x-1">
                {visiblePages.map((page, index) =>
                    page === '...' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-2 text-sm text-gray-500"
                            aria-hidden="true"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 rounded-md text-sm min-w-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold ${currentPage === page
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Page Number Display for Mobile */}
            <div className="flex sm:hidden items-center space-x-2">
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md text-sm min-w-[40px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                aria-label="Next Page"
            >
                Next
            </button>
        </div>
    );
};

// Define PropTypes for type checking
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
