import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { getProjectDashboardData } from '../../api/projects';

export default function ScanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getProjectDashboardData(id);
        setData(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [id]);

  if (loading) return <div className="flex h-full items-center justify-center"><Loader2 size={48} className="animate-spin text-blue-500" /></div>;
  if (!data || !data.scan) return <div className="text-white text-center flex h-full items-center justify-center">Erreur : Scan introuvable.</div>;
  
  const scan = data.scan;
  const vulns = data.vulnerabilities || [];
  
  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };
  vulns.forEach(v => { if (counts[v.severity] !== undefined) counts[v.severity]++; });
  
  const totalVulns = vulns.length;
  const score = scan.global_score || 0;
  
  let grade = 'A';
  let gradeColor = 'text-green-500 bg-green-500/20';
  if (score < 90) { grade = 'B'; gradeColor = 'text-blue-500 bg-blue-500/20'; }
  if (score < 75) { grade = 'C'; gradeColor = 'text-yellow-500 bg-yellow-500/20'; }
  if (score < 50) { grade = 'D'; gradeColor = 'text-orange-500 bg-orange-500/20'; }
  if (score < 30) { grade = 'F'; gradeColor = 'text-red-500 bg-red-500/20'; }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => navigate('/dashboard/overview')} className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-4">
        <ArrowLeft size={16} /> Retour aux projets
      </button>

      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Détails du Scan</h2>
          <p className="text-gray-400 text-sm">Analyse de sécurité - {scan.source_path}</p>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-2 bg-[#111623] px-3 py-1.5 rounded-lg border border-gray-800">
          <Clock size={14} /> {new Date(scan.started_at).toLocaleString('fr-FR')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-2">Score de Sécurité</p>
          <div className="flex items-end gap-2">
            <span className={`text-5xl font-bold ${gradeColor.split(' ')[0]}`}>{score}</span>
            <span className="text-gray-500 mb-1 text-lg">/100</span>
          </div>
          <span className={`inline-block mt-3 text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wide ${gradeColor}`}>
            Grade {grade}
          </span>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-4">Vulnérabilités Critiques</p>
          <div className="flex items-center gap-4">
            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <span className="text-5xl font-bold text-white">{counts.CRITICAL}</span>
          </div>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-4">Vulnérabilités Hautes</p>
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
              <AlertTriangle size={28} className="text-orange-500" />
            </div>
            <span className="text-5xl font-bold text-white">{counts.HIGH}</span>
          </div>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-400 text-sm mb-4">Total Vulnérabilités</p>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <Shield size={28} className="text-blue-500" />
            </div>
            <span className="text-5xl font-bold text-white">{totalVulns}</span>
          </div>
            <button 
                onClick={() => navigate(`/dashboard/scan/${id}/vulnerabilities`)}
                className="mt-auto w-full bg-[#161d2d] hover:bg-blue-600 border border-gray-800 hover:border-blue-500 text-white py-2 rounded-lg text-sm font-bold transition flex justify-center items-center gap-2"
            >
                Voir le détail
            </button>
        </div>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold text-white mb-6 w-full text-left">Répartition par Sévérité</h3>
          
          <div className="w-full space-y-4">
             <div className="flex justify-between items-center bg-[#161d2d] p-3 rounded-lg border border-red-500/20">
                <span className="text-red-500 font-bold flex items-center gap-2"><AlertTriangle size={16}/> Critique</span>
                <span className="text-white font-bold">{counts.CRITICAL}</span>
             </div>
             <div className="flex justify-between items-center bg-[#161d2d] p-3 rounded-lg border border-orange-500/20">
                <span className="text-orange-500 font-bold flex items-center gap-2"><AlertTriangle size={16}/> Haute</span>
                <span className="text-white font-bold">{counts.HIGH}</span>
             </div>
             <div className="flex justify-between items-center bg-[#161d2d] p-3 rounded-lg border border-yellow-500/20">
                <span className="text-yellow-500 font-bold flex items-center gap-2"><AlertTriangle size={16}/> Moyenne</span>
                <span className="text-white font-bold">{counts.MEDIUM}</span>
             </div>
             <div className="flex justify-between items-center bg-[#161d2d] p-3 rounded-lg border border-blue-500/20">
                <span className="text-blue-500 font-bold flex items-center gap-2"><Shield size={16}/> Basse</span>
                <span className="text-white font-bold">{counts.LOW}</span>
             </div>
          </div>
        </div>

        <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Informations du Scan</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nom du Projet</p>
              <p className="text-sm text-white font-medium bg-[#161d2d] p-2 rounded border border-gray-800">{scan.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Dépôt Git</p>
              <p className="text-sm text-blue-400 font-mono bg-[#161d2d] p-2 rounded border border-gray-800 break-all">{scan.source_path}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Statut du Scan</p>
              <p className={`text-sm font-bold p-2 rounded border inline-block ${scan.status === 'COMPLETED' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'}`}>
                {scan.status}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}