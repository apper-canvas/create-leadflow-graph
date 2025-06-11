import React, { useState } from 'react';
import { Edit2, Trash2, Eye, Phone, Mail, Calendar } from 'lucide-react';
import Button from '../atoms/Button';
import StatusBadge from '../molecules/StatusBadge';
import leadService from '../../services/api/leadService';
import { toast } from 'react-toastify';

const LeadsTable = ({ leads, onUpdate, onDelete }) => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle individual lead selection
  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => {
      if (prev.includes(leadId)) {
        return prev.filter(id => id !== leadId);
      } else {
        return [...prev, leadId];
      }
    });
  };

  // Handle select all leads
  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.Id));
    }
  };

  // Handle lead actions
  const handleEdit = (lead) => {
    console.log('Editing lead:', lead);
    toast.info('Edit functionality will be implemented');
    // In a real app, this would open an edit modal or navigate to edit page
    onUpdate && onUpdate(lead);
  };

  const handleDelete = async (lead) => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.Name}"?`)) {
      setLoading(true);
      try {
        const success = await leadService.delete(lead.Id);
        if (success) {
          onDelete && onDelete(lead.Id);
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (lead) => {
    console.log('Viewing lead:', lead);
    toast.info('View functionality will be implemented');
    // In a real app, this would open a detailed view modal or navigate to lead detail page
  };

  const handleCall = (lead) => {
    if (lead.phone) {
      window.open(`tel:${lead.phone}`);
    } else {
      toast.warning('No phone number available for this lead');
    }
  };

  const handleEmail = (lead) => {
    if (lead.email) {
      window.open(`mailto:${lead.email}`);
    } else {
      toast.warning('No email address available for this lead');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">No leads found</h3>
          <p>Get started by adding your first lead or adjust your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedLeads.length === leads.length && leads.length > 0}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              {selectedLeads.length > 0 ? `${selectedLeads.length} selected` : 'Select all'}
            </span>
          </div>
          {selectedLeads.length > 0 && (
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Bulk Edit
              </Button>
              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Follow Up
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.Id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.Id)}
                      onChange={() => handleSelectLead(lead.Id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {lead.Name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.lead_source || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(lead.follow_up_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleView(lead)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCall(lead)}
                      className="text-gray-600 hover:text-gray-900"
                      disabled={!lead.phone}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEmail(lead)}
                      className="text-gray-600 hover:text-gray-900"
                      disabled={!lead.email}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(lead)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(lead)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
};

export default LeadsTable;