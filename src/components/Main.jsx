import React from 'react';

function MainContent({ children }) {
    return (
        <main className="flex-grow pt-20 flex justify-center"> {/* justify-center centers content horizontally */}
            <div className="container mx-auto px-4"> {/* Ensure content stays within a responsive container */}
                {children}
            </div>
        </main>
    );
}

export default MainContent;
