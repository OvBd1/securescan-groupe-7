import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Upload, Github, GitBranch, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Submission() {
  const navigate = useNavigate();
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleScanRepository = async () => {
    if (!repositoryUrl.trim()) return;
    
    setIsScanning(true);
    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      navigate('/dashboard');
    }, 2000);
  };

  const handleScanArchive = async () => {
    if (!file) return;
    
    setIsScanning(true);
    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      navigate('/dashboard');
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Nouvelle Analyse de Sécurité</h1>
          <p className="text-gray-400 text-lg">
            Analysez votre code source pour détecter les vulnérabilités et risques de sécurité
          </p>
        </div>

        {/* Scan Options */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Sélectionnez la source du code</CardTitle>
            <CardDescription className="text-gray-400">
              Importez depuis un repository Git ou uploadez une archive ZIP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="repository" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="repository" className="data-[state=active]:bg-blue-600">
                  <Github className="w-4 h-4 mr-2" />
                  Repository Git
                </TabsTrigger>
                <TabsTrigger value="archive" className="data-[state=active]:bg-blue-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Archive ZIP
                </TabsTrigger>
              </TabsList>

              {/* Repository Tab */}
              <TabsContent value="repository" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="repo-url" className="text-gray-300">
                    URL du Repository
                  </Label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <Input
                      id="repo-url"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={repositoryUrl}
                      onChange={(e) => setRepositoryUrl(e.target.value)}
                      className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Formats supportés : GitHub, GitLab, Bitbucket
                  </p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-gray-300 text-sm">Informations :</h4>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• L'analyse peut prendre de 2 à 10 minutes selon la taille du projet</li>
                    <li>• Le repository doit être public ou vous devez fournir un token d'accès</li>
                    <li>• Tous les fichiers seront analysés (multi-langages supportés)</li>
                  </ul>
                </div>

                <Button
                  onClick={handleScanRepository}
                  disabled={!repositoryUrl.trim() || isScanning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-5 h-5 mr-2" />
                      Lancer l'Analyse
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Archive Tab */}
              <TabsContent value="archive" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="file-upload" className="text-gray-300">
                    Archive du Projet
                  </Label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors bg-gray-800/50">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-500 mb-3" />
                      {file ? (
                        <div className="text-white">
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-300 mb-1">
                            Cliquez pour sélectionner une archive ZIP
                          </p>
                          <p className="text-sm text-gray-500">Taille maximale : 500 MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-gray-300 text-sm">Informations :</h4>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• L'archive sera analysée de manière sécurisée et isolée</li>
                    <li>• Assurez-vous que l'archive contient le code source complet</li>
                    <li>• Les fichiers binaires seront ignorés automatiquement</li>
                  </ul>
                </div>

                <Button
                  onClick={handleScanArchive}
                  disabled={!file || isScanning}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Lancer l'Analyse
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">12,847</div>
                <div className="text-sm text-gray-400">Scans effectués</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">45,392</div>
                <div className="text-sm text-gray-400">Vulnérabilités détectées</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98.3%</div>
                <div className="text-sm text-gray-400">Précision</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
