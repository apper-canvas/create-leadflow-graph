import React from 'react';
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