import React from 'react';
import { getStatusColorClass } from '@/config/constants';

const StatusBadge = ({ status, className = '' }) => {
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(status)} ${className}`}>
            {status}
        </span>
    );
};

export default StatusBadge;