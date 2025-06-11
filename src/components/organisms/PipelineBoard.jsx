import React, { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import LeadCard from '../molecules/LeadCard';
import PipelineColumnHeader from '../molecules/PipelineColumnHeader';
import Button from '../atoms/Button';
import leadService from '../../services/api/leadService';
import { toast } from 'react-toastify';

const PipelineBoard = ({ leads = [], onLeadUpdate }) => {
  const [draggedLead, setDraggedLead] = useState(null);
  const [loading, setLoading] = useState(false);

  // Define pipeline stages
  const stages = [
    { id: 'New', name: 'New', color: 'bg-blue-500' },
    { id: 'Contacted', name: 'Contacted', color: 'bg-yellow-500' },
    { id: 'Qualified', name: 'Qualified', color: 'bg-green-500' },
    { id: 'Won', name: 'Won', color: 'bg-emerald-500' },
    { id: 'Lost', name: 'Lost', color: 'bg-red-500' }
  ];

  // Group leads by status
  const groupedLeads = stages.reduce((acc, stage) => {
    acc[stage.id] = leads.filter(lead => lead.status === stage.id);
    return acc;
  }, {});

  // Calculate stage metrics
  const getStageMetrics = (stageId) => {
    const stageLeads = groupedLeads[stageId] || [];
    const count = stageLeads.length;
    const value = stageLeads.reduce((sum, lead) => {
      // Estimate value based on stage (this would come from opportunity data in real app)
      const baseValue = 50000; // Base opportunity value
      const stageMultiplier = {
        'New': 0.1,
        'Contacted': 0.3,
        'Qualified': 0.6,
        'Won': 1.0,
        'Lost': 0
      };
      return sum + (baseValue * (stageMultiplier[stageId] || 0));
    }, 0);
    return { count, value };
  };

  // Handle drag operations
  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    
    if (!draggedLead) return;
    
    // Don't do anything if dropped on same status
    if (draggedLead.status === targetStatus) {
      setDraggedLead(null);
      return;
    }

    setLoading(true);
    try {
      // Update lead status using the service
      const updatedLead = await leadService.updateStatus(draggedLead.Id, targetStatus);
      
      if (updatedLead) {
        console.log(`Moving lead ${draggedLead.Name} from ${draggedLead.status} to ${targetStatus}`);
        
        // Call the update callback
        if (onLeadUpdate) {
          onLeadUpdate(updatedLead);
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setLoading(false);
      setDraggedLead(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
  };

  const handleAddLead = (status) => {
    console.log(`Adding new lead to ${status} stage`);
    toast.info('Add lead functionality will be implemented');
  };

  const handleEditLead = (lead) => {
    console.log('Editing lead:', lead);
    toast.info('Edit functionality will be implemented');
  };

  const handleDeleteLead = async (lead) => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.Name}"?`)) {
      setLoading(true);
      try {
        const success = await leadService.delete(lead.Id);
        if (success && onLeadUpdate) {
          onLeadUpdate();
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-6">
      {stages.map((stage) => {
        const metrics = getStageMetrics(stage.id);
        const stageLeads = groupedLeads[stage.id] || [];
        
        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            {/* Column Header */}
            <PipelineColumnHeader
              title={stage.name}
              count={metrics.count}
              value={metrics.value}
              color={stage.color}
            />

            {/* Column Content */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[600px] space-y-3">
              {/* Add Lead Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddLead(stage.id)}
                className="w-full justify-start text-gray-600 hover:text-gray-900 border-2 border-dashed border-gray-300 hover:border-gray-400"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>

              {/* Lead Cards */}
              {stageLeads.map((lead) => (
                <div
                  key={lead.Id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  onDragEnd={handleDragEnd}
                  className="cursor-move"
                >
                  <LeadCard
                    lead={{
                      ...lead,
                      id: lead.Id, // Map Id to id for compatibility
                      name: lead.Name // Map Name to name for compatibility
                    }}
                    showActions={true}
                    onEdit={() => handleEditLead(lead)}
                    onDelete={() => handleDeleteLead(lead)}
                  />
                </div>
              ))}

              {/* Empty State */}
              {stageLeads.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No leads in this stage</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;