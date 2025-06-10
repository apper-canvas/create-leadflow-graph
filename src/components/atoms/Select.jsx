import React from 'react';

const Select = ({ options, className, isInvalid, ...props }) => {
    const selectClassName = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
        isInvalid ? 'border-red-500' : 'border-gray-300'
    } ${className || ''}`;

    return (
        <select className={selectClassName} {...props}>
            {options.map(option => (
                <option key={option.value || option} value={option.value || option}>
                    {option.label || option}
                </option>
            ))}
        </select>
    );
};

export default Select;