import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ title, value, icon, color, change, index }) => {
    const iconBgClass =
        color === 'primary' ? 'bg-primary/10' :
        color === 'secondary' ? 'bg-secondary/10' :
        color === 'accent' ? 'bg-accent/10' :
        'bg-blue-500/10';

    const iconColorClass =
        color === 'primary' ? 'text-primary' :
        color === 'secondary' ? 'text-secondary' :
        color === 'accent' ? 'text-accent' :
        'text-blue-500';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                    <ApperIcon name={icon} className={`w-6 h-6 ${iconColorClass}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{change}</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-gray-600 text-sm">{title}</p>
        </motion.div>
    );
};

export default MetricCard;