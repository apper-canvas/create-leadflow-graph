import React from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/molecules/StatusBadge';
import Button from '@/components/atoms/Button';

const LeadsByStatusSection = ({ metrics, navigate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Leads by Status</h2>
                <Button
                    onClick={() => navigate('/leads')}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                    View All
                </Button>
            </div>

            <div className="space-y-4">
                {Object.entries(metrics.leadsByStatus).map(([status, count]) => {
                    const percentage = metrics.totalLeads > 0 ? (count / metrics.totalLeads) * 100 : 0;
                    
                    const progressBarColor =
                        status === 'Won' ? 'bg-accent' :
                        status === 'Qualified' ? 'bg-secondary' :
                        status === 'Contacted' ? 'bg-yellow-500' :
                        status === 'New' ? 'bg-blue-500' :
                        'bg-red-500';

                    return (
                        <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <StatusBadge status={status} />
                                <span className="text-sm text-gray-600">{count} leads</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                        className={`h-2 rounded-full ${progressBarColor}`}
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                                    {percentage.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                <Button
                    onClick={() => navigate('/pipeline')}
                    className="w-full flex items-center justify-center space-x-2 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                    <ApperIcon name="GitBranch" className="w-4 h-4" />
                    <span>View Pipeline</span>
                </Button>
            </div>
        </motion.div>
    );
};

export default LeadsByStatusSection;