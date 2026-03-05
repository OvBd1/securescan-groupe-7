import { createBrowserRouter } from 'react-router';
import { DashboardLayout } from './layouts/DashboardLayout';
import Submission from './pages/Submission';
import Dashboard from './pages/Dashboard';
import Vulnerabilities from './pages/Vulnerabilities';
import Corrections from './pages/Corrections';
import Report from './pages/Report';
import Auth from './pages/Auth';

export const router = createBrowserRouter([
  {
    path: '/auth',
    Component: Auth,
  },
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      { index: true, Component: Submission },
      { path: 'dashboard', Component: Dashboard },
      { path: 'vulnerabilities', Component: Vulnerabilities },
      { path: 'corrections', Component: Corrections },
      { path: 'report', Component: Report },
    ],
  },
]);