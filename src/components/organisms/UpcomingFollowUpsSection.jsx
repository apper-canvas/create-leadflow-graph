import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/molecules/StatusBadge';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const UpcomingFollowUpsSection = ({ upcomingFollowUps, navigate }) => {
    return (
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

            {upcomingFollowUps.length === 0 ? (
                <div className="text-center py-8">
                    <ApperIcon name="Calendar" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No upcoming follow-ups</p>
                    <Button
                        onClick={() => navigate('/leads')}
                        className="mt-2 text-primary text-sm hover:text-primary/80"
                    >
                        Schedule follow-ups
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {upcomingFollowUps.map((lead, index) => (
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
                                <StatusBadge status={lead.status} />
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
                    
                    {upcomingFollowUps.length > 0 && (
                        <Button
                            onClick={() => navigate('/leads')}
                            className="w-full mt-4 py-2 text-center text-primary text-sm hover:bg-primary/5 rounded-lg transition-colors"
                        >
                            View all follow-ups
                        </Button>
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default UpcomingFollowUpsSection;