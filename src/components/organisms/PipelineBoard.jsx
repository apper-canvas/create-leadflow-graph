import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PipelineColumnHeader from '@/components/molecules/PipelineColumnHeader';
import LeadCard from '@/components/molecules/LeadCard';
import { PIPELINE_STATUS_COLUMNS } from '@/config/constants';
const PipelineBoard = ({ leads, teamMembers, onUpdateLeadStatus, onLeadClick }) => {
  const [draggedLead, setDraggedLead] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const getTeamMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unassigned';
  };

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status);
  };

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    onUpdateLeadStatus(draggedLead.id, newStatus);
    setDraggedLead(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
      {PIPELINE_STATUS_COLUMNS.map((column) => {
        const columnLeads = getLeadsByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;
        
        return (
          <div
            key={column.id}
            className={`min-h-[600px] ${column.color} rounded-lg border-2 transition-colors ${
              isDragOver ? 'border-primary shadow-lg' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <PipelineColumnHeader title={column.title} count={columnLeads.length} headerColorClass={column.headerColor} />

            <div className="p-4 space-y-3 min-h-[500px]">
              <AnimatePresence>
{columnLeads.map((lead, index) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    getTeamMemberName={getTeamMemberName}
                    onDragStart={handleDragStart}
                    isDragged={draggedLead?.id === lead.id}
                    index={index}
                    onLeadClick={onLeadClick}
                  />
                ))}
              </AnimatePresence>

              {columnLeads.length === 0 && (
                <div className="text-center py-12">
                  <ApperIcon name="Inbox" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No leads in {column.title.toLowerCase()}</p>
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