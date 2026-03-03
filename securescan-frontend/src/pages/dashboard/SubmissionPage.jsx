// src/pages/dashboard/SubmissionPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Github, FileArchive, Rocket } from 'lucide-react';

export default function SubmissionPage() {
  const [activeTab, setActiveTab] = useState('git');
  const [repoUrl, setRepoUrl] = useState('');
  const navigate = useNavigate();

  const handleScan = (e) => {
    e.preventDefault();
    // Plus tard : appel API backend ici
    navigate('/dashboard/overview'); // Redirection vers le dashboard après scan
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="bg-cyan-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <Upload size={32} className="text-cyan-400" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">Nouvelle Analyse de Sécurité</h2>
        <p className="text-gray-400 text-sm">Analysez votre code source pour détecter les vulnérabilités</p>
      </div>

      <div className="bg-[#111623] border border-gray-800 rounded-2xl w-full p-8 shadow-2xl">
        {/* Tes boutons d'onglets (Git / Zip) ... */}
        <div className="flex bg-[#0b0f19] rounded-lg p-1 mb-6 border border-gray-800">
          <button onClick={() => setActiveTab('git')} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'git' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <Github size={16} /> Repository Git
          </button>
          <button onClick={() => setActiveTab('zip')} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'zip' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <FileArchive size={16} /> Archive ZIP
          </button>
        </div>

        <form onSubmit={handleScan}>
          <label className="block text-sm font-medium text-gray-300 mb-2">URL du Repository</label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github size={18} className="text-gray-500" />
            </div>
            <input type="url" required value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/username/repository" className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 transition" />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition duration-200">
            <Rocket size={18} /> Lancer l'Analyse
          </button>
        </form>
      </div>
    </div>
  );
}