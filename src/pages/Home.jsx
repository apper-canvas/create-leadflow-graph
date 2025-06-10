import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

function Home() {
  const navigate = useNavigate();

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
    <div className="min-h-full bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
            >
              <ApperIcon name="BarChart3" className="w-5 h-5" />
              <span>View Dashboard</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-lead')}
              className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg font-medium hover:bg-primary/5 transition-colors flex items-center justify-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span>Add First Lead</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Features Grid */}
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

        {/* Stats Section */}
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
      </div>
    </div>
  );
}

export default Home;