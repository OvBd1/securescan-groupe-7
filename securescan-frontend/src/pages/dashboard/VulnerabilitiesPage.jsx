import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Info, ArrowLeft, Loader2, FileCode, MapPin } from 'lucide-react';
import { getProjectDashboardData } from '../../api/projects';

export default function VulnerabilitiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

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
  if (!data || !data.scan) return <div className="text-white text-center">Erreur : Scan introuvable.</div>;

  const vulns = data.vulnerabilities || [];

  const filteredVulns = vulns.filter((v) => {
    const matchesSearch = 
      (v.path && v.path.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.message && v.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.check_id && v.check_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'ALL' || v.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const renderSeverityBadge = (severity) => {
    const styles = {
      CRITICAL: 'bg-red-500 text-white',
      HIGH: 'bg-orange-500 text-white',
      MEDIUM: 'bg-yellow-500 text-black',
      LOW: 'bg-blue-500 text-white',
      INFO: 'bg-gray-500 text-white'
    };
    const style = styles[severity] || styles.INFO;
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-bold ${style}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(`/dashboard/scan/${id}`)} className="p-2 bg-[#111623] hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg border border-gray-800 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">Liste des Vulnérabilités</h2>
          <p className="text-gray-400 text-sm">Projet : {data.scan.name}</p>
        </div>
      </div>

      <div className="bg-[#111623] border border-gray-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">Filtres</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par fichier, description ou catégorie..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0b0f19] border border-gray-800 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#0b0f19] border border-gray-800 text-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 min-w-[200px]"
          >
            <option value="ALL">Toutes les sévérités</option>
            <option value="CRITICAL">Critique</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>
        </div>
      </div>

      {/* BLOC TABLEAU */}
      <div className="bg-[#111623] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-bold text-white">Détails des Vulnérabilités</h3>
          <p className="text-xs text-gray-500 mt-1">Cliquez sur l'icône d'action pour voir le code vulnérable.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0f19]/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="p-4 font-medium">Sévérité</th>
                <th className="p-4 font-medium">Fichier</th>
                <th className="p-4 font-medium">Ligne</th>
                <th className="p-4 font-medium">Catégorie / Règle</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-800">
              {filteredVulns.length > 0 ? (
                filteredVulns.map((vuln) => (
                  <tr key={vuln.id} className="hover:bg-[#161d2d] transition duration-150 group">
                    <td className="p-4 whitespace-nowrap">
                      {renderSeverityBadge(vuln.severity)}
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-xs flex items-center gap-2">
                      <FileCode size={14} className="text-gray-500" />
                      {vuln.path}
                    </td>
                    <td className="p-4 text-gray-400 font-mono text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-500" />
                        L{vuln.line}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 text-xs">
                      {vuln.owasp_id ? `${vuln.owasp_id}` : vuln.check_id?.split('.').pop() || 'N/A'}
                    </td>
                    <td className="p-4 text-gray-400 text-xs max-w-md truncate" title={vuln.message}>
                      {vuln.message}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 p-1.5 rounded transition"
                        title="Voir les détails et le code source"
                      >
                        <Info size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Aucune vulnérabilité trouvée pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}