import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';
import SubmissionPage from './pages/dashboard/SubmissionPage';
import OverviewPage from './pages/dashboard/OverviewPage';
import ScanDetailsPage from './pages/dashboard/ScanDetailsPage';
import VulnerabilitiesPage from './pages/dashboard/VulnerabilitiesPage';
// import CorrectionsPage from './pages/dashboard/CorrectionsPage';
// import ReportPage from './pages/dashboard/ReportPage';

export default function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard/soumission" /> : <Navigate to="/login" />} />
        <Route path="/login" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard/soumission" />} />

        {isAuthenticated && (
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="soumission" />} />
            
            <Route path="soumission" element={<SubmissionPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="scan/:id" element={<ScanDetailsPage />} />
            <Route path="scan/:id/vulnerabilities" element={<VulnerabilitiesPage />} />
            {/* <Route path="corrections" element={<CorrectionsPage />} /> */}
            {/* <Route path="rapport" element={<ReportPage />} /> */}
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}