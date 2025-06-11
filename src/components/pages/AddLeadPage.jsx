import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import AddLeadForm from '@/components/organisms/AddLeadForm';

const AddLeadPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/leads');
  };

  const handleLeadCreated = (leadData) => {
    console.log('Lead created:', leadData);
    // Navigate back to leads page after successful creation
    navigate('/leads');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
          <p className="text-sm text-gray-500">
            Fill in the information below to create a new lead
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <AddLeadForm onSubmit={handleLeadCreated} />
      </div>
    </div>
  );
};

export default AddLeadPage;