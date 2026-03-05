import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Info, ArrowLeft, Loader2, FileCode, MapPin, ArrowUpDown, X } from 'lucide-react';
import { getProjectDashboardData } from '../../api/projects';

const OWASP_NAMES = {
  'A01:2025': 'Broken Access Control',
  'A02:2025': 'Cryptographic Failures',
  'A03:2025': 'Injection',
  'A04:2025': 'Insecure Design',
  'A05:2025': 'Security Misconfiguration',
  'A06:2025': 'Vulnerable and Outdated Components',
  'A07:2025': 'Identification and Authentication Failures',
  'A08:2025': 'Software and Data Integrity Failures',
  'A09:2025': 'Security Logging and Monitoring Failures',
  'A10:2025': 'Server-Side Request Forgery (SSRF)'
};

const SEVERITY_WEIGHT = { HIGH: 3, MEDIUM: 2, LOW: 1, INFO: 0 };

export default function VulnerabilitiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vulnsList, setVulnsList] = useState([]);
  const [selectedVuln, setSelectedVuln] = useState(null); 

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getProjectDashboardData(id);
        setData(response);
        setVulnsList(response.vulnerabilities || []);
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

  const filteredVulns = vulnsList.filter((v) => {
    const matchesSearch = !searchTerm || 
      (v.path && v.path.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.message && v.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.check_id && v.check_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeverity = severityFilter === 'ALL' || v.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const sortedAndFilteredVulns = [...filteredVulns].sort((a, b) => {
    const weightA = SEVERITY_WEIGHT[a.severity] || 0;
    const weightB = SEVERITY_WEIGHT[b.severity] || 0;
    
    if (sortOrder === 'DESC') {
      return weightB - weightA;
    } else {
      return weightA - weightB;
    }
  });

  const renderSeverityBadge = (severity) => {
    if (!severity) return <span className="px-2.5 py-1 rounded text-xs font-bold bg-gray-500 text-white">Inconnu</span>;
    const styles = {
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
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in relative">
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
        <h3 className="text-sm font-bold text-white mb-4">Filtres et Tris</h3>
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
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
            className="flex items-center justify-center gap-2 bg-[#161d2d] hover:bg-gray-800 border border-gray-800 text-white rounded-lg px-4 py-2.5 transition min-w-[150px]"
          >
            <ArrowUpDown size={16} className="text-blue-500"/>
            {sortOrder === 'DESC' ? 'Tri: Plus graves' : 'Tri: Moins graves'}
          </button>
        </div>
      </div>

      <div className="bg-[#111623] border border-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-bold text-white">Détails des Vulnérabilités</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0f19]/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                <th className="p-4 font-medium">Sévérité</th>
                <th className="p-4 font-medium">Fichier</th>
                <th className="p-4 font-medium">Ligne</th>
                <th className="p-4 font-medium">Catégorie OWASP</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-800">
              {sortedAndFilteredVulns.length > 0 ? (
                sortedAndFilteredVulns.map((vuln) => {
                  const owaspName = vuln.owasp_id ? OWASP_NAMES[vuln.owasp_id] : null;
                  const displayCategory = owaspName 
                    ? `${vuln.owasp_id} - ${owaspName}` 
                    : (vuln.check_id?.split('.').pop() || 'N/A');

                  return (
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
                        {displayCategory}
                      </td>
                      <td className="p-4 text-gray-400 text-xs max-w-md truncate" title={vuln.message}>
                        {vuln.message}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center">
                          <button 
                            onClick={() => setSelectedVuln(vuln)}
                            className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 p-1.5 rounded transition"
                            title="Voir les détails"
                          >
                            <Info size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
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

      {selectedVuln && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#111623] border border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#161d2d]">
              <div className="flex items-center gap-3">
                {renderSeverityBadge(selectedVuln.severity)}
                <h3 className="text-lg font-bold text-white">Détails de la vulnérabilité</h3>
              </div>
              <button 
                onClick={() => setSelectedVuln(null)} 
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0b0f19] p-4 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Fichier concerné</p>
                  <p className="text-sm font-mono text-blue-400 break-all">{selectedVuln.path}</p>
                </div>
                <div className="bg-[#0b0f19] p-4 rounded-xl border border-gray-800">
                  <p className="text-xs text-gray-500 mb-1">Ligne</p>
                  <p className="text-sm font-mono text-white">Ligne {selectedVuln.line}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-white mb-2">Règle détectée</p>
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-3 rounded-lg text-sm font-mono">
                  {selectedVuln.check_id || 'Règle inconnue'}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-white mb-2">Description complète</p>
                <p className="text-gray-300 text-sm leading-relaxed bg-[#0b0f19] p-4 rounded-xl border border-gray-800">
                  {selectedVuln.message}
                </p>
              </div>

              {selectedVuln.code_snippet && (
                <div>
                  <p className="text-sm font-bold text-white mb-2">Extrait du code</p>
                  <div className="bg-[#0b0f19] border border-red-500/20 rounded-xl overflow-hidden">
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300">
                      <code>{selectedVuln.code_snippet}</code>
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}