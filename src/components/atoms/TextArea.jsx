import React from 'react';

const TextArea = ({ className, isInvalid, ...props }) => {
    const textareaClassName = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
        isInvalid ? 'border-red-500' : 'border-gray-300'
    } ${className || ''}`;

    return (
        <textarea className={textareaClassName} {...props} />
    );
};

export default TextArea;