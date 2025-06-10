import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundContent = ({ navigate }) => {
  return (
    <div className="max-w-md w-full text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* 404 Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Error Message */}
        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Home" className="w-4 h-4" />
            <span>Go Home</span>
          </Button>

          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <ApperIcon name="BarChart3" className="w-4 h-4" />
            <span>View Dashboard</span>
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-4">Or try one of these:</p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/leads')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="Users" className="w-4 h-4" />
              <span>View Leads</span>
            </Button>
            <Button
              onClick={() => navigate('/add-lead')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Lead</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundContent;