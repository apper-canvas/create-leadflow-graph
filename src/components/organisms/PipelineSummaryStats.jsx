import React from 'react';
import DashboardStatCard from '@/components/molecules/DashboardStatCard';

const PipelineSummaryStats = ({ totalLeads, wonDealsCount }) => {
    const conversionRate = totalLeads > 0 ? Math.round((wonDealsCount / totalLeads) * 100) : 0;

    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardStatCard 
                icon="Users" 
                iconBgColorClass="bg-primary/10" 
                value={totalLeads} 
                label="Total Leads" 
            />
            
            <DashboardStatCard 
                icon="Trophy" 
                iconBgColorClass="bg-accent/10" 
                value={wonDealsCount} 
                label="Won Deals" 
            />
            
            <DashboardStatCard 
                icon="TrendingUp" 
                iconBgColorClass="bg-secondary/10" 
                value={`${conversionRate}%`} 
                label="Conversion Rate" 
            />
        </div>
    );
};

export default PipelineSummaryStats;