export const STATUS_OPTIONS = [
  { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Qualified', label: 'Qualified', color: 'bg-purple-100 text-purple-800' },
  { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
  { value: 'Won', label: 'Won', color: 'bg-green-100 text-green-800' }
];

export const SOURCE_OPTIONS = [
  'Website', 'Social Media', 'Email Campaign', 'Referral', 'Cold Call', 'Trade Show', 'Other'
];

export const getStatusColorClass = (status) => {
    const statusOption = STATUS_OPTIONS.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
};

export const PIPELINE_STATUS_COLUMNS = [
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