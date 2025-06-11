import React from 'react';
import { TrendingUp, Users, Target, DollarSign, Calendar, Phone } from 'lucide-react';
import DashboardStatCard from '../molecules/DashboardStatCard';

const DashboardMetricsOverview = ({ data = {} }) => {
  // Default values if data is not provided
  const metrics = {
    totalLeads: data.totalLeads || 0,
    newLeads: data.newLeads || 0,
    qualifiedLeads: data.qualifiedLeads || 0,
    wonDeals: data.wonDeals || 0,
    conversionRate: data.conversionRate || 0,
    teamMembers: data.teamMembers || 0,
    activeMembers: data.activeMembers || 0,
    totalRevenue: data.totalRevenue || 0,
    pipelineValue: data.pipelineValue || 0
  };

  // Calculate trends (in a real app, this would come from historical data)
  const getTrend = (current, previous = 0) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  // Mock previous month data for trend calculation
  const previousData = {
    totalLeads: Math.max(0, metrics.totalLeads - Math.floor(Math.random() * 20)),
    newLeads: Math.max(0, metrics.newLeads - Math.floor(Math.random() * 10)),
    qualifiedLeads: Math.max(0, metrics.qualifiedLeads - Math.floor(Math.random() * 5)),
    wonDeals: Math.max(0, metrics.wonDeals - Math.floor(Math.random() * 3)),
    conversionRate: Math.max(0, metrics.conversionRate - Math.floor(Math.random() * 10)),
    teamMembers: Math.max(0, metrics.teamMembers - Math.floor(Math.random() * 2)),
    totalRevenue: Math.max(0, metrics.totalRevenue - Math.floor(Math.random() * 100000)),
    pipelineValue: Math.max(0, metrics.pipelineValue - Math.floor(Math.random() * 50000))
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads.toLocaleString(),
      icon: Users,
      trend: getTrend(metrics.totalLeads, previousData.totalLeads),
      color: 'blue'
    },
    {
      title: 'New Leads',
      value: metrics.newLeads.toLocaleString(),
      icon: TrendingUp,
      trend: getTrend(metrics.newLeads, previousData.newLeads),
      color: 'green'
    },
    {
      title: 'Qualified Leads',
      value: metrics.qualifiedLeads.toLocaleString(),
      icon: Target,
      trend: getTrend(metrics.qualifiedLeads, previousData.qualifiedLeads),
      color: 'purple'
    },
    {
      title: 'Won Deals',
      value: metrics.wonDeals.toLocaleString(),
      icon: DollarSign,
      trend: getTrend(metrics.wonDeals, previousData.wonDeals),
      color: 'emerald'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      trend: getTrend(metrics.totalRevenue, previousData.totalRevenue),
      color: 'green'
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(metrics.pipelineValue),
      icon: Target,
      trend: getTrend(metrics.pipelineValue, previousData.pipelineValue),
      color: 'blue'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: Target,
      trend: getTrend(metrics.conversionRate, previousData.conversionRate),
      color: 'orange'
    },
    {
      title: 'Team Members',
      value: `${metrics.activeMembers}/${metrics.teamMembers}`,
      icon: Phone,
      trend: getTrend(metrics.teamMembers, previousData.teamMembers),
      color: 'indigo'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {statCards.slice(0, 8).map((stat, index) => (
        <DashboardStatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default DashboardMetricsOverview;