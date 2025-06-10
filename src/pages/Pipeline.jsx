import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';
import { leadService, teamMemberService } from '../services';
import { toast } from 'react-toastify';

const STATUS_COLUMNS = [
  { 
    id: 'New', 
    title: 'New Leads', 
    color: 'bg-blue-100 border-blue-200',
    headerColor: 'bg-blue-500',
    textColor: 'text-blue-800'
  },
  { 
    id: 'Contacted', 
    title: 'Contacted', 
    color: 'bg-yellow-100 border-yellow-200',
    headerColor: 'bg-yellow-500',
    textColor: 'text-yellow-800'
  },
  { 
    id: 'Qualified', 
    title: 'Qualified', 
    color: 'bg-purple-100 border-purple-200',
    headerColor: 'bg-purple-500',
    textColor: 'text-purple-800'
  },
  { 
    id: 'Won', 
    title: 'Won', 
    color: 'bg-green-100 border-green-200',
    headerColor: 'bg-green-500',
    textColor: 'text-green-800'
  },
  { 
    id: 'Lost', 
    title: 'Lost', 
    color: 'bg-red-100 border-red-200',
    headerColor: 'bg-red-500',
    textColor: 'text-red-800'
  }
];

function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedLead, setDraggedLead] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

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

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (!draggedLead || draggedLead.status === newStatus) {
      setDraggedLead(null);
      return;
    }

    try {
      const updateData = { 
        status: newStatus,
        updatedAt: new Date().toISOString(),
        followUpDate: newStatus === 'Contacted' ? 
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      };
      
      await leadService.update(draggedLead.id, updateData);
      setLeads(prev => prev.map(lead => 
        lead.id === draggedLead.id ? { ...lead, ...updateData } : lead
      ));
      toast.success(`Lead moved to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update lead status');
    } finally {
      setDraggedLead(null);
    }
  };

  const calculateColumnValue = (status) => {
    const statusLeads = getLeadsByStatus(status);
    return statusLeads.length;
  };

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
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalLeads = leads.length;
  const totalValue = leads.filter(lead => lead.status === 'Won').length;

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
        <p className="text-gray-600 mt-1">Track leads through your sales process</p>
        
        {/* Pipeline Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
                <p className="text-sm text-gray-600">Total Leads</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Trophy" className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalValue}</p>
                <p className="text-sm text-gray-600">Won Deals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalLeads > 0 ? Math.round((totalValue / totalLeads) * 100) : 0}%
                </p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
        {STATUS_COLUMNS.map((column) => {
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
              {/* Column Header */}
              <div className={`${column.headerColor} text-white p-4 rounded-t-lg`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{column.title}</h3>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
                    {columnLeads.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4 space-y-3 min-h-[500px]">
                <AnimatePresence>
                  {columnLeads.map((lead, index) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                        draggedLead?.id === lead.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Lead Name and Company */}
                        <div>
                          <h4 className="font-medium text-gray-900 truncate">
                            {lead.name}
                          </h4>
                          {lead.company && (
                            <p className="text-sm text-gray-600 truncate">
                              {lead.company}
                            </p>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="Mail" className="w-3 h-3" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ApperIcon name="Phone" className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Lead Source */}
                        {lead.leadSource && (
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Tag" className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{lead.leadSource}</span>
                          </div>
                        )}

                        {/* Assignee */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="User" className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {getTeamMemberName(lead.assignedTo)}
                            </span>
                          </div>
                          
                          {lead.followUpDate && (
                            <div className="text-xs text-gray-500">
                              {new Date(lead.followUpDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>

                        {/* Notes Preview */}
                        {lead.notes && (
                          <div className="border-t border-gray-100 pt-2">
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {lead.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
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

export default Pipeline;