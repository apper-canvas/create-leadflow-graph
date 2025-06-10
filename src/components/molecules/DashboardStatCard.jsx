import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const DashboardStatCard = ({ icon, iconBgColorClass, value, label }) => {
    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${iconBgColorClass} rounded-lg flex items-center justify-center`}>
                    <ApperIcon name={icon} className="w-5 h-5 text-current" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-600">{label}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStatCard;