import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import TextArea from '../atoms/TextArea';
import FormField from '../molecules/FormField';
import leadService from '../../services/api/leadService';
import { toast } from 'react-toastify';

const AddLeadForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    Name: initialData?.Name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    company: initialData?.company || '',
    lead_source: initialData?.lead_source || '',
    status: initialData?.status || 'New',
    assigned_to: initialData?.assigned_to || '',
    notes: initialData?.notes || '',
    follow_up_date: initialData?.follow_up_date || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (initialData && initialData.Id) {
        // Update existing lead
        result = await leadService.update(initialData.Id, formData);
      } else {
        // Create new lead
        result = await leadService.create(formData);
      }
      
      if (result) {
        // Call the onSubmit callback with result data
        onSubmit(result);
        
        // Reset form if not editing
        if (!initialData) {
          setFormData({
            Name: '',
            email: '',
            phone: '',
            company: '',
            lead_source: '',
            status: 'New',
            assigned_to: '',
            notes: '',
            follow_up_date: ''
          });
        }
      }
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  // Form field options
  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' }
  ];

  const sourceOptions = [
    { value: '', label: 'Select Source' },
    { value: 'Website', label: 'Website' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Email Campaign', label: 'Email Campaign' },
    { value: 'Cold Call', label: 'Cold Call' },
    { value: 'Trade Show', label: 'Trade Show' },
    { value: 'Other', label: 'Other' }
  ];

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
    { value: '3', label: 'Mike Johnson' },
    { value: '4', label: 'Sarah Wilson' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          required
          error={errors.Name}
        >
          <Input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Enter lead name"
            required
          />
        </FormField>

        <FormField
          label="Email"
          required
          error={errors.email}
        >
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </FormField>

        <FormField
          label="Phone"
          error={errors.phone}
        >
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </FormField>

        <FormField
          label="Company"
          required
          error={errors.company}
        >
          <Input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Enter company name"
            required
          />
        </FormField>
      </div>

      {/* Lead Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField label="Lead Source">
          <Select
            name="lead_source"
            value={formData.lead_source}
            onChange={handleChange}
            options={sourceOptions}
          />
        </FormField>

        <FormField label="Status">
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
        </FormField>

        <FormField label="Assigned To">
          <Select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            options={assigneeOptions}
          />
        </FormField>
      </div>

      {/* Follow-up Date */}
      <FormField label="Follow-up Date">
        <Input
          type="date"
          name="follow_up_date"
          value={formData.follow_up_date}
          onChange={handleChange}
        />
      </FormField>

      {/* Notes */}
      <FormField label="Notes">
        <TextArea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes about this lead..."
          rows={4}
        />
      </FormField>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="inline-flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : (initialData ? 'Update Lead' : 'Create Lead')}
        </Button>
      </div>
    </form>
  );
};

export default AddLeadForm;