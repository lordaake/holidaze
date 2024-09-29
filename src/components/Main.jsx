import React from 'react';

/**
 * A layout component that wraps the main content of the page.
 * It centers the content and ensures responsive spacing.
 * @param {Object} props - Contains child components to be displayed inside.
 */
function MainContent({ children }) {
    return (
        <main className="flex-grow pt-20 flex justify-center">
            {/* Centers content and adds padding from the top */}
            <div className="container mx-auto px-4">
                {/* Keeps content within a responsive container */}
                {children}
            </div>
        </main>
    );
}

export default MainContent;
