import React, { useState } from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ApperIcon from '@/components/ApperIcon';
import { STATUS_OPTIONS, SOURCE_OPTIONS } from '@/config/constants';

const AddLeadForm = ({ initialData, teamMembers, onSubmit, onCancel, loading, isModal = false }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    phone: '',
    company: '',
    leadSource: '',
    status: 'New',
    assignedTo: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[\+\-\s\(\)\d]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        {!isModal && (
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Contact Information
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            id="name"
            value={formData.name}
            onChange={(val) => handleInputChange('name', val)}
            error={errors.name}
            required
          />
          <FormField
            label="Email Address"
            id="email"
            type="email"
            value={formData.email}
            onChange={(val) => handleInputChange('email', val)}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Phone Number"
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(val) => handleInputChange('phone', val)}
            error={errors.phone}
          />
          <FormField
            label="Company"
            id="company"
            value={formData.company}
            onChange={(val) => handleInputChange('company', val)}
          />
        </div>
      </div>

      {/* Lead Details */}
      <div className="space-y-4">
        {!isModal && (
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Lead Details
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Lead Source"
            id="leadSource"
            type="select"
            value={formData.leadSource}
            onChange={(val) => handleInputChange('leadSource', val)}
            options={[{ value: '', label: 'Select source...' }, ...SOURCE_OPTIONS.map(s => ({ value: s, label: s }))]}
          />
          <FormField
            label="Initial Status"
            id="status"
            type="select"
            value={formData.status}
            onChange={(val) => handleInputChange('status', val)}
            options={STATUS_OPTIONS}
          />
        </div>

        <FormField
          label="Assign To"
          id="assignedTo"
          type="select"
          value={formData.assignedTo}
          onChange={(val) => handleInputChange('assignedTo', val)}
          options={[{ value: '', label: 'Leave unassigned' }, ...teamMembers.map(member => ({ value: member.id, label: member.name }))]}
        />

        <FormField
          label="Notes"
          id="notes"
          type="textarea"
          rows={4}
          value={formData.notes}
          onChange={(val) => handleInputChange('notes', val)}
        />
      </div>

      {/* Action Buttons */}
      <div className={`flex ${isModal ? 'space-x-3' : 'flex-col sm:flex-row gap-3'} pt-6 border-t border-gray-200`}>
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
        >
          {loading ? (
            <>
              <LoadingSpinner className="w-4 h-4 border-white" />
              <span>Creating Lead...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Create Lead</span>
            </>
          )}
        </Button>
        
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddLeadForm;