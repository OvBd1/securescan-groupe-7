import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Clock, AlertTriangle, Trash2, ArrowRight, Loader2, Plus } from 'lucide-react';
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

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Mes Projets</h2>
          <p className="text-gray-400 text-sm">Gérez vos analyses de sécurité et accédez aux rapports</p>
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
      )}
    </div>
  );
}