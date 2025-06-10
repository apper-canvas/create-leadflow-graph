import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HomeFeaturesGrid = ({ navigate }) => {
    const features = [
        {
            icon: 'Users',
            title: 'Lead Management',
            description: 'Track and organize all your sales leads in one place',
            action: () => navigate('/leads')
        },
        {
            icon: 'BarChart3',
            title: 'Dashboard Analytics',
            description: 'Get insights into your sales pipeline performance',
            action: () => navigate('/dashboard')
        },
        {
            icon: 'GitBranch',
            title: 'Pipeline View',
            description: 'Visualize leads moving through your sales process',
            action: () => navigate('/pipeline')
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
                <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={feature.action}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
                >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <ApperIcon name={feature.icon} className="w-6 h-6 text-primary" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                        {feature.description}
                    </p>
                    
                    <div className="flex items-center text-primary font-medium">
                        <span>Get started</span>
                        <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default HomeFeaturesGrid;