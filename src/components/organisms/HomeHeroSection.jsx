import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomeHeroSection = ({ navigate }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
        >
            <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                    <ApperIcon name="Zap" className="w-10 h-10 text-white" />
                </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    LeadFlow Pro
                </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Streamline your sales process with our comprehensive lead management system. 
                Track prospects, manage your pipeline, and convert more leads into customers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                    <ApperIcon name="BarChart3" className="w-5 h-5" />
                    <span>View Dashboard</span>
                </Button>
                
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/add-lead')}
                    className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2"
                >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span>Add First Lead</span>
                </Button>
            </div>
        </motion.div>
    );
};

export default HomeHeroSection;