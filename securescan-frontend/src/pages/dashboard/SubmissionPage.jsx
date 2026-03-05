import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Github, FileArchive, Rocket, Loader2 } from 'lucide-react';
import { createProjectScan } from '../../api/projects.js';
import { api } from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function SubmissionPage() {
  const [activeTab, setActiveTab] = useState('git');
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleScan = async (e) => {
    e.preventDefault();
    const gitRegex = /^https?:\/\/(www\.)?(github\.com|gitlab\.com)\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+/;
    setIsScanning(true);

    if (activeTab === 'git' && !gitRegex.test(repoUrl)) {
      addToast("Le lien Git est invalide. Exemple attendu : https://github.com/user/repo", "error");
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error("Utilisateur non connecté. Veuillez vous reconnecter.");
      }
      const user = JSON.parse(userStr);
      const response = await createProjectScan(repoUrl, user.id);
      console.log("Analyse réussie :", response);
      
      console.log("Déclenchement du téléchargement PDF...");
      try {
        const token = localStorage.getItem("token");
        const pdfResponse = await fetch(`${import.meta.env.VITE_API_URL}/project/${response.project.id}/export-pdf`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (pdfResponse.ok) {
          const blob = await pdfResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Rapport_SecureScan_${response.project.name || 'rapport'}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log("PDF téléchargé avec succès !");
        } else {
          console.error("Erreur lors du téléchargement du PDF");
        }
      } catch (pdfError) {
        console.error("Erreur lors du téléchargement du PDF :", pdfError);
      }

      addToast(`Analyse terminée avec succès ! Score de sécurité : ${response.project?.global_score || 0}/100`, "success");

      localStorage.setItem('currentProjectId', response.project.id);
      navigate(`/dashboard/scan/${response.project.id}`);

    } catch (error) {
      console.error("Erreur lors du scan :", error);
      addToast(error.message || "Une erreur est survenue lors de l'analyse du repo.", "error");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto w-full animate-fade-in">
      
      <div className="text-center mb-10">
        <div className="bg-cyan-400/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <Upload size={32} className="text-cyan-400" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-white">Nouvelle Analyse de Sécurité</h2>
        <p className="text-gray-400 text-sm">Analysez votre code source pour détecter les vulnérabilités</p>
      </div>

      <div className="bg-[#111623] border border-gray-800 rounded-2xl w-full p-8 shadow-2xl">
        <div className="flex bg-[#0b0f19] rounded-lg p-1 mb-6 border border-gray-800">
          <button onClick={() => setActiveTab('git')} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'git' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            <Github size={16} /> Repository Git
          </button>
          <button onClick={() => setActiveTab('zip')} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'zip' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            <FileArchive size={16} /> Archive ZIP
          </button>
        </div>

        <form onSubmit={handleScan}>
          <label className="block text-sm font-medium text-gray-300 mb-2">URL du Repository</label>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github size={18} className="text-gray-500" />
            </div>
            <input 
              type="text"
              required 
              value={repoUrl} 
              onChange={(e) => setRepoUrl(e.target.value)} 
              placeholder="https://github.com/username/repository" 
              disabled={isScanning}
              className="w-full bg-[#0b0f19] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 transition disabled:opacity-50" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isScanning}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 size={18} className="animate-spin" /> 
                Analyse en cours (peut prendre 1 à 2 min)...
              </>
            ) : (
              <>
                <Rocket size={18} /> Lancer l'Analyse
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}