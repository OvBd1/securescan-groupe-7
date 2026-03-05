// Mock data for SecureScan platform

export interface Vulnerability {
  id: string;
  file: string;
  line: number;
  owaspCategory: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';
  description: string;
  cweId?: string;
  recommendation?: string;
}

export interface Scan {
  id: string;
  repositoryUrl: string;
  timestamp: string;
  score: number;
  grade: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export interface CodeCorrection {
  id: string;
  vulnerabilityId: string;
  file: string;
  line: number;
  vulnerableCode: string;
  correctedCode: string;
  explanation: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const owaspTop10 = [
  { id: 'A01', name: 'Broken Access Control', count: 12, color: '#ef4444' },
  { id: 'A02', name: 'Cryptographic Failures', count: 5, color: '#f97316' },
  { id: 'A03', name: 'Injection', count: 18, color: '#eab308' },
  { id: 'A04', name: 'Insecure Design', count: 7, color: '#84cc16' },
  { id: 'A05', name: 'Security Misconfiguration', count: 15, color: '#22c55e' },
  { id: 'A06', name: 'Vulnerable Components', count: 9, color: '#14b8a6' },
  { id: 'A07', name: 'Authentication Failures', count: 6, color: '#06b6d4' },
  { id: 'A08', name: 'Software & Data Integrity', count: 4, color: '#3b82f6' },
  { id: 'A09', name: 'Logging & Monitoring', count: 3, color: '#8b5cf6' },
  { id: 'A10', name: 'SSRF', count: 2, color: '#a855f7' },
];

export const recentScans: Scan[] = [
  {
    id: '1',
    repositoryUrl: 'https://github.com/company/backend-api',
    timestamp: '2026-03-02T10:30:00Z',
    score: 72,
    grade: 'C',
    vulnerabilities: { critical: 3, high: 8, medium: 15, low: 12, info: 5 },
  },
  {
    id: '2',
    repositoryUrl: 'https://gitlab.com/team/frontend-app',
    timestamp: '2026-03-01T15:45:00Z',
    score: 85,
    grade: 'B',
    vulnerabilities: { critical: 1, high: 4, medium: 8, low: 10, info: 3 },
  },
  {
    id: '3',
    repositoryUrl: 'https://github.com/company/payment-service',
    timestamp: '2026-02-28T09:15:00Z',
    score: 58,
    grade: 'D',
    vulnerabilities: { critical: 6, high: 12, medium: 20, low: 15, info: 8 },
  },
  {
    id: '4',
    repositoryUrl: 'https://github.com/company/admin-portal',
    timestamp: '2026-02-27T14:20:00Z',
    score: 91,
    grade: 'A',
    vulnerabilities: { critical: 0, high: 2, medium: 5, low: 8, info: 2 },
  },
];

export const vulnerabilities: Vulnerability[] = [
  {
    id: 'vuln-1',
    file: 'src/auth/login.js',
    line: 45,
    owaspCategory: 'A07:2025 - Authentication Failures',
    severity: 'Critical',
    description: 'Hard-coded credentials detected in authentication module',
    cweId: 'CWE-798',
    recommendation: 'Remove hard-coded credentials and use environment variables',
  },
  {
    id: 'vuln-2',
    file: 'src/api/userController.js',
    line: 128,
    owaspCategory: 'A03:2025 - Injection',
    severity: 'Critical',
    description: 'SQL Injection vulnerability in user query',
    cweId: 'CWE-89',
    recommendation: 'Use parameterized queries or ORM',
  },
  {
    id: 'vuln-3',
    file: 'src/middleware/auth.js',
    line: 23,
    owaspCategory: 'A01:2025 - Broken Access Control',
    severity: 'High',
    description: 'Missing authorization check for admin routes',
    cweId: 'CWE-285',
    recommendation: 'Implement proper role-based access control',
  },
  {
    id: 'vuln-4',
    file: 'src/utils/crypto.js',
    line: 67,
    owaspCategory: 'A02:2025 - Cryptographic Failures',
    severity: 'High',
    description: 'Weak cryptographic algorithm (MD5) used for password hashing',
    cweId: 'CWE-327',
    recommendation: 'Use bcrypt or Argon2 for password hashing',
  },
  {
    id: 'vuln-5',
    file: 'config/database.js',
    line: 12,
    owaspCategory: 'A05:2025 - Security Misconfiguration',
    severity: 'High',
    description: 'Database connection exposed without SSL/TLS',
    cweId: 'CWE-319',
    recommendation: 'Enable SSL/TLS for database connections',
  },
  {
    id: 'vuln-6',
    file: 'package.json',
    line: 45,
    owaspCategory: 'A06:2025 - Vulnerable Components',
    severity: 'High',
    description: 'Outdated dependency with known vulnerabilities (express@4.16.0)',
    cweId: 'CWE-1035',
    recommendation: 'Update to latest secure version',
  },
  {
    id: 'vuln-7',
    file: 'src/api/uploadController.js',
    line: 89,
    owaspCategory: 'A03:2025 - Injection',
    severity: 'Medium',
    description: 'Path traversal vulnerability in file upload',
    cweId: 'CWE-22',
    recommendation: 'Validate and sanitize file paths',
  },
  {
    id: 'vuln-8',
    file: 'src/views/profile.ejs',
    line: 34,
    owaspCategory: 'A03:2025 - Injection',
    severity: 'Medium',
    description: 'Cross-Site Scripting (XSS) vulnerability in template',
    cweId: 'CWE-79',
    recommendation: 'Escape user input before rendering',
  },
  {
    id: 'vuln-9',
    file: 'src/middleware/cors.js',
    line: 15,
    owaspCategory: 'A05:2025 - Security Misconfiguration',
    severity: 'Medium',
    description: 'Overly permissive CORS configuration',
    cweId: 'CWE-942',
    recommendation: 'Restrict CORS to specific trusted origins',
  },
  {
    id: 'vuln-10',
    file: 'src/api/paymentController.js',
    line: 156,
    owaspCategory: 'A08:2025 - Software & Data Integrity',
    severity: 'Medium',
    description: 'Missing integrity check for payment data',
    cweId: 'CWE-353',
    recommendation: 'Implement HMAC signature verification',
  },
  {
    id: 'vuln-11',
    file: 'src/utils/logger.js',
    line: 28,
    owaspCategory: 'A09:2025 - Logging & Monitoring',
    severity: 'Low',
    description: 'Sensitive data logged in plain text',
    cweId: 'CWE-532',
    recommendation: 'Sanitize sensitive data before logging',
  },
  {
    id: 'vuln-12',
    file: 'src/api/imageProxy.js',
    line: 73,
    owaspCategory: 'A10:2025 - SSRF',
    severity: 'High',
    description: 'Server-Side Request Forgery in image proxy endpoint',
    cweId: 'CWE-918',
    recommendation: 'Validate and whitelist allowed URLs',
  },
];

export const codeCorrections: CodeCorrection[] = [
  {
    id: 'fix-1',
    vulnerabilityId: 'vuln-1',
    file: 'src/auth/login.js',
    line: 45,
    vulnerableCode: `// Hard-coded credentials
const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'P@ssw0rd123';

function authenticate(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
    return { authenticated: true, role: 'admin' };
  }
  return { authenticated: false };
}`,
    correctedCode: `// Use environment variables for credentials
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

function authenticate(username, password) {
  const passwordHash = bcrypt.hashSync(password, 10);
  if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return { authenticated: true, role: 'admin' };
  }
  return { authenticated: false };
}`,
    explanation: 'Removed hard-coded credentials and implemented secure password hashing with bcrypt',
    status: 'pending',
  },
  {
    id: 'fix-2',
    vulnerabilityId: 'vuln-2',
    file: 'src/api/userController.js',
    line: 128,
    vulnerableCode: `async function getUserById(req, res) {
  const userId = req.params.id;
  const query = \`SELECT * FROM users WHERE id = '\${userId}'\`;
  
  const result = await db.query(query);
  res.json(result.rows[0]);
}`,
    correctedCode: `async function getUserById(req, res) {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = $1';
  
  const result = await db.query(query, [userId]);
  res.json(result.rows[0]);
}`,
    explanation: 'Replaced string concatenation with parameterized queries to prevent SQL injection',
    status: 'pending',
  },
  {
    id: 'fix-3',
    vulnerabilityId: 'vuln-3',
    file: 'src/middleware/auth.js',
    line: 23,
    vulnerableCode: `function adminRouteHandler(req, res, next) {
  // Missing authorization check
  next();
}`,
    correctedCode: `function adminRouteHandler(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}`,
    explanation: 'Added proper role-based access control check for admin routes',
    status: 'pending',
  },
  {
    id: 'fix-4',
    vulnerabilityId: 'vuln-4',
    file: 'src/utils/crypto.js',
    line: 67,
    vulnerableCode: `const crypto = require('crypto');

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}`,
    correctedCode: `const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}`,
    explanation: 'Replaced weak MD5 hashing with bcrypt for secure password storage',
    status: 'pending',
  },
];

export const severityColors = {
  Critical: '#dc2626',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#3b82f6',
  Info: '#6366f1',
};

export const gradeColors = {
  A: '#10b981',
  B: '#84cc16',
  C: '#eab308',
  D: '#f97316',
  F: '#dc2626',
};
