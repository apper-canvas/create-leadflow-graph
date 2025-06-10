import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LeadsTable from '@/components/organisms/LeadsTable';
import AddLeadModal from '@/components/organisms/AddLeadModal';
import { leadService, teamMemberService } from '@/services';

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load leads data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (newLeadData) => {
    try {
      const leadData = {
        ...newLeadData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        followUpDate: newLeadData.status === 'Contacted' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      };
      
      const created = await leadService.create(leadData);
      setLeads(prev => [created, ...prev]);
      setShowAddModal(false);
      toast.success('Lead created successfully');
    } catch (err) {
      toast.error('Failed to create lead');
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
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
      toast.success('Lead status updated');
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  const handleAssignLead = async (leadId, assigneeId) => {
    try {
      const updateData = { 
        assignedTo: assigneeId,
        updatedAt: new Date().toISOString()
      };
      
      await leadService.update(leadId, updateData);
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updateData } : lead
      ));
      toast.success('Lead assigned successfully');
    } catch (err) {
      toast.error('Failed to assign lead');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    try {
      await leadService.delete(leadId);
      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Leads</h3>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Lead Management</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Lead</span>
        </Button>
      </div>

      <LeadsTable
        leads={leads}
        teamMembers={teamMembers}
        onUpdateStatus={handleUpdateStatus}
        onAssignLead={handleAssignLead}
        onDeleteLead={handleDeleteLead}
        onAddLeadClick={() => setShowAddModal(true)}
      />

      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        teamMembers={teamMembers}
        onLeadCreated={handleCreateLead}
      />
    </div>
  );
}

export default LeadsPage;