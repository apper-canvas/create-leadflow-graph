import React, { useState, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../atoms/Button';
import Select from '../atoms/Select';
import LoadingSpinner from '../atoms/LoadingSpinner';
import PipelineBoard from '../organisms/PipelineBoard';
import AddLeadModal from '../organisms/AddLeadModal';
import leadService from '../../services/api/leadService';
import { toast } from 'react-toastify';

const PipelinePage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [filters, setFilters] = useState({
    assigned_to: '',
    source: ''
  });

  // Load leads data
  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAll({ 
        limit: 100, // Get more leads for pipeline view
        ...filters 
      });
      setLeads(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load pipeline data');
      console.error('Error loading pipeline:', err);
      toast.error('Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  // Effect to load leads when filters change
  useEffect(() => {
    loadLeads();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle lead creation
  const handleLeadCreated = () => {
    setShowAddModal(false);
    loadLeads(); // Refresh the pipeline
  };

  // Handle lead status update
  const handleLeadStatusUpdate = () => {
    loadLeads(); // Refresh the pipeline
  };

  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
    { value: '3', label: 'Mike Johnson' }
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'Website', label: 'Website' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Email Campaign', label: 'Email Campaign' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track leads through your sales process
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-600 mr-4">Filter by:</span>
          </div>
          <Select
            value={filters.assigned_to}
            onChange={(e) => handleFilterChange('assigned_to', e.target.value)}
            options={assigneeOptions}
            className="min-w-[150px]"
          />
          <Select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            options={sourceOptions}
            className="min-w-[150px]"
          />
        </div>
      </div>

      {/* Pipeline Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadLeads} variant="outline">
            Try Again
          </Button>
        </div>
      ) : (
        <PipelineBoard 
          leads={leads}
          onLeadUpdate={handleLeadStatusUpdate}
        />
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onLeadCreated={handleLeadCreated}
        />
      )}
    </div>
);
};

export default PipelinePage;