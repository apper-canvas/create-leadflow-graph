import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import { dashboardService } from '../services';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Dashboard() {
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
          <button
            onClick={loadMetrics}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const statusCards = [
    {
      title: 'Total Leads',
      value: metrics.totalLeads,
      icon: 'Users',
      color: 'primary',
      change: '+12%'
    },
    {
      title: 'New Leads',
      value: metrics.leadsByStatus['New'] || 0,
      icon: 'UserPlus',
      color: 'blue-500',
      change: '+8%'
    },
    {
      title: 'Qualified Leads',
      value: metrics.leadsByStatus['Qualified'] || 0,
      icon: 'UserCheck',
      color: 'secondary',
      change: '+15%'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate}%`,
      icon: 'TrendingUp',
      color: 'accent',
      change: '+3%'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-purple-100 text-purple-800',
      'Lost': 'bg-red-100 text-red-800',
      'Won': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your sales performance and lead pipeline</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-lead')}
          className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Lead</span>
        </motion.button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statusCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                card.color === 'primary' ? 'bg-primary/10' :
                card.color === 'secondary' ? 'bg-secondary/10' :
                card.color === 'accent' ? 'bg-accent/10' :
                'bg-blue-500/10'
              }`}>
                <ApperIcon 
                  name={card.icon} 
                  className={`w-6 h-6 ${
                    card.color === 'primary' ? 'text-primary' :
                    card.color === 'secondary' ? 'text-secondary' :
                    card.color === 'accent' ? 'text-accent' :
                    'text-blue-500'
                  }`} 
                />
              </div>
              <span className="text-sm font-medium text-green-600">{card.change}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-gray-600 text-sm">{card.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Status Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Leads by Status</h2>
            <button
              onClick={() => navigate('/leads')}
              className="text-primary hover:text-primary/80 text-sm font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(metrics.leadsByStatus).map(([status, count]) => {
              const percentage = metrics.totalLeads > 0 ? (count / metrics.totalLeads) * 100 : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                      {status}
                    </span>
                    <span className="text-sm text-gray-600">{count} leads</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-2 rounded-full ${
                          status === 'Won' ? 'bg-accent' :
                          status === 'Qualified' ? 'bg-secondary' :
                          status === 'Contacted' ? 'bg-yellow-500' :
                          status === 'New' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/pipeline')}
              className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <ApperIcon name="GitBranch" className="w-4 h-4" />
              <span>View Pipeline</span>
            </button>
          </div>
        </motion.div>

        {/* Upcoming Follow-ups */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Follow-ups</h2>
            <ApperIcon name="Calendar" className="w-5 h-5 text-gray-400" />
          </div>

          {metrics.upcomingFollowUps.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No upcoming follow-ups</p>
              <button
                onClick={() => navigate('/leads')}
                className="mt-2 text-primary text-sm hover:text-primary/80"
              >
                Schedule follow-ups
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.upcomingFollowUps.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {lead.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {lead.company}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        {format(new Date(lead.followUpDate), 'MMM d')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(lead.followUpDate), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {metrics.upcomingFollowUps.length > 0 && (
                <button
                  onClick={() => navigate('/leads')}
                  className="w-full mt-4 py-2 text-center text-primary text-sm hover:bg-primary/5 rounded-lg transition-colors"
                >
                  View all follow-ups
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/add-lead')}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Add New Lead</h3>
              <p className="text-sm text-gray-600">Create a new lead entry</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/leads')}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Manage Leads</h3>
              <p className="text-sm text-gray-600">Update lead statuses</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/pipeline')}
            className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="GitBranch" className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">View Pipeline</h3>
              <p className="text-sm text-gray-600">Visualize sales process</p>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;