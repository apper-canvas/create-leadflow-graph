import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import AddLead from '../pages/AddLead';
import Pipeline from '../pages/Pipeline';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  },
  leads: {
    id: 'leads',
    label: 'Leads',
    path: '/leads',
    icon: 'Users',
    component: Leads
  },
  addLead: {
    id: 'addLead',
    label: 'Add Lead',
    path: '/add-lead',
    icon: 'UserPlus',
    component: AddLead
  },
  pipeline: {
    id: 'pipeline',
    label: 'Pipeline',
    path: '/pipeline',
    icon: 'GitBranch',
    component: Pipeline
  }
};

export const routeArray = Object.values(routes);