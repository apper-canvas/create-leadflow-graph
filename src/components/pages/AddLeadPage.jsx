import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import AddLeadForm from '@/components/organisms/AddLeadForm';
import { leadService, teamMemberService } from '@/services';

function AddLeadPage() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const result = await teamMemberService.getAll();
      setTeamMembers(result);
    } catch (err) {
      console.error('Failed to load team members:', err);
      toast.error('Failed to load team members for assignment');
    }
  };

  const handleCreateLead = async (formData) => {
    setLoading(true);
    try {
      const leadData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        followUpDate: formData.status === 'Contacted' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      };
      
      await leadService.create(leadData);
      toast.success('Lead created successfully');
      navigate('/leads');
    } catch (err) {
      toast.error('Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/leads')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              <span>Back to Leads</span>
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-gray-600 mt-1">Create a new lead entry in your sales pipeline</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <AddLeadForm
            teamMembers={teamMembers}
            onSubmit={handleCreateLead}
            onCancel={() => navigate('/leads')}
            loading={loading}
          />
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-primary/5 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">Tips for Better Lead Management</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fill in as much information as possible for better tracking</li>
                <li>• Assign leads to team members to ensure follow-up</li>
                <li>• Use detailed notes to capture important context</li>
                <li>• Set the initial status based on your current interaction</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AddLeadPage;