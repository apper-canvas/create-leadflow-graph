import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DashboardMetricsOverview from '../organisms/DashboardMetricsOverview';
import UpcomingFollowUpsSection from '../organisms/UpcomingFollowUpsSection';
import LeadsByStatusSection from '../organisms/LeadsByStatusSection';
import PipelineSummaryStats from '../organisms/PipelineSummaryStats';
import QuickActionsPanel from '../organisms/QuickActionsPanel';
import LoadingSpinner from '../atoms/LoadingSpinner';
import dashboardService from '../../services/api/dashboardService';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your leads today.</p>
      </div>
      
      <DashboardMetricsOverview data={dashboardData?.overview} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LeadsByStatusSection data={dashboardData?.chartData?.leadsByStatus} />
          <PipelineSummaryStats data={dashboardData?.chartData?.monthlyTrends} />
        </div>
        <div className="space-y-6">
          <QuickActionsPanel />
          <UpcomingFollowUpsSection data={dashboardData?.upcomingFollowUps} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;