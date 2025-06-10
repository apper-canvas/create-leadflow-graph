import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import PaginationControls from '@/components/molecules/PaginationControls';
import { STATUS_OPTIONS, SOURCE_OPTIONS, getStatusColorClass } from '@/config/constants';

const LeadsTable = ({ leads, teamMembers, onUpdateStatus, onAssignLead, onDeleteLead, onAddLeadClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getTeamMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unassigned';
  };

  const filteredAndSortedLeads = leads
    .filter(lead => {
      const matchesSearch = !searchQuery || 
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.notes?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || lead.status === statusFilter;
      const matchesAssignee = !assigneeFilter || lead.assignedTo === assigneeFilter;
      const matchesSource = !sourceFilter || lead.leadSource === sourceFilter;
      
      return matchesSearch && matchesStatus && matchesAssignee && matchesSource;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const currentLeads = filteredAndSortedLeads.slice(startIndex, startIndex + leadsPerPage);

  return (
    <div>
      {/* Filters */}
      <div className="bg-surface-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads..."
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
            <Select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              options={[{ value: '', label: 'All Assignees' }, { value: '', label: 'Unassigned' }, ...teamMembers.map(member => ({ value: member.id, label: member.name }))]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              options={[{ value: '', label: 'All Sources' }, ...SOURCE_OPTIONS.map(s => ({ value: s, label: s }))]}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                setAssigneeFilter('');
                setSourceFilter('');
              }}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      {currentLeads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <ApperIcon name="Users" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first lead</p>
          <Button
            onClick={onAddLeadClick}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Lead
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'email', label: 'Email' },
                    { key: 'company', label: 'Company' },
                    { key: 'leadSource', label: 'Source' },
                    { key: 'status', label: 'Status' },
                    { key: 'assignedTo', label: 'Assigned To' },
                    { key: 'createdAt', label: 'Created' }
                  ].map(column => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {sortField === column.key && (
                          <ApperIcon 
                            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                            className="w-3 h-3" 
                          />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 break-words">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.leadSource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                        options={STATUS_OPTIONS}
                        className={`px-2 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusColorClass(lead.status)}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        value={lead.assignedTo || ''}
                        onChange={(e) => onAssignLead(lead.id, e.target.value)}
                        options={[{ value: '', label: 'Unassigned' }, ...teamMembers.map(member => ({ value: member.id, label: member.name }))]}
                        className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        onClick={() => onDeleteLead(lead.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalResults={filteredAndSortedLeads.length}
              itemsPerPage={leadsPerPage}
              startIndex={startIndex}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsTable;