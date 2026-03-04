import { analyzeRepo } from '../services/gitServices.js';
import db from '../config/db.config.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllProjects = async (req, res) => {
  try {
    const { userId } = req.query; 

    if (!userId) return res.status(400).json({ message: "userId manquant" });

    const [projects] = await db.query(
      `SELECT p.id, p.name, p.source_path, s.global_score, s.status, s.started_at,
              COUNT(v.id) as total_vulns,
              SUM(CASE WHEN v.severity = 'CRITICAL' THEN 1 ELSE 0 END) as critical_vulns
       FROM projets p
       LEFT JOIN scans s ON p.id = s.projet_id
       LEFT JOIN vulnerabilities v ON s.id = v.scan_id
       WHERE p.user_id = ?
       GROUP BY p.id, s.id
       ORDER BY s.started_at DESC`,
      [userId]
    );

    res.status(200).json(projects);
  } catch (error) {
    console.error('Erreur getAllProjects:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    // Logique pour récupérer un projet par ID
    res.status(200).json({ message: `Projet avec ID ${id} récupéré avec succès` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du projet', error });
  }
};

export const getProjectDashboard = async (req, res) => {
  try {
    const { id } = req.params;

    const [scans] = await db.query(
      `SELECT p.name, p.source_path, s.id as scan_id, s.global_score, s.started_at, s.status 
       FROM projets p 
       JOIN scans s ON p.id = s.projet_id 
       WHERE p.id = ? 
       ORDER BY s.started_at DESC LIMIT 1`,
      [id]
    );

    if (scans.length === 0) {
      return res.status(404).json({ message: "Aucun scan trouvé pour ce projet" });
    }
    const scan = scans[0];
    const [vulnerabilities] = await db.query(
      `SELECT * FROM vulnerabilities WHERE scan_id = ?`,
      [scan.scan_id]
    );

    res.status(200).json({ scan, vulnerabilities });
  } catch (error) {
    console.error('Erreur getProjectDashboard:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createProject = async (req, res) => {
  let scanId = null;

  try {
    const { url, userId } = req.body;

    if (!url || !userId) {
      return res.status(400).json({ message: 'URL et userId sont requis' });
    }

    const projectId = uuidv4();
    scanId = uuidv4(); 
    const projectName = url.split('/').pop().replace('.git', '');

    await db.query(
      'INSERT INTO projets (id, user_id, name, type, source_path) VALUES (?, ?, ?, ?, ?)',
      [projectId, userId, projectName, 'GIT_REPO', url]
    );

    await db.query(
      'INSERT INTO scans (id, projet_id, status, started_at) VALUES (?, ?, ?, ?)',
      [scanId, projectId, 'RUNNING', new Date()]
    );

    console.log(`⏳ Projet ${projectName} créé. Lancement du Scan ID: ${scanId}...`);
    const parsedData = await analyzeRepo(url, projectId, userId);
    await db.query(
      'UPDATE scans SET status = ?, global_score = ?, finished_at = ? WHERE id = ?',
      ['COMPLETED', parsedData.projet.global_score, new Date(), scanId]
    );

    if (parsedData.vulnerabilities && parsedData.vulnerabilities.length > 0) {
      const values = parsedData.vulnerabilities.map(v => [
        v.id, 
        scanId,             
        v.owasp_id || null, 
        v.outil, 
        v.check_id, 
        v.path, 
        v.line, 
        v.severity, 
        v.message, 
        JSON.stringify(v.code_snippet), 
        v.is_fixed || 0
      ]);

      await db.query(
        'INSERT INTO vulnerabilities (id, scan_id, owasp_id, outil, check_id, path, line, severity, message, code_snippet, is_fixed) VALUES ?',
        [values]
      );
    }

    console.log(`✅ Scan terminé ! ${parsedData.stats.total} vulnérabilités trouvées.`);

    res.status(201).json({ 
      message: 'Analyse terminée avec succès', 
      project: parsedData.projet,
      stats: parsedData.stats
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création du projet:', error);
  
    if (scanId) {
      await db.query('UPDATE scans SET status = ?, finished_at = ? WHERE id = ?', ['FAILED', new Date(), scanId]).catch(console.error);
    }

    res.status(500).json({ message: 'Erreur lors de l\'analyse', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM projets WHERE id = ?', [id]);
    res.status(200).json({ message: `Projet ${id} supprimé avec succès` });
  } catch (error) {
    console.error('Erreur deleteProject:', error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};