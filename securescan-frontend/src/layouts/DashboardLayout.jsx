import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Upload, LayoutDashboard, AlertTriangle, Wrench, FileText, LogOut } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex h-screen bg-[#0b0f19] text-white font-sans overflow-hidden">
      
      <aside className="w-64 bg-[#111623] border-r border-gray-800 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          <div className="p-6 flex items-center gap-3">
            <img src="/iconSecureScan.png" alt="SecureScan" className="w-9 h-10"/>
            <div>
              <h1 className="text-xl font-bold tracking-wide">SecureScan</h1>
              <p className="text-xs text-gray-400">Security Platform</p>
            </div>
          </div>

          <nav className="mt-2 px-4 space-y-2">
            <Link to="/dashboard/soumission" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('soumission') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-[#161d2d]'}`}>
              <Upload size={18} /> <span className="font-medium">Soumission</span>
            </Link>
            <Link to="/dashboard/overview" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive('overview') ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-[#161d2d]'}`}>
              <LayoutDashboard size={18} /> <span className="font-medium">Dashboard</span>
            </Link>
          </nav>
        </div>

        <div>
          <div className="px-4 mb-2">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 px-4 py-3 rounded-xl transition duration-200">
              <LogOut size={18} /> <span className="font-medium text-sm">Déconnexion</span>
            </button>
          </div>
          <div className="p-6 pt-2 text-xs text-gray-600 border-t border-gray-800">
            <p>Hackathon</p>
            <p>v1.0.0 - MVP</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto w-full">
        <Outlet /> 
      </main>
    </div>
  );
}