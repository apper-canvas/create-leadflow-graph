import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActionsPanel = ({ navigate }) => {
    const actions = [
        {
            icon: 'UserPlus',
            title: 'Add New Lead',
            description: 'Create a new lead entry',
            action: () => navigate('/add-lead'),
            color: 'primary'
        },
        {
            icon: 'Users',
            title: 'Manage Leads',
            description: 'Update lead statuses',
            action: () => navigate('/leads'),
            color: 'secondary'
        },
        {
            icon: 'GitBranch',
            title: 'View Pipeline',
            description: 'Visualize sales process',
            action: () => navigate('/pipeline'),
            color: 'accent'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6"
        >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.action}
                        className="flex items-center space-x-3 p-4 bg-white rounded-lg hover:shadow-sm transition-all"
                    >
                        <div className={`w-10 h-10 bg-${action.color}/10 rounded-lg flex items-center justify-center`}>
                            <ApperIcon name={action.icon} className={`w-5 h-5 text-${action.color}`} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-medium text-gray-900">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                    </Button>
                ))}
            </div>
        </motion.div>
    );
};

export default QuickActionsPanel;