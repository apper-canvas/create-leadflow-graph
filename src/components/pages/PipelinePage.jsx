import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PipelineSummaryStats from '@/components/organisms/PipelineSummaryStats';
import PipelineBoard from '@/components/organisms/PipelineBoard';
import { leadService, teamMemberService } from '@/services';

function PipelinePage() {
  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsResult, teamResult] = await Promise.all([
        leadService.getAll(),
        teamMemberService.getAll()
      ]);
      setLeads(leadsResult);
      setTeamMembers(teamResult);
    } catch (err) {
      setError(err.message || 'Failed to load pipeline data');
      toast.error('Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      const updateData = { 
        status: newStatus,
        updatedAt: new Date().toISOString(),
        followUpDate: newStatus === 'Contacted' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      };
      
      await leadService.update(leadId, updateData);
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updateData } : lead
      ));
      toast.success(`Lead moved to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  const totalLeads = leads.length;
  const wonDealsCount = leads.filter(lead => lead.status === 'Won').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-lg"></div>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ))}
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Pipeline</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
        <p className="text-gray-600 mt-1">Track leads through your sales process</p>
        
        <PipelineSummaryStats totalLeads={totalLeads} wonDealsCount={wonDealsCount} />
      </div>

      <PipelineBoard leads={leads} teamMembers={teamMembers} onUpdateLeadStatus={handleUpdateLeadStatus} />

      {/* Drag Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-primary/5 rounded-lg p-4"
      >
        <div className="flex items-center space-x-3">
          <ApperIcon name="MousePointer" className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Pipeline Management</h3>
            <p className="text-sm text-gray-600">
              Drag and drop leads between columns to update their status. 
              Changes are automatically saved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PipelinePage;