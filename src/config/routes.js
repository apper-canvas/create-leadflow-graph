import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import LeadsPage from '@/components/pages/LeadsPage';
import PipelinePage from '@/components/pages/PipelinePage';
import AddLeadPage from '@/components/pages/AddLeadPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = [
  {
    path: '/',
    component: HomePage,
    title: 'Home',
    showInNav: true,
    icon: 'Home'
  },
{
    path: '/dashboard',
    component: DashboardPage,
    title: 'Dashboard',
    showInNav: true,
  },
  {
    path: '/leads',
    component: LeadsPage,
    title: 'Leads',
    showInNav: true,
    icon: 'Users'
  },
  {
    path: '/add-lead',
    component: AddLeadPage,
    title: 'Add Lead',
    showInNav: false
  },
  {
    path: '/leads/:id',
    component: () => <div>Lead Details Page - Timeline component would be here</div>,
    title: 'Lead Details',
    showInNav: false
  },
  {
    path: '*',
    component: NotFoundPage,
    title: 'Not Found',
    showInNav: false
  }
];

export default routes;