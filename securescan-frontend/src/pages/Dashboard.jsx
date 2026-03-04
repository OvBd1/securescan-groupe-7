import { useState } from 'react';
import { 
  Shield, Upload, LayoutDashboard, AlertTriangle, 
  Wrench, Github, Info, Rocket, FileArchive,LogOut 
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('git');
  const [repoUrl, setRepoUrl] = useState('');

  const handleScan = (e) => {
    e.preventDefault();
    alert("On va bientôt relier ça au backend pour cloner : " + repoUrl);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-white font-sans overflow-hidden">
      <aside className="w-64 bg-[#111623] border-r border-gray-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">SecureScan</h1>
              <p className="text-xs text-gray-400">Security Platform</p>
            </div>
          </div>

          <nav className="mt-4 px-4 space-y-2">
            <a href="#" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl transition">
              <Upload size={18} />
              <span className="font-medium">Soumission</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl transition">
              <LayoutDashboard size={18} />
              <span className="font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl transition">
              <AlertTriangle size={18} />
              <span className="font-medium">Vulnérabilités</span>
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl transition">
              <Wrench size={18} />
              <span className="font-medium">Corrections</span>
            </a>
          </nav>
        </div>

        <div className="px-4 mb-2">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-gray-400 hover:text-red-400 hover:bg-red-400/10 px-4 py-3 rounded-xl transition duration-200">
                <LogOut size={18} />
                <span className="font-medium text-sm">Déconnexion</span>
            </button>
        </div>

        <div className="p-6 text-xs text-gray-500">
          <p>Hackathon</p>
          <p>v1.0.0 - MVP</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-y-auto">
        
        <div className="text-center mb-10">
          <div className="bg-cyan-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Upload size={32} className="text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold mb-3 text-white">Nouvelle Analyse de Sécurité</h2>
          <p className="text-gray-400 text-sm">Analysez votre code source pour détecter les vulnérabilités et risques de sécurité</p>
        </div>

        <div className="bg-[#111623] border border-gray-800 rounded-2xl w-full max-w-3xl p-8 shadow-2xl">
          <h3 className="text-lg font-semibold mb-1">Sélectionnez la source du code</h3>
          <p className="text-sm text-gray-400 mb-6">Importez depuis un repository Git ou uploadez une archive ZIP</p>

          <div className="flex bg-[#0b0f19] rounded-lg p-1 mb-6 border border-gray-800">
            <button 
              onClick={() => setActiveTab('git')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${activeTab === 'git' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <Github size={16} /> Repository Git
            </button>
            <button 
              onClick={() => setActiveTab('zip')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition ${activeTab === 'zip' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <FileArchive size={16} /> Archive ZIP
            </button>
          </div>

          <form onSubmit={handleScan}>
            <label className="block text-sm font-medium text-gray-300 mb-2">URL du Repository</label>
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github size={18} className="text-gray-500" />
              </div>
              <input 
                type="url" 
                required
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository" 
                className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
            <p className="text-xs text-gray-500 mb-6">Formats supportés : GitHub, GitLab, Bitbucket</p>

            <div className="bg-[#161d2d] border border-gray-700/50 rounded-lg p-5 mb-8">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                <Info size={16} className="text-yellow-500" /> Informations :
              </h4>
              <ul className="text-xs text-gray-400 space-y-2 pl-6 list-disc marker:text-gray-600">
                <li>L'analyse peut prendre <span className="text-yellow-500 font-medium">de 2 à 10 minutes</span> selon la taille du projet</li>
                <li>Le repository <span className="text-yellow-500 font-medium">doit être public</span> ou vous devez fournir un token d'accès</li>
                <li>Tous les fichiers seront analysés <span className="text-gray-500">(multi-langages supportés)</span></li>
              </ul>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Rocket size={18} /> Lancer l'Analyse
            </button>
          </form>
        </div>

        <div className="flex gap-4 mt-8 w-full max-w-3xl">
          <div className="flex-1 bg-[#111623] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white mb-1">12,847</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Scans effectués</p>
          </div>
          <div className="flex-1 bg-[#111623] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white mb-1">45,392</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Vulnérabilités</p>
          </div>
          <div className="flex-1 bg-[#111623] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-400 mb-1">98.3%</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Précision</p>
          </div>
        </div>

      </main>
    </div>
  );
}