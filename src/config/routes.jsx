import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with the current path as redirect parameter
    return <Navigate to={`/login?redirect=${location.pathname}${location.search}`} replace />;
  }

  return children;
};

// Navigation routes configuration
export const routeArray = [
  {
    id: 'dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'BarChart3'
  },
  {
    id: 'leads',
    path: '/leads',
    label: 'Leads',
    icon: 'Users'
  },
  {
    id: 'addLead',
    path: '/add-lead',
    label: 'Add Lead',
    icon: 'UserPlus'
  },
  {
    id: 'pipeline',
    path: '/pipeline',
    label: 'Pipeline',
    icon: 'GitBranch'
  }
];

export default ProtectedRoute;