import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundContent from '@/components/organisms/NotFoundContent';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <NotFoundContent navigate={navigate} />
    </div>
  );
}

export default NotFoundPage;