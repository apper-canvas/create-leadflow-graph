import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { dashboardService } from '@/services';
import DashboardMetricsOverview from '@/components/organisms/DashboardMetricsOverview';
import LeadsByStatusSection from '@/components/organisms/LeadsByStatusSection';
import UpcomingFollowUpsSection from '@/components/organisms/UpcomingFollowUpsSection';
import QuickActionsPanel from '@/components/organisms/QuickActionsPanel';
import Button from '@/components/atoms/Button';

function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardService.getMetrics();
      setMetrics(result);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-lg"></div>
            <div className="h-80 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={loadMetrics}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your sales performance and lead pipeline</p>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-lead')}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Lead</span>
        </Button>
      </div>

      <DashboardMetricsOverview metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsByStatusSection metrics={metrics} totalLeads={metrics.totalLeads} navigate={navigate} />
        <UpcomingFollowUpsSection upcomingFollowUps={metrics.upcomingFollowUps} navigate={navigate} />
      </div>

      <QuickActionsPanel navigate={navigate} />
    </div>
  );
}

export default DashboardPage;