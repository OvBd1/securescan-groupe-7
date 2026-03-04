import db from '../config/db.config.js';

// Données OWASP Top 10 2025
const owaspData = [
  {
    id: 'A01:2025',
    name: 'Broken Access Control',
    description: 'Les failles de contrôle d\'accès permettent aux utilisateurs d\'agir en dehors de leurs permissions prévues. Cela peut conduire à la divulgation, la modification ou la destruction non autorisées d\'informations, ou à l\'exécution de fonctions métier en dehors des limites autorisées.'
  },
  {
    id: 'A02:2025',
    name: 'Cryptographic Failures',
    description: 'Les échecs cryptographiques (anciennement Exposition de données sensibles) concernent les failles liées à la cryptographie qui conduisent souvent à l\'exposition de données sensibles telles que les mots de passe, les numéros de carte de crédit et les informations personnelles.'
  },
  {
    id: 'A03:2025',
    name: 'Injection',
    description: 'Les failles d\'injection, telles que SQL, NoSQL, OS et LDAP, se produisent lorsque des données non fiables sont envoyées à un interpréteur dans le cadre d\'une commande ou d\'une requête. Les données hostiles peuvent inciter l\'interpréteur à exécuter des commandes non intentionnelles ou à accéder aux données sans autorisation.'
  },
  {
    id: 'A04:2025',
    name: 'Insecure Design',
    description: 'La conception non sécurisée fait référence aux failles résultant de l\'absence ou de l\'inefficacité des contrôles de conception. Elle nécessite une modélisation des menaces, des modèles de conception sécurisés et des architectures de référence pour réduire les risques.'
  },
  {
    id: 'A05:2025',
    name: 'Security Misconfiguration',
    description: 'La mauvaise configuration de la sécurité est le problème le plus courant. Elle résulte souvent de configurations par défaut non sécurisées, incomplètes ou ad hoc, de stockage cloud ouvert, d\'en-têtes HTTP mal configurés et de messages d\'erreur contenant des informations sensibles.'
  },
  {
    id: 'A06:2025',
    name: 'Vulnerable and Outdated Components',
    description: 'L\'utilisation de composants vulnérables, obsolètes ou non pris en charge peut compromettre la sécurité de l\'application. Cela inclut l\'OS, le serveur web, le système de gestion de base de données, les applications, les API, les bibliothèques et autres composants.'
  },
  {
    id: 'A07:2025',
    name: 'Identification and Authentication Failures',
    description: 'Les failles d\'identification et d\'authentification (anciennement Broken Authentication) permettent aux attaquants de compromettre les mots de passe, les clés ou les jetons de session, ou d\'exploiter d\'autres failles d\'implémentation pour usurper temporairement ou définitivement l\'identité d\'autres utilisateurs.'
  },
  {
    id: 'A08:2025',
    name: 'Software and Data Integrity Failures',
    description: 'Les échecs d\'intégrité des logiciels et des données concernent le code et l\'infrastructure qui ne protègent pas contre les violations d\'intégrité. Cela inclut l\'utilisation de plugins, de bibliothèques ou de modules provenant de sources non fiables, ainsi que les pipelines CI/CD non sécurisés.'
  },
  {
    id: 'A09:2025',
    name: 'Security Logging and Monitoring Failures',
    description: 'L\'absence de journalisation et de surveillance appropriées, couplée à une intégration inefficace avec la réponse aux incidents, permet aux attaquants d\'attaquer davantage les systèmes, de maintenir leur persistance, de pivoter vers d\'autres systèmes et de falsifier, extraire ou détruire des données.'
  },
  {
    id: 'A10:2025',
    name: 'Server-Side Request Forgery (SSRF)',
    description: 'Les failles SSRF se produisent lorsqu\'une application web récupère une ressource distante sans valider l\'URL fournie par l\'utilisateur. Cela permet à un attaquant de forcer l\'application à envoyer une requête construite vers une destination inattendue, même si elle est protégée par un pare-feu ou un VPN.'
  }
];

export const insertOwaspTop10 = async (req, res) => {
  try {
    // Créer la table avec une clé unique sur 'name'
    await db.query(`
      CREATE TABLE IF NOT EXISTS owasp (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(150) NOT NULL UNIQUE,
        description TEXT NOT NULL
      )
    `);

    // INSERT les données OWASP Top 10 2025 avec clé unique sur name
    const query = `
      INSERT INTO owasp (id, name, description) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      description = VALUES(description)
    `;
    
    for (const item of owaspData) {
      await db.query(query, [item.id, item.name, item.description]);
    }

    res.status(201).json({
      message: 'OWASP Top 10 2025 synchronisé avec succès',
      count: owaspData.length,
      data: owaspData
    });
  } catch (error) {
    console.error('Erreur insertOwaspTop10:', error);
    res.status(500).json({
      message: 'Erreur lors de la synchronisation des données OWASP',
      error: error.message
    });
  }
};

export const getAllOwasp = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM owasp ORDER BY id');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erreur getAllOwasp:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération des données OWASP',
      error: error.message
    });
  }
};

export const getOwaspById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM owasp WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vulnérabilité OWASP non trouvée' });
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erreur getOwaspById:', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération de la vulnérabilité OWASP',
      error: error.message
    });
  }
};
