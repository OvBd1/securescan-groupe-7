import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Check, X, AlertTriangle, FileCode, Info } from 'lucide-react';
import { codeCorrections, vulnerabilities } from '../data/mockData';
import { toast } from 'sonner';

export default function Corrections() {
  const [corrections, setCorrections] = useState(codeCorrections);

  const handleAccept = (id: string) => {
    setCorrections((prev) =>
      prev.map((correction) =>
        correction.id === id ? { ...correction, status: 'accepted' as const } : correction
      )
    );
    toast.success('Correction acceptée et appliquée');
  };

  const handleReject = (id: string) => {
    setCorrections((prev) =>
      prev.map((correction) =>
        correction.id === id ? { ...correction, status: 'rejected' as const } : correction
      )
    );
    toast.error('Correction rejetée');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-600', text: 'En attente' },
      accepted: { bg: 'bg-green-600', text: 'Acceptée' },
      rejected: { bg: 'bg-red-600', text: 'Rejetée' },
    };
    const badge = badges[status as keyof typeof badges];
    return <Badge className={`${badge.bg} text-white`}>{badge.text}</Badge>;
  };

  const pendingCount = corrections.filter((c) => c.status === 'pending').length;
  const acceptedCount = corrections.filter((c) => c.status === 'accepted').length;
  const rejectedCount = corrections.filter((c) => c.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Système de Correction</h1>
          <p className="text-gray-400">
            Revue et validation des corrections proposées pour les vulnérabilités détectées
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{pendingCount}</div>
                  <div className="text-sm text-gray-400">En attente</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{acceptedCount}</div>
                  <div className="text-sm text-gray-400">Acceptées</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <X className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{rejectedCount}</div>
                  <div className="text-sm text-gray-400">Rejetées</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Corrections List */}
        <div className="space-y-6">
          {corrections.map((correction) => {
            const vulnerability = vulnerabilities.find((v) => v.id === correction.vulnerabilityId);

            return (
              <Card key={correction.id} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCode className="w-5 h-5 text-gray-400" />
                        <CardTitle className="text-white">{correction.file}</CardTitle>
                        {getStatusBadge(correction.status)}
                      </div>
                      <CardDescription className="text-gray-400">
                        Ligne {correction.line} - {vulnerability?.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Explanation */}
                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-400 mb-1">Explication</div>
                        <div className="text-white text-sm">{correction.explanation}</div>
                      </div>
                    </div>
                  </div>

                  {/* Code Diff View */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Vulnerable Code */}
                    <div className="bg-red-950/20 border border-red-900 rounded-lg overflow-hidden">
                      <div className="bg-red-900/30 px-4 py-2 border-b border-red-900">
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-sm font-medium text-red-400">Code Vulnérable</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                          {correction.vulnerableCode}
                        </pre>
                      </div>
                    </div>

                    {/* Corrected Code */}
                    <div className="bg-green-950/20 border border-green-900 rounded-lg overflow-hidden">
                      <div className="bg-green-900/30 px-4 py-2 border-b border-green-900">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">Code Corrigé</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
                          {correction.correctedCode}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {correction.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        onClick={() => handleAccept(correction.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accepter la Correction
                      </Button>
                      <Button
                        onClick={() => handleReject(correction.id)}
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  )}

                  {correction.status === 'accepted' && (
                    <div className="flex items-center gap-2 text-green-500 pt-2">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Correction acceptée et appliquée</span>
                    </div>
                  )}

                  {correction.status === 'rejected' && (
                    <div className="flex items-center gap-2 text-red-500 pt-2">
                      <X className="w-5 h-5" />
                      <span className="font-medium">Correction rejetée</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {corrections.length === 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="py-12">
              <div className="text-center">
                <FileCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Aucune correction disponible
                </h3>
                <p className="text-gray-400">
                  Les corrections proposées apparaîtront ici une fois l'analyse terminée
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
