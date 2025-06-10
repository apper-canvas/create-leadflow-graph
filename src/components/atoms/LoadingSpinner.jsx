import React from 'react';

const LoadingSpinner = ({ className = 'w-4 h-4' }) => {
    return (
        <div className={`${className} border-2 border-current border-t-transparent rounded-full animate-spin`}></div>
    );
};

export default LoadingSpinner;