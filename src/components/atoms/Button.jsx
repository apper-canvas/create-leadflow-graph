import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, type = 'button', disabled, ...props }) => {
    const Component = props.whileHover || props.whileTap ? motion.button : 'button';

    // Filter out non-HTML props if not a motion component
    const filteredProps = { ...props };
    if (Component === 'button') {
        delete filteredProps.whileHover;
        delete filteredProps.whileTap;
    }

    return (
        <Component
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...filteredProps}
        >
            {children}
        </Component>
    );
};

export default Button;