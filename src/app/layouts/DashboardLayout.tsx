import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { Shield, Upload, LayoutDashboard, AlertTriangle, Code2, FileText, Github, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Soumission', href: '/', icon: Upload },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Vulnérabilités', href: '/vulnerabilities', icon: AlertTriangle },
    { name: 'Corrections', href: '/corrections', icon: Code2 },
    { name: 'Rapport & Git', href: '/report', icon: FileText },
  ];

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-white">SecureScan</h1>
              <p className="text-xs text-gray-400">Security Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-400 hover:bg-red-900/20 hover:text-red-400 hover:border-red-800"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <Github className="w-3 h-3" />
              <span>Hackathon CyberSécurité</span>
            </div>
            <div>v1.0.0 - MVP</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}