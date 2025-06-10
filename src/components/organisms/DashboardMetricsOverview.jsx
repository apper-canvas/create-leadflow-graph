import React from 'react';
import MetricCard from '@/components/molecules/MetricCard';

const DashboardMetricsOverview = ({ metrics }) => {
    const statusCards = [
        {
            title: 'Total Leads',
            value: metrics.totalLeads,
            icon: 'Users',
            color: 'primary',
            change: '+12%' // Hardcoded, ideally comes from metrics API
        },
        {
            title: 'New Leads',
            value: metrics.leadsByStatus['New'] || 0,
            icon: 'UserPlus',
            color: 'blue-500',
            change: '+8%' // Hardcoded
        },
        {
            title: 'Qualified Leads',
            value: metrics.leadsByStatus['Qualified'] || 0,
            icon: 'UserCheck',
            color: 'secondary',
            change: '+15%' // Hardcoded
        },
        {
            title: 'Conversion Rate',
            value: `${metrics.conversionRate}%`,
            icon: 'TrendingUp',
            color: 'accent',
            change: '+3%' // Hardcoded
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statusCards.map((card, index) => (
                <MetricCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    color={card.color}
                    change={card.change}
                    index={index}
                />
            ))}
        </div>
    );
};

export default DashboardMetricsOverview;