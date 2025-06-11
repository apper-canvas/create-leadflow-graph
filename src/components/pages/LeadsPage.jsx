import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import LoadingSpinner from '../atoms/LoadingSpinner';
import LeadsTable from '../organisms/LeadsTable';
import AddLeadModal from '../organisms/AddLeadModal';
import PaginationControls from '../molecules/PaginationControls';
import leadService from '../../services/api/leadService';
import { toast } from 'react-toastify';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    assigned_to: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1
  });

  // Load leads data
  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getAll(filters);
      setLeads(response.data || []);
      setPagination({
        total: response.total || 0,
        totalPages: response.totalPages || 0,
        currentPage: response.page || 1
      });
      setError(null);
    } catch (err) {
      setError('Failed to load leads');
      console.error('Error loading leads:', err);
      toast.error('Failed to load leads');
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
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle lead creation
  const handleLeadCreated = () => {
    setShowAddModal(false);
    loadLeads(); // Refresh the list
  };

  // Handle lead update
  const handleLeadUpdated = () => {
    loadLeads(); // Refresh the list
  };

  // Handle lead deletion
  const handleLeadDeleted = () => {
    loadLeads(); // Refresh the list
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all your leads in one place
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            options={statusOptions}
          />
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">
              {pagination.total} total leads
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
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
        <>
          <LeadsTable 
            leads={leads}
            onUpdate={handleLeadUpdated}
            onDelete={handleLeadDeleted}
          />
          
          {pagination.totalPages > 1 && (
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
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

export default LeadsPage;