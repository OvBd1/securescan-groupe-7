import { Clock, AlertTriangle, Shield } from 'lucide-react';

export default function OverviewPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Tableau de Bord</h2>
          <p className="text-gray-400 text-sm">Analyse de sécurité - https://github.com/company/backend-api</p>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-2 bg-[#111623] px-3 py-1.5 rounded-lg border border-gray-800">
          <Clock size={14} /> Dernière analyse : 02/03/2026 11:30:00
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-2">Score de Sécurité</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-yellow-500">72</span>
            <span className="text-gray-500 mb-1 text-lg">/100</span>
          </div>
          <span className="inline-block mt-3 bg-yellow-500 text-[#111623] text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wide">Grade C</span>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-4">Vulnérabilités Critiques</p>
          <div className="flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <span className="text-5xl font-bold text-white">3</span>
          </div>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-4">Vulnérabilités Hautes</p>
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
              <AlertTriangle size={28} className="text-orange-500" />
            </div>
            <span className="text-5xl font-bold text-white">8</span>
          </div>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-4">Total Vulnérabilités</p>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <Shield size={28} className="text-blue-500" />
            </div>
            <span className="text-5xl font-bold text-white">43</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-1">Répartition par Sévérité</h3>
          <p className="text-xs text-gray-400 mb-8">Distribution des vulnérabilités détectées</p>
          
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-8">
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0"></circle>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#eab308" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="60"></circle>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f97316" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="180"></circle>
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="230"></circle>
              </svg>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-gray-300">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Critique: 3</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Haute: 8</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Moyenne: 15</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Basse: 12</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-500"></span> Info: 5</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-1">Mapping OWASP Top 10 : 2025</h3>
          <p className="text-xs text-gray-400 mb-8">Catégorisation selon le standard OWASP</p>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-8">A01</span>
              <div className="flex-1 h-6 bg-[#161d2d] rounded-r-md overflow-hidden relative border-l border-gray-700"><div className="absolute top-0 left-0 h-full bg-red-500 rounded-r-md" style={{ width: '60%' }}></div></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-8">A02</span>
              <div className="flex-1 h-6 bg-[#161d2d] rounded-r-md overflow-hidden relative border-l border-gray-700"><div className="absolute top-0 left-0 h-full bg-orange-500 rounded-r-md" style={{ width: '30%' }}></div></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-8">A03</span>
              <div className="flex-1 h-6 bg-[#161d2d] rounded-r-md overflow-hidden relative border-l border-gray-700"><div className="absolute top-0 left-0 h-full bg-yellow-500 rounded-r-md" style={{ width: '90%' }}></div></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-8">A04</span>
              <div className="flex-1 h-6 bg-[#161d2d] rounded-r-md overflow-hidden relative border-l border-gray-700"><div className="absolute top-0 left-0 h-full bg-green-500 rounded-r-md" style={{ width: '40%' }}></div></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400 w-8">A05</span>
              <div className="flex-1 h-6 bg-[#161d2d] rounded-r-md overflow-hidden relative border-l border-gray-700"><div className="absolute top-0 left-0 h-full bg-green-500 rounded-r-md" style={{ width: '75%' }}></div></div>
            </div>
          </div>
          
          <div className="flex justify-between pl-12 pr-4 mt-2 text-[10px] text-gray-500 font-mono">
            <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span>
          </div>
        </div>
      </div>

      <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-1">Détail des Catégories OWASP</h3>
        <p className="text-xs text-gray-400 mb-6">Vue complète des 10 catégories de risques</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { id: 'A01', name: 'Broken Access Control', val: 12, col: 'text-red-400' },
            { id: 'A02', name: 'Cryptographic Failures', val: 5, col: 'text-orange-400' },
            { id: 'A03', name: 'Injection', val: 18, col: 'text-yellow-400' },
            { id: 'A04', name: 'Insecure Design', val: 7, col: 'text-green-400' },
            { id: 'A05', name: 'Security Misconfiguration', val: 15, col: 'text-green-400' },
            { id: 'A06', name: 'Vulnerable Components', val: 9, col: 'text-teal-400' },
            { id: 'A07', name: 'Authentication Failures', val: 6, col: 'text-blue-400' },
            { id: 'A08', name: 'Software & Data Integrity', val: 4, col: 'text-indigo-400' },
            { id: 'A09', name: 'Logging & Monitoring', val: 3, col: 'text-purple-400' },
            { id: 'A10', name: 'SSRF', val: 2, col: 'text-pink-400' }
          ].map((item) => (
            <div key={item.id} className="bg-[#161d2d] border border-gray-800 p-3 rounded-lg flex flex-col justify-between h-20">
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold ${item.col}`}>{item.id}</span>
                <span className="text-xs font-bold text-white">{item.val}</span>
              </div>
              <span className="text-[10px] text-gray-400 leading-tight">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-white mb-1">Derniers Scans Effectués</h3>
        <p className="text-xs text-gray-400 mb-6">Historique des analyses récentes</p>
        
        <div className="space-y-3">
          {[
            { grade: 'C', repo: 'https://github.com/company/backend-api', date: '02/03/2026 11:30:00', score: 72, crit: 3, high: 8, col: 'text-yellow-500 bg-yellow-500/20' },
            { grade: 'B', repo: 'https://gitlab.com/team/frontend-app', date: '01/03/2026 16:45:00', score: 85, crit: 1, high: 4, col: 'text-green-500 bg-green-500/20' },
            { grade: 'D', repo: 'https://github.com/company/payment-service', date: '28/02/2026 10:15:00', score: 58, crit: 6, high: 12, col: 'text-orange-500 bg-orange-500/20' },
            { grade: 'A', repo: 'https://github.com/company/admin-portal', date: '27/02/2026 15:20:00', score: 91, crit: 0, high: 2, col: 'text-teal-500 bg-teal-500/20' }
          ].map((scan, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#161d2d] border border-gray-800 rounded-lg hover:border-gray-700 transition">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded flex items-center justify-center font-bold text-lg ${scan.col}`}>
                  {scan.grade}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{scan.repo}</p>
                  <p className="text-xs text-gray-500 mt-1">{scan.date} &nbsp; | &nbsp; Score: {scan.score}/100</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">{scan.crit} Critiques</span>
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">{scan.high} Hautes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}