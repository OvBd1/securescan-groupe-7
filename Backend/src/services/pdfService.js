import { jsPDF } from "jspdf";

// Fonction pour dessiner un bloc de code avec wrapping automatique
function drawCodeBlock(doc, code, x, y, width, bgColor, textColor = [0, 0, 0]) {
  const lineHeight = 3.5;
  const padding = 3;
  const maxCharsPerLine = 55;
  
  // Texte du code
  doc.setTextColor(...textColor);
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  
  const originalLines = code.split('\n');
  const wrappedLines = [];
  
  // Envelopper les longues lignes
  originalLines.forEach(line => {
    if (line.length > maxCharsPerLine) {
      let remaining = line;
      while (remaining.length > maxCharsPerLine) {
        wrappedLines.push(remaining.substring(0, maxCharsPerLine));
        remaining = '  ' + remaining.substring(maxCharsPerLine); // Indent continuation
      }
      if (remaining.length > 0) {
        wrappedLines.push(remaining);
      }
    } else {
      wrappedLines.push(line);
    }
  });
  
  // Calculer la hauteur totale nécessaire
  const totalHeight = wrappedLines.length * lineHeight + 2 * padding;
  
  // Fond du bloc
  doc.setFillColor(...bgColor);
  doc.rect(x, y, width, totalHeight, 'F');
  
  // Bordure
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.rect(x, y, width, totalHeight, 'S');
  
  // Afficher toutes les lignes
  let currentY = y + padding + 2;
  wrappedLines.forEach(line => {
    doc.text(line, x + padding, currentY);
    currentY += lineHeight;
  });
  
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  // Retourner la hauteur totale utilisée pour ajuster la position suivante
  return totalHeight;
}

// Mapping OWASP ID vers types de vulnérabilité
const owaspMapping = {
  'A01:2025': 'Broken Access Control',
  'A02:2025': 'Cryptographic Failures',
  'A03:2025': 'Injection SQL',
  'A04:2025': 'Path Traversal',
  'A05:2025': 'Cryptographic Failures',
  null: 'Code Quality'
};

// Fonction pour générer du code vulnérable basé sur le check_id
function generateVulnerableCode(vulnerability) {
  const checkId = vulnerability.check_id;
  
  if (checkId.includes('sequelize-injection')) {
    return `// API endpoint - VULNERABLE à SQL injection
app.get('/api/users/search', async (req, res) => {
  const searchQuery = req.query.q;
  const users = await User.findAll({
    where: Sequelize.literal(
      \`name = '\${searchQuery}'\`
    )
  });
  res.json(users);
});
// Exemple d'attaque: /api/users/search?q=' OR '1'='1`;
  } else if (checkId.includes('detected-replaceall-sanitization')) {
    return `// XSS via sanitization insuffisante
const userDescription = req.body.desc;
const sanitized = userDescription
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
// Manipulé par HTML entities et UTF-8
document.getElementById('content').innerHTML = sanitized;
// Attaque: <img src=x onerror="alert()">`;
  } else if (checkId.includes('insecure-document-method')) {
    return `// Page frontend - XSS via innerHTML
function displayUserData(userData) {
  const container = document.getElementById('results');
  container.innerHTML = \`
    <div class="user-card">
      <h2>\${userData.name}</h2>
      <p>\${userData.bio}</p>
    </div>
  \`;
}
// Si userData vient du serveur: XSS direct
// Attaque: userData.bio = "<script>steal()</script>"`;
  } else if (checkId.includes('detected-jwt-token')) {
    return `// Configuration JWT - Secret hardcodé
const jwtConfig = {
  secret: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  expiresIn: '24h'
};

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  return jwt.sign(payload, jwtConfig.secret);
}
// Secret visible dans le code source`;
  } else if (checkId.includes('detected-generic-secret')) {
    return `// Secrets exposés dans le code
module.exports = {
  database: {
    password: 'mysql_root_pass_2024'
  },
  api: {
    key: 'sk_live_abc123def456ghi789jkl'
  },
  aws: {
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  }
};`;
  } else if (checkId.includes('missing-integrity')) {
    return `<!-- CDN external scripts - Pas d'intégrité -->
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5"></script>
    <script src="https://cdn.example.com/analytics.js"></script>
    <link rel="stylesheet" href="https://cdn.example.com/style.css">
  </head>
</html>
<!-- Attaquant peut modifier les scripts du CDN -->`;
  } else if (checkId.includes('prototype-pollution')) {
    return `// Merge d'objet sans protection
function mergeConfig(userConfig) {
  const config = { port: 3000, debug: false };
  
  for (let key in userConfig) {
    config[key] = userConfig[key];
  }
  return config;
}
// Attaquant: userConfig = {"__proto__": {"isAdmin": true}}
// Pollue: Object.prototype.isAdmin = true for all objects`;
  } else if (checkId.includes('express-sendfile')) {
    return `// File download endpoint - Path traversal
app.get('/download', (req, res) => {
  const filePath = req.query.file;
  
  // Pas de validation = path traversal possible
  res.sendFile(filePath, {
    root: './public'
  });
});
// Attaque: GET /download?file=../../etc/passwd
// Lit n'importe quel fichier du serveur`;
  } else if (checkId.includes('eval-detected')) {
    return `// Code injection via eval()
app.post('/execute', express.json(), (req, res) => {
  const userScript = req.body.code;
  
  try {
    // Exécute du code JavaScript arbitraire
    const result = eval(userScript);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
// Attaque: code = "require('fs').readFileSync('/etc/passwd')"`;
  } else if (checkId.includes('express-open-redirect')) {
    return `// Redirection sans validation
app.get('/goto', (req, res) => {
  const redirectUrl = req.query.url;
  
  // Accepte n'importe quelle URL
  if (redirectUrl) {
    res.redirect(redirectUrl);
  } else {
    res.redirect('/');
  }
});
// Attaque: /goto?url=https://evil.com/phishing
// Utilisateurs redirigés vers site malveillant`;
  } else if (checkId.includes('hardcoded-hmac-key')) {
    return `// HMAC signature - Clé hardcodée
const crypto = require('crypto');

function signData(data) {
  const secret = 'my-secret-key-12345-hardcoded';
  return crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
}
// Clé exposée = attaquant peut forger signatures`;
  } else if (checkId.includes('express-detect-notevil')) {
    return `// Eval avec librairie obsolète
const notevil = require('notevil');

app.post('/eval', express.json(), (req, res) => {
  try {
    const result = notevil(req.body.expression);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
// notevil est non maintenue et vulnérable`;
  } else if (checkId.includes('detect-non-literal-regexp')) {
    return `// Regex dynamique - ReDoS possible
app.get('/search', (req, res) => {
  const pattern = req.query.pattern;
  
  // Regex créée dynamiquement = ReDoS
  const regex = new RegExp(pattern, 'i');
  const matches = data.filter(item => 
    regex.test(item.text)
  );
  
  res.json(matches);
});
// Attaque: pattern = "(a+)+b" sur longue chaîne = freeze`;
  } else if (checkId.includes('express-libxml-vm-noent')) {
    return `// XML parsing - XXE possible
const libxmljs = require('libxmljs');

app.post('/parse-xml', express.text(), (req, res) => {
  const doc = libxmljs.parseXml(req.body, {
    noent: true, // ✗ Enabled = XXE vulnérable
    dtdload: true
  });
  
  res.json({ parsed: true });
});
// Attaque: <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>`;
  } else if (checkId.includes('express-check-directory-listing')) {
    return `// Static files - Directory listing activé
const express = require('express');

app.use(express.static('public'));

// Pas d'option pour désactiver directory listing
// GET /public/ affiche tous les fichiers
// Utilisateur peut découvrir structure interne`;
  } else if (checkId.includes('template-explicit-unescape')) {
    return `//- Pug template - Contenu non échappé
div#user-profile
  h1!= userName
  p!= userBio
  img(src=userPhoto)
  
//- = escapes, != doesn't escape
//- Attaque: userName = "<img onerror='alert()'>"`
  } else if (checkId.includes('code-string-concat')) {
    return `// Concaténation dans eval - Injection
app.post('/filter', express.json(), (req, res) => {
  const filterField = req.body.field;
  const filterValue = req.body.value;
  
  // Injection via concaténation
  const results = data.filter(item =>
    eval(\`item.\${filterField} == '\${filterValue}'\`)
  );
  
  res.json(results);
});
// Attaque: field = "__proto__.isAdmin", value = "true"`;
  } else if (checkId.includes('unknown-value-with-script-tag')) {
    return `// Video subtitles - Injection en script tag
async function loadVideo(videoId) {
  const subtitles = await fetch(\`/api/subs/\${videoId}\`);
  const subsData = await subtitles.text();
  
  const html = \`
    <video>
      <script>
        const subtitles = \${subsData};
      </script>
    </video>
  \`;
  
  document.body.innerHTML = html;
}
// Attaque: subsData = "};alert();var x={'</script>"`
  } else if (checkId.includes('unsafe-formatstring')) {
    return `// Format string en logging
app.get('/log', (req, res) => {
  const message = req.query.msg;
  
  // Format string vulnerability
  console.log(message);
  
  // Attaquant peut faire: /log?msg=%x%x%x
  // Lit la pile mémoire
  res.send('Logged');
});`;
  } else if (checkId.includes('unsafe-formatstring')) {
    return `app.post('/log', express.json(), (req, res) => {
  const message = req.body.msg;
  // Format string vulnerability
  console.log(message);
  
  // Attaquant peut faire: /log?msg=%x%x%x
  // Lit la pile mémoire
  res.send('Logged');
});`;
  } else {
    return `// Code vulnérable 
// Vérifier le message de la faille pour les détails`;
  }
}

function generateCorrectedCode(vulnerability) {
  const checkId = vulnerability.check_id;
  
  if (checkId.includes('sequelize-injection')) {
    return `const { Op } = require('sequelize');
app.get('/search', (req, res) => {
  const query = req.query.q;
  // Utiliser les paramètres correctement
  User.findAll({
    where: {
      name: {
        [Op.like]: query
      }
    }
  }).then(users => res.json(users));
});`;
  } else if (checkId.includes('detected-replaceall-sanitization')) {
    return `import DOMPurify from 'dompurify';
const sanitized = DOMPurify.sanitize(userInput);
document.getElementById('output').innerHTML = sanitized;`;
  } else if (checkId.includes('insecure-document-method')) {
    return `const userInput = req.body.input;
// Utiliser textContent au lieu de innerHTML
document.getElementById('target').textContent = userInput;`;
  } else if (checkId.includes('detected-jwt-token')) {
    return `const token = process.env.JWT_TOKEN;
// Jamais hardcoder les secrets
const verified = jwt.verify(token, process.env.JWT_SECRET);`;
  } else if (checkId.includes('detected-generic-secret')) {
    return `require('dotenv').config();
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;`;
  } else if (checkId.includes('missing-integrity')) {
    return `<script src="https://cdn.example.com/lib.js" 
  integrity="sha384-ABC123..."
  crossorigin="anonymous"></script>`;
  } else if (checkId.includes('prototype-pollution')) {
    return `const safeObj = Object.create(null);
// Ou utiliser Map
const safeMap = new Map();
safeMap.set(key, value);`;
  } else if (checkId.includes('express-sendfile')) {
    return `const path = require('path');
const { normalize } = require('path');
app.get('/download', (req, res) => {
  const filePath = normalize(req.query.file);
  const basePath = normalize('./public');
  if (!filePath.startsWith(basePath)) {
    return res.status(403).send('Accès refusé');
  }
  res.sendFile(filePath);
});`;
  } else if (checkId.includes('eval-detected')) {
    return `// Solution 1: Utiliser JSON.parse pour JSON
const data = JSON.parse(userInput);
// Solution 2: Utiliser Function() avec prudence
const fn = new Function('return ' + sanitizedCode)();
// Solution 3: Utiliser une librairie comme vm2`;
  } else if (checkId.includes('express-open-redirect')) {
    return `const url = require('url');
const allowedDomains = ['trusted.com', 'partner.com'];
app.get('/redirect', (req, res) => {
  try {
    const redirectUrl = new URL(req.query.url);
    if (!allowedDomains.includes(redirectUrl.hostname)) {
      return res.status(400).send('URL non autorisée');
    }
    res.redirect(redirectUrl.toString());
  } catch (e) {
    res.status(400).send('URL invalide');
  }
});`;
  } else if (checkId.includes('hardcoded-hmac-key')) {
    return `const crypto = require('crypto');
const secret = process.env.HMAC_SECRET;
const hmac = crypto.createHmac('sha256', secret)
  .update(data)
  .digest('hex');`;
  } else if (checkId.includes('express-detect-notevil')) {
    return `// Au lieu de notevil, valider les données
const { safeEval } = require('safer-eval');
const result = safeEval(code, context);`;
  } else if (checkId.includes('detect-non-literal-regexp')) {
    return `
// ❌ Mauvais: const regex = new RegExp(userInput);
// ✅ Bon: utiliser des patterns prédéfinis
const patterns = {
  email: /^[^@]+@[^@]+\\.[^@]+$/,
  phone: /^\\d{10}$/
};
const regex = patterns[type];`;
  } else if (checkId.includes('express-libxml-vm-noent')) {
    return `const libxmljs = require('libxmljs');
const doc = libxmljs.parseXml(xmlData, {
  noent: false, // ✅ Désactiver l'expansion d'entités
  dtdload: false // ✅ Désactiver le chargement DTD
});`;
  } else if (checkId.includes('express-check-directory-listing')) {
    return `app.use(express.static('public', {
  index: false // Désactiver directory listing
}));
// Ou sans index
app.use((req, res, next) => {
  if (req.url.endsWith('/')) {
    return res.status(403).send('Accès refusé');
  }
  next();
});`;
  } else if (checkId.includes('template-explicit-unescape')) {
    return `//- ❌ Mauvais: != userContent
//- ✅ Bon: utiliser l'échappement par défaut
= userContent
//- ou explicitement
= escapeHtml(userContent)`;
  } else {
    return `// Implémenter les corrections de sécurité
// basées sur les recommandations produites`;
  }
}

// Fonction pour créer la première page (résumé)
function createSummaryPage(doc, projectName, scanDate, stats, vulnerabilities) {
  // En-tête principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("SecureScan", 20, 25);
  
  // Sous-titre
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(50, 100, 200);
  doc.text("Rapport de sécurité automatisé", 20, 35);
  doc.setTextColor(0, 0, 0);
  
  // Informations du scan
  doc.setFontSize(10);
  doc.text(`Projet : ${projectName}`, 20, 45);
  doc.text(`Date du scan : ${scanDate}`, 20, 50);
  
  // Résumé des vulnérabilités (à droite)
  const summaryX = 130;
  const summaryY = 15;
  const summaryWidth = 70;
  
  // En-tête du résumé
  doc.setFillColor(40, 50, 70);
  doc.rect(summaryX, summaryY, summaryWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Résumé des vulnérabilités", summaryX + 2, summaryY + 5);
  
  // Blocs de couleur pour chaque niveau
  let currentY = summaryY + 8;

  let highCount = vulnerabilities.filter(v => v.severity === "HIGH").length;
  let mediumCount = vulnerabilities.filter(v => v.severity === "MEDIUM").length;
  let lowCount = vulnerabilities.filter(v => v.severity === "LOW").length;
      
  
  // HIGH
  doc.setFillColor(220, 100, 100);
  doc.rect(summaryX, currentY, summaryWidth, 6, 'F');
  doc.text(`HIGH : ${highCount}`, summaryX + 2, currentY + 4);
  currentY += 6;
  
  // MEDIUM
  doc.setFillColor(255, 200, 100);
  doc.rect(summaryX, currentY, summaryWidth, 6, 'F');
  doc.text(`MEDIUM : ${mediumCount}`, summaryX + 2, currentY + 4);
  currentY += 6;
  
  // LOW
  doc.setFillColor(200, 200, 100);
  doc.rect(summaryX, currentY, summaryWidth, 6, 'F');
  doc.text(`LOW : ${lowCount}`, summaryX + 2, currentY + 4);
  currentY += 6;

  // Total
  doc.setFillColor(0, 0, 0);
  doc.rect(summaryX, currentY, summaryWidth, 6, 'F');
  doc.text(`TOTAL : ${highCount + mediumCount + lowCount}`, summaryX + 2, currentY + 4);
  currentY += 6;
  
  // Tableau des vulnérabilités détectées
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(50, 100, 200);
  doc.text("Vulnérabilités détectées", 20, 65);
  doc.setTextColor(0, 0, 0);
  
  // En-tête du tableau
  const tableY = 70;
  doc.setFillColor(40, 50, 70);
  doc.rect(20, tableY, 170, 7, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Outil", 22, tableY + 5);
  doc.text("Chemin", 45, tableY + 5);
  doc.text("Type", 100, tableY + 5);
  doc.text("Sévérité", 130, tableY + 5);
  doc.text("OWASP", 155, tableY + 5);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  // Lignes du tableau - Afficher TOUTES les vulnérabilités
  let rowY = tableY + 7;
  let tablePageIndex = 1;
  let rowsPerPage = 45; // Nombre de lignes qui tiennent sur une page
  let rowCount = 0;
  
  vulnerabilities.forEach((vuln, index) => {
    // Vérifier si on doit créer une nouvelle page
    if (rowCount > 0 && rowCount % rowsPerPage === 0) {
      doc.addPage();
      tablePageIndex++;
      rowY = 20;
      
      // Redessiner l'en-tête à chaque nouvelle page
      doc.setFillColor(40, 50, 70);
      doc.rect(20, rowY, 170, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Outil", 22, rowY + 5);
      doc.text("Chemin", 45, rowY + 5);
      doc.text("Type", 100, rowY + 5);
      doc.text("Sévérité", 130, rowY + 5);
      doc.text("OWASP", 155, rowY + 5);
      
      rowY += 7;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    }
    
    if (rowCount % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, rowY, 170, 4, 'F');
    }
    
    doc.setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.text(vuln.outil.substring(0, 8), 22, rowY + 2.5);
    doc.text(vuln.path.substring(0, 25), 45, rowY + 2.5);
    
    // Couleur selon la sévérité
    if (vuln.severity === "HIGH") doc.setTextColor(200, 0, 0);
    else if (vuln.severity === "MEDIUM") doc.setTextColor(200, 100, 0);
    else if (vuln.severity === "LOW") doc.setTextColor(100, 100, 0);
    
    doc.setFont("helvetica", "bold");
    doc.text(vuln.severity, 130, rowY + 2.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    doc.text(vuln.owasp_id || 'N/A', 155, rowY + 2.5);
    rowY += 4;
    rowCount++;
  });
}

// Templates pour chaque type de vulnérabilité
const vulnerabilityTemplates = {
  "Broken Access Control": {
    description: "Les utilisateurs peuvent accéder à des ressources auxquelles ils n'ont pas droit.",
    recommendations: [
      "• Implémenter un système de vérification des droits (RBAC/ABAC)",
      "• Vérifier les permissions avant chaque opération sensible",
      "• Utiliser les principes du moindre privilège",
      "• Tester les contrôles d'accès dans tous les scénarios"
    ]
  },
  "Cryptographic Failures": {
    description: "Exposition de données sensibles due à une cryptographie faible ou manquante.",
    recommendations: [
      "• Utiliser HTTPS/TLS pour toutes les communications",
      "• Utiliser bcrypt, Argon2 ou PBKDF2 pour les mots de passe",
      "• Générer des clés cryptographiques de bonne entropie",
      "• Stocker les données sensibles chiffrées"
    ]
  },
  "Injection SQL": {
    description: "Les injections SQL permettent d'injecter du code malveillant dans les requêtes.",
    recommendations: [
      "• Utiliser des requêtes paramétrées/prepared statements",
      "• Valider et nettoyer toutes les entrées utilisateur",
      "• Utiliser un ORM (Sequelize, TypeORM, Prisma)",
      "• Mettre en place une liste blanche de valeurs acceptées"
    ]
  },
  "Path Traversal": {
    description: "Accès à des fichiers en dehors du répertoire autorisé via traversée de chemin.",
    recommendations: [
      "• Valider et canonicaliser tous les chemins de fichier",
      "• Utiliser une liste blanche de fichiers autorisés",
      "• Stocker les fichiers en dehors de la racine web",
      "• Implémenter des contrôles d'accès appropriés"
    ]
  },
  "Code Quality": {
    description: "Problèmes de qualité de code pouvant affecter la sécurité.",
    recommendations: [
      "• Analyser régulièrement le code avec des outils statiques",
      "• Suivre les bonnes pratiques de sécurité du code",
      "• Implémenter des tests de sécurité automatisés",
      "• Effectuer des code reviews régulières"
    ]
  }
};

// Fonction pour créer une page de vulnérabilité
function createVulnerabilityPage(doc, vulnerabilityType, vulnerabilitiesOfType) {
  doc.addPage();
  
  const template = vulnerabilityTemplates[vulnerabilityType] || {
    description: "Vulnérabilité détectée",
    recommendations: [
      "• Analyser la vulnérabilité",
      "• Implémenter les corrections",
      "• Tester les changements"
    ]
  };
  
  // En-tête
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SecureScan", 20, 20);
  
  // Titre
  doc.setFontSize(14);
  doc.setTextColor(50, 100, 200);
  doc.text(`Vulnérabilité : ${vulnerabilityType}`, 20, 35);
  doc.setTextColor(0, 0, 0);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Nombre d'instances trouvées : ${vulnerabilitiesOfType.length}`, 20, 40);
  
  // Description
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description :", 20, 48);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(template.description, 170);
  doc.setFontSize(9);
  let descY = 53;
  descLines.forEach(line => {
    doc.text(line, 20, descY);
    descY += 4;
  });
  descY += 3;
  
  // Premier exemple
  const firstExample = vulnerabilitiesOfType[0];
  
  // Code vulnérable
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Code vulnérable :", 20, descY);
  descY += 3;
  
  const vulnerableCode = generateVulnerableCode(firstExample);
  const vulnCodeHeight = drawCodeBlock(
    doc,
    vulnerableCode,
    20,
    descY,
    170,
    [255, 245, 200]
  );
  descY += vulnCodeHeight + 5;
  
  // Vérifier si on a besoin d'une nouvelle page
  if (descY > 240) {
    doc.addPage();
    descY = 20;
  }
  
  // Code corrigé
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Bonne pratique :", 20, descY);
  descY += 3;
  
  const correctedCode = generateCorrectedCode(firstExample);
  const corrCodeHeight = drawCodeBlock(
    doc,
    correctedCode,
    20,
    descY,
    170,
    [220, 250, 220]
  );
  descY += corrCodeHeight + 5;
  
  // Vérifier si on a besoin d'une nouvelle page
  if (descY > 240) {
    doc.addPage();
    descY = 20;
  }
  
  // Recommandations
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(50, 100, 200);
  doc.text("Recommandations", 20, descY);
  doc.setTextColor(0, 0, 0);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  let recY = descY + 7;
  template.recommendations.forEach(rec => {
    if (recY < doc.internal.pageSize.getHeight() - 35) {
      doc.text(rec, 20, recY);
      recY += 5;
    }
  });
  
  // Liste des fichiers affectés si plusieurs instances
  if (vulnerabilitiesOfType.length > 1) {
    recY += 5;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(50, 100, 200);
    doc.text("Fichiers affectés", 20, recY);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    let fileY = recY + 7;
    
    vulnerabilitiesOfType.forEach((vuln, index) => {
      const fileText = `${index + 1}. ${vuln.path}:${vuln.line}`;
      doc.text(fileText, 20, fileY);
      fileY += 4;
      
      if (fileY > doc.internal.pageSize.getHeight() - 15) {
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("SecureScan", 20, 20);
        doc.setFontSize(11);
        doc.setTextColor(50, 100, 200);
        doc.text(`Fichiers affectés - ${vulnerabilityType}`, 20, 35);
        doc.setTextColor(0, 0, 0);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        fileY = 45;
      }
    });
  }
}

// Fonction principale pour générer le rapport
function generateSecurityReport(scanData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Extraire les données
  const { projet, vulnerabilities, stats } = scanData;
  const projectName = projet.name;
  const scanDate = new Date(projet.scan_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Page de résumé
  createSummaryPage(doc, projectName, scanDate, stats, vulnerabilities);

  // Créer une page pour chaque TYPE de vulnérabilité (regroupé par owasp_id)
  const groupedByType = {};
  
  vulnerabilities.forEach(vuln => {
    // Mapper l'owasp_id au type de vulnérabilité
    const vulnType = owaspMapping[vuln.owasp_id] || "Code Quality";
    if (!groupedByType[vulnType]) {
      groupedByType[vulnType] = [];
    }
    groupedByType[vulnType].push(vuln);
  });

  // Créer une page pour chaque type unique
  Object.entries(groupedByType).forEach(([type, vulnsOfType]) => {
    createVulnerabilityPage(doc, type, vulnsOfType);
  });
  
  return doc;
}

// Exporter la fonction pour utilisation externe
export { generateSecurityReport };