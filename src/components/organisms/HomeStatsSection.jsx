import React from 'react';
import { motion } from 'framer-motion';

const HomeStatsSection = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
        >
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Why Choose LeadFlow Pro?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">100%</div>
                    <div className="text-gray-600">Lead Tracking</div>
                </div>
                
                <div className="text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">Real-time</div>
                    <div className="text-gray-600">Analytics</div>
                </div>
                
                <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">Easy</div>
                    <div className="text-gray-600">Team Collaboration</div>
                </div>
            </div>
        </motion.div>
    );
};

export default HomeStatsSection;