import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, AlertTriangle, FileCode, MapPin, Info } from 'lucide-react';
import { vulnerabilities, severityColors } from '../data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';

export default function Vulnerabilities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedVuln, setSelectedVuln] = useState<typeof vulnerabilities[0] | null>(null);

  const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
    const matchesSearch =
      vuln.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.owaspCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || vuln.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      Critical: 'bg-red-600 hover:bg-red-700',
      High: 'bg-orange-600 hover:bg-orange-700',
      Medium: 'bg-yellow-600 hover:bg-yellow-700',
      Low: 'bg-blue-600 hover:bg-blue-700',
      Info: 'bg-indigo-600 hover:bg-indigo-700',
    };
    return colors[severity] || 'bg-gray-600';
  };

  const severityCounts = {
    all: vulnerabilities.length,
    Critical: vulnerabilities.filter((v) => v.severity === 'Critical').length,
    High: vulnerabilities.filter((v) => v.severity === 'High').length,
    Medium: vulnerabilities.filter((v) => v.severity === 'Medium').length,
    Low: vulnerabilities.filter((v) => v.severity === 'Low').length,
    Info: vulnerabilities.filter((v) => v.severity === 'Info').length,
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Liste des Vulnérabilités</h1>
          <p className="text-gray-400">
            {filteredVulnerabilities.length} vulnérabilité(s) détectée(s)
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card
            className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${
              severityFilter === 'all' ? 'ring-2 ring-blue-500' : 'hover:border-gray-600'
            }`}
            onClick={() => setSeverityFilter('all')}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{severityCounts.all}</div>
                <div className="text-xs text-gray-400">Toutes</div>
              </div>
            </CardContent>
          </Card>

          {['Critical', 'High', 'Medium', 'Low', 'Info'].map((severity) => (
            <Card
              key={severity}
              className={`bg-gray-900 border-gray-800 cursor-pointer transition-all ${
                severityFilter === severity ? 'ring-2 ring-blue-500' : 'hover:border-gray-600'
              }`}
              onClick={() => setSeverityFilter(severity)}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: severityColors[severity as keyof typeof severityColors] }}
                  >
                    {severityCounts[severity as keyof typeof severityCounts]}
                  </div>
                  <div className="text-xs text-gray-400">{severity}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher par fichier, description ou catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Severity Filter */}
              <div className="w-full md:w-48">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Sévérité" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="all" className="text-white">Toutes les sévérités</SelectItem>
                    <SelectItem value="Critical" className="text-white">Critique</SelectItem>
                    <SelectItem value="High" className="text-white">Haute</SelectItem>
                    <SelectItem value="Medium" className="text-white">Moyenne</SelectItem>
                    <SelectItem value="Low" className="text-white">Basse</SelectItem>
                    <SelectItem value="Info" className="text-white">Info</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities Table */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Détails des Vulnérabilités</CardTitle>
            <CardDescription className="text-gray-400">
              Cliquez sur une ligne pour voir plus de détails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Sévérité</TableHead>
                    <TableHead className="text-gray-400">Fichier</TableHead>
                    <TableHead className="text-gray-400">Ligne</TableHead>
                    <TableHead className="text-gray-400">Catégorie OWASP</TableHead>
                    <TableHead className="text-gray-400">CWE</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                    <TableHead className="text-gray-400 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVulnerabilities.map((vuln) => (
                    <TableRow
                      key={vuln.id}
                      className="border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => setSelectedVuln(vuln)}
                    >
                      <TableCell>
                        <Badge className={`${getSeverityBadge(vuln.severity)} text-white`}>
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-gray-500" />
                          {vuln.file}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          L{vuln.line}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {vuln.owaspCategory}
                      </TableCell>
                      <TableCell className="text-gray-400 font-mono text-xs">
                        {vuln.cweId || '-'}
                      </TableCell>
                      <TableCell className="text-gray-300 max-w-md truncate">
                        {vuln.description}
                      </TableCell>
                      <TableCell className="text-right">
                        <Info className="w-4 h-4 text-blue-500 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredVulnerabilities.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Aucune vulnérabilité trouvée</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerability Detail Dialog */}
      <Dialog open={!!selectedVuln} onOpenChange={() => setSelectedVuln(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Badge className={`${getSeverityBadge(selectedVuln?.severity || '')} text-white`}>
                {selectedVuln?.severity}
              </Badge>
              <span>Détails de la Vulnérabilité</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Informations complètes et recommandations
            </DialogDescription>
          </DialogHeader>

          {selectedVuln && (
            <div className="space-y-4">
              {/* File Info */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Fichier</div>
                    <div className="font-mono text-white">{selectedVuln.file}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Ligne</div>
                    <div className="font-mono text-white">Ligne {selectedVuln.line}</div>
                  </div>
                </div>
              </div>

              {/* OWASP & CWE */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Catégorie OWASP</div>
                    <div className="text-white">{selectedVuln.owaspCategory}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Identifiant CWE</div>
                    <div className="font-mono text-white">{selectedVuln.cweId || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Description</div>
                <div className="text-white leading-relaxed">{selectedVuln.description}</div>
              </div>

              {/* Recommendation */}
              {selectedVuln.recommendation && (
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-400 mb-1">Recommandation</div>
                      <div className="text-white leading-relaxed">{selectedVuln.recommendation}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
