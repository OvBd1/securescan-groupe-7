import { analyzeRepo } from '../services/gitServices.js';
import db from '../config/db.config.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllProjects = async (req, res) => {
  try {
    // Logique pour récupérer tous les projets
    res.status(200).json({ message: 'Tous les projets récupérés avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des projets', error });
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
    // Logique pour supprimer un projet par ID
    res.status(200).json({ message: `Projet avec ID ${id} supprimé avec succès` });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du projet', error });
  }
};