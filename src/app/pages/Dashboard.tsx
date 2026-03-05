import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { owaspTop10, recentScans, severityColors, gradeColors } from '../data/mockData';

export default function Dashboard() {
  // Current scan data (most recent)
  const currentScan = recentScans[0];

  // Severity distribution for pie chart
  const severityData = [
    { name: 'Critique', value: currentScan.vulnerabilities.critical, color: severityColors.Critical },
    { name: 'Haute', value: currentScan.vulnerabilities.high, color: severityColors.High },
    { name: 'Moyenne', value: currentScan.vulnerabilities.medium, color: severityColors.Medium },
    { name: 'Basse', value: currentScan.vulnerabilities.low, color: severityColors.Low },
    { name: 'Info', value: currentScan.vulnerabilities.info, color: severityColors.Info },
  ];

  const totalVulnerabilities = severityData.reduce((sum, item) => sum + item.value, 0);

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-lime-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      Critical: 'bg-red-600 text-white',
      High: 'bg-orange-600 text-white',
      Medium: 'bg-yellow-600 text-white',
      Low: 'bg-blue-600 text-white',
      Info: 'bg-indigo-600 text-white',
    };
    return colors[severity] || 'bg-gray-600 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Tableau de Bord</h1>
            <p className="text-gray-400">Analyse de sécurité - {currentScan.repositoryUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Dernière analyse : {new Date(currentScan.timestamp).toLocaleString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Security Score */}
          <Card className="bg-gray-900 border-gray-800 col-span-1">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Score de Sécurité</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className={`text-5xl font-bold ${getScoreColor(currentScan.score)}`}>
                  {currentScan.score}
                </span>
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div className="mt-3">
                <Badge
                  className={`text-lg px-3 py-1`}
                  style={{ backgroundColor: gradeColors[currentScan.grade as keyof typeof gradeColors] }}
                >
                  Grade {currentScan.grade}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Critical Vulnerabilities */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Vulnérabilités Critiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div className="text-4xl font-bold text-white">
                  {currentScan.vulnerabilities.critical}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* High Vulnerabilities */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Vulnérabilités Hautes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-4xl font-bold text-white">
                  {currentScan.vulnerabilities.high}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Vulnerabilities */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardDescription className="text-gray-400">Total Vulnérabilités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-4xl font-bold text-white">{totalVulnerabilities}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Distribution */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Répartition par Sévérité</CardTitle>
              <CardDescription className="text-gray-400">
                Distribution des vulnérabilités détectées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {severityData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-400">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* OWASP Top 10 Mapping */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Mapping OWASP Top 10 : 2025</CardTitle>
              <CardDescription className="text-gray-400">
                Catégorisation selon le standard OWASP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={owaspTop10.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis dataKey="id" type="category" stroke="#9ca3af" width={50} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value, name, props) => [value, props.payload.name]}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                    {owaspTop10.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* OWASP Categories Grid */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Détail des Catégories OWASP</CardTitle>
            <CardDescription className="text-gray-400">
              Vue complète des 10 catégories de risques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {owaspTop10.map((category) => (
                <div
                  key={category.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-bold" style={{ color: category.color }}>
                      {category.id}
                    </span>
                    <Badge variant="secondary" className="bg-gray-700 text-white">
                      {category.count}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 leading-tight">{category.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Derniers Scans Effectués</CardTitle>
            <CardDescription className="text-gray-400">
              Historique des analyses récentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                      style={{ backgroundColor: `${gradeColors[scan.grade as keyof typeof gradeColors]}20` }}
                    >
                      <span style={{ color: gradeColors[scan.grade as keyof typeof gradeColors] }}>
                        {scan.grade}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">{scan.repositoryUrl}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{new Date(scan.timestamp).toLocaleString('fr-FR')}</span>
                        <span>Score: {scan.score}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityBadge('Critical')}>
                      {scan.vulnerabilities.critical} Critiques
                    </Badge>
                    <Badge className={getSeverityBadge('High')}>
                      {scan.vulnerabilities.high} Hautes
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
