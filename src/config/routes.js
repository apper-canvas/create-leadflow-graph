import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import LeadsPage from '@/components/pages/LeadsPage';
import AddLeadPage from '@/components/pages/AddLeadPage';
import PipelinePage from '@/components/pages/PipelinePage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
component: DashboardPage
  },
  leads: {
    id: 'leads',
    label: 'Leads',
    path: '/leads',
    icon: 'Users',
component: LeadsPage
  },
  addLead: {
    id: 'addLead',
    label: 'Add Lead',
    path: '/add-lead',
    icon: 'UserPlus',
component: AddLeadPage
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'GitBranch',
component: PipelinePage
  }
};

export const routeArray = Object.values(routes);