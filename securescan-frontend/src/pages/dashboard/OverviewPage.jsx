import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, AlertTriangle, Trash2, Loader2, Plus } from 'lucide-react';
import { getUserProjects, deleteProjectScan } from '../../api/projects';

export default function OverviewPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return navigate('/login');
      
      const data = await getUserProjects(user.id);
      setProjects(data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet et tout son historique ?")) {
      try {
        await deleteProjectScan(projectId);
        setProjects(projects.filter(p => p.id !== projectId)); 
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 size={48} className="animate-spin text-blue-500" /></div>;
  }

  const totalProjects = projects.length;
  const avgScore = totalProjects > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.global_score || 0), 0) / totalProjects) 
    : 0;
  const totalVulns = projects.reduce((acc, p) => acc + (p.total_vulns || 0), 0);

  let globalGrade = 'A';
  let gradeColor = 'text-green-500';
  if (avgScore < 90) { globalGrade = 'B'; gradeColor = 'text-blue-500'; }
  if (avgScore < 75) { globalGrade = 'C'; gradeColor = 'text-yellow-500'; }
  if (avgScore < 50) { globalGrade = 'D'; gradeColor = 'text-orange-500'; }
  if (avgScore < 30) { globalGrade = 'F'; gradeColor = 'text-red-500'; }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Vue d'ensemble</h2>
          <p className="text-gray-400 text-sm">Posture de sécurité globale de vos projets</p>
        </div>
        <button onClick={() => navigate('/dashboard/soumission')} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition shadow-[0_0_15px_rgba(37,99,235,0.4)]">
          <Plus size={18} /> Nouveau Scan
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-[#111623] border border-gray-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <Shield size={64} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Aucun projet analysé</h3>
          <p className="text-gray-400 mb-6">Commencez par soumettre un repository Git pour lancer votre première analyse.</p>
          <button onClick={() => navigate('/dashboard/soumission')} className="bg-[#161d2d] hover:bg-gray-800 text-white px-6 py-3 rounded-xl border border-gray-700 transition">Lancer une analyse</button>
        </div>
      ) : (
        <>

          <div className="bg-[#111623] border border-gray-800 p-6 rounded-2xl shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Tableau de Bord Sécurité</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-[#161d2d] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-blue-500 mb-2">{avgScore}</span>
                <span className="text-sm text-gray-400">Score Global</span>
              </div>
              <div className="bg-[#161d2d] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${gradeColor} mb-2`}>{globalGrade}</span>
                <span className="text-sm text-gray-400">Grade Moyen</span>
              </div>
              <div className="bg-[#161d2d] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white mb-2">{totalVulns}</span>
                <span className="text-sm text-gray-400">Vulnérabilités Totales</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#161d2d] border border-gray-800 rounded-xl p-6">
                <h4 className="text-sm font-bold text-white mb-6">Par Sévérité</h4>
                <div className="flex items-center gap-8">
                  <div 
                    className="relative w-28 h-28 rounded-full flex items-center justify-center" 
                    style={{ background: 'conic-gradient(#ef4444 0% 30%, #f97316 30% 70%, #eab308 70% 100%)' }}
                  >
                    <div className="w-20 h-20 bg-[#161d2d] rounded-full flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white leading-none">{totalVulns}</span>
                      <span className="text-[10px] text-gray-400">Total</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Haute</span>
                      <span className="text-red-500 font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Moyenne</span>
                      <span className="text-orange-500 font-bold">18</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">Basse</span>
                      <span className="text-yellow-500 font-bold">8</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#161d2d] border border-gray-800 rounded-xl p-6 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-white mb-4">Top OWASP</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">A03: Injection</span>
                      <span className="text-white font-bold">8</span>
                    </div>
                    <div className="w-full bg-[#111623] rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">A01: Access Control</span>
                      <span className="text-white font-bold">6</span>
                    </div>
                    <div className="w-full bg-[#111623] rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">A07: Authentication</span>
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div className="w-full bg-[#111623] rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#161d2d] border border-gray-800 rounded-xl p-6">
              <h4 className="text-sm font-bold text-white mb-4">OWASP Top 10:2025</h4>
              <div className="grid grid-cols-5 gap-3">
                <div className="bg-[#111623] border border-gray-800 rounded-lg py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-red-500 mb-1">A01</span>
                  <span className="text-sm text-gray-300">8</span>
                </div>
                <div className="bg-[#111623] border border-gray-800 rounded-lg py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-orange-500 mb-1">A02</span>
                  <span className="text-sm text-gray-300">6</span>
                </div>
                <div className="bg-[#111623] border border-gray-800 rounded-lg py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-yellow-500 mb-1">A03</span>
                  <span className="text-sm text-gray-300">4</span>
                </div>
                <div className="bg-[#111623] border border-gray-800 rounded-lg py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-blue-500 mb-1">A04</span>
                  <span className="text-sm text-gray-300">2</span>
                </div>
                <div className="bg-[#111623] border border-gray-800 rounded-lg py-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-green-500 mb-1">A05</span>
                  <span className="text-sm text-gray-300">0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-bold text-white mb-4">Historique des Scans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const score = project.global_score || 0;
                const crit = project.critical_vulns || 0;
                
                let colorTheme = "border-gray-800 hover:border-blue-500";
                let scoreColor = "text-white";
                if (score >= 90) { colorTheme = "border-green-500/30 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"; scoreColor = "text-green-500"; }
                else if (score >= 75) { colorTheme = "border-yellow-500/30 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]"; scoreColor = "text-yellow-500"; }
                else if (score < 50) { colorTheme = "border-red-500/30 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"; scoreColor = "text-red-500"; }

                return (
                  <div 
                    key={project.id} 
                    onClick={() => navigate(`/dashboard/scan/${project.id}`)}
                    className={`bg-[#111623] border ${colorTheme} rounded-2xl p-6 cursor-pointer transition duration-300 group flex flex-col relative overflow-hidden`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white truncate pr-4">{project.name}</h3>
                      <button 
                        onClick={(e) => handleDelete(e, project.id)}
                        className="text-gray-500 hover:text-red-500 bg-[#161d2d] p-2 rounded-lg transition z-10"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="text-xs text-blue-400 font-mono mb-6 truncate">{project.source_path}</p>

                    <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-800/50">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Score de Sécurité</p>
                        <p className={`text-3xl font-black ${scoreColor}`}>{score}<span className="text-sm text-gray-500 font-normal">/100</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total Vulns.</p>
                        <p className="text-xl font-bold text-white flex items-center justify-end gap-2">
                          {crit > 0 && <AlertTriangle size={14} className="text-red-500" />}
                          {project.total_vulns || 0}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(project.started_at).toLocaleDateString('fr-FR')}</span>
                      <span className={project.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}>{project.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}