import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Download, FileText, GitBranch, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { recentScans, vulnerabilities, owaspTop10, gradeColors, severityColors } from '../data/mockData';
import { toast } from 'sonner';

export default function Report() {
  const [branchCreated, setBranchCreated] = useState(false);
  const [branchName] = useState('securescan/fix-vulnerabilities-2026-03-03');

  const currentScan = recentScans[0];

  const handleDownloadReport = (format: 'pdf' | 'json' | 'html') => {
    toast.success(`Rapport ${format.toUpperCase()} téléchargé avec succès`);
  };

  const handleCreateBranch = () => {
    setBranchCreated(true);
    toast.success(`Branche Git créée : ${branchName}`);
  };

  const handleCopyBranchName = () => {
    navigator.clipboard.writeText(branchName);
    toast.success('Nom de branche copié dans le presse-papier');
  };

  const criticalCount = currentScan.vulnerabilities.critical;
  const highCount = currentScan.vulnerabilities.high;
  const totalVulns = Object.values(currentScan.vulnerabilities).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rapport de Sécurité & Intégration Git</h1>
          <p className="text-gray-400">
            Générez et téléchargez le rapport complet, créez une branche de correction
          </p>
        </div>

        {/* Git Integration Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Intégration Git
            </CardTitle>
            <CardDescription className="text-gray-400">
              Créez automatiquement une branche avec les corrections proposées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!branchCreated ? (
              <>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Action proposée :</h4>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                      <span>
                        Créer une nouvelle branche :{' '}
                        <code className="text-blue-400 bg-gray-900 px-2 py-0.5 rounded">
                          {branchName}
                        </code>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                      <span>Appliquer {vulnerabilities.length} corrections de sécurité</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                      <span>Créer un commit avec les fichiers modifiés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                      <span>
                        Pousser automatiquement vers le repository distant (optionnel)
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleCreateBranch}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <GitBranch className="w-4 h-4 mr-2" />
                    Créer la Branche de Correction
                  </Button>
                  <span className="text-sm text-gray-500">
                    Repository : {currentScan.repositoryUrl}
                  </span>
                </div>
              </>
            ) : (
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold text-green-400 mb-1">
                        Branche Git créée avec succès !
                      </h4>
                      <p className="text-sm text-gray-400">
                        La branche de correction a été créée et les modifications sont prêtes à être
                        commitées
                      </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Nom de la branche :</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyBranchName}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copier
                        </Button>
                      </div>
                      <code className="text-green-400 font-mono text-sm bg-gray-800 px-3 py-2 rounded block">
                        {branchName}
                      </code>
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>4 fichiers modifiés avec corrections de sécurité</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Commit prêt : "fix: Apply security patches from SecureScan"</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="border-green-700 text-green-400 hover:bg-green-900/30"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ouvrir Pull Request
                      </Button>
                      <Button variant="ghost" className="text-gray-400 hover:text-white">
                        Voir les Changements
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Download Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Télécharger le Rapport
            </CardTitle>
            <CardDescription className="text-gray-400">
              Exportez le rapport d'analyse complet dans différents formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Preview */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-white mb-4">Aperçu du Rapport</h4>

              {/* Summary Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: gradeColors[currentScan.grade as keyof typeof gradeColors] }}
                  >
                    {currentScan.grade}
                  </div>
                  <div className="text-xs text-gray-400">Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{currentScan.score}</div>
                  <div className="text-xs text-gray-400">Score /100</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{totalVulns}</div>
                  <div className="text-xs text-gray-400">Total Vulns</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: severityColors.Critical }}
                  >
                    {criticalCount}
                  </div>
                  <div className="text-xs text-gray-400">Critiques</div>
                </div>
              </div>

              {/* Vulnerabilities by Severity */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">Répartition par Sévérité</h5>
                <div className="space-y-2">
                  {[
                    { name: 'Critique', count: currentScan.vulnerabilities.critical, severity: 'Critical' },
                    { name: 'Haute', count: currentScan.vulnerabilities.high, severity: 'High' },
                    { name: 'Moyenne', count: currentScan.vulnerabilities.medium, severity: 'Medium' },
                    { name: 'Basse', count: currentScan.vulnerabilities.low, severity: 'Low' },
                    { name: 'Info', count: currentScan.vulnerabilities.info, severity: 'Info' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-24 text-sm text-gray-400">{item.name}</div>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(item.count / totalVulns) * 100}%`,
                            backgroundColor: severityColors[item.severity as keyof typeof severityColors],
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm text-gray-400 text-right">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top OWASP Categories */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">
                  Top 5 Catégories OWASP Détectées
                </h5>
                <div className="space-y-2">
                  {owaspTop10.slice(0, 5).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-2 bg-gray-900 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs" style={{ color: category.color }}>
                          {category.id}
                        </span>
                        <span className="text-sm text-gray-300">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="bg-gray-700 text-white">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Formats disponibles :</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* PDF Report */}
                <Button
                  onClick={() => handleDownloadReport('pdf')}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Download className="w-6 h-6 text-red-500" />
                    <div className="text-center">
                      <div className="font-medium">Rapport PDF</div>
                      <div className="text-xs text-gray-400">Format exécutif</div>
                    </div>
                  </div>
                </Button>

                {/* JSON Report */}
                <Button
                  onClick={() => handleDownloadReport('json')}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Download className="w-6 h-6 text-blue-500" />
                    <div className="text-center">
                      <div className="font-medium">Rapport JSON</div>
                      <div className="text-xs text-gray-400">Format technique</div>
                    </div>
                  </div>
                </Button>

                {/* HTML Report */}
                <Button
                  onClick={() => handleDownloadReport('html')}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Download className="w-6 h-6 text-green-500" />
                    <div className="text-center">
                      <div className="font-medium">Rapport HTML</div>
                      <div className="text-xs text-gray-400">Format web</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Report Details */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-400 mb-2">Contenu du Rapport</h5>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Résumé exécutif avec score et grade</li>
                <li>• Liste complète des {vulnerabilities.length} vulnérabilités détectées</li>
                <li>• Mapping détaillé OWASP Top 10:2025</li>
                <li>• Recommandations de correction avec exemples de code</li>
                <li>• Métriques et statistiques d'analyse</li>
                <li>• Métadonnées du scan (date, repository, durée)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Scan Metadata */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Informations du Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Repository</div>
                <div className="text-white font-mono">{currentScan.repositoryUrl}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Date d'analyse</div>
                <div className="text-white">
                  {new Date(currentScan.timestamp).toLocaleString('fr-FR')}
                </div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">ID du Scan</div>
                <div className="text-white font-mono">SCAN-{currentScan.id.padStart(6, '0')}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Durée</div>
                <div className="text-white">3 min 42 sec</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Fichiers analysés</div>
                <div className="text-white">247 fichiers</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Lignes de code</div>
                <div className="text-white">12,458 lignes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
