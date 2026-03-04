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
  try {
    const { url, userId } = req.body;

    if (!url || !userId) {
      return res.status(400).json({ message: 'URL et userId sont requis' });
    }

    const projectId = uuidv4();
    const projectName = url.split('/').pop();

    const [result] = await db.query(
      'INSERT INTO projets (id, user_id, name, type, source_path, global_score, scan_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [projectId, userId, projectName, 'GIT_REPO', url, 0, new Date()]
    );

    console.log('Projet créé avec ID:', projectId);

    // Lancer l'analyse 
    await analyzeRepo(url, projectId, userId);

    res.status(201).json({ 
      message: 'Projet créé avec succès', 
      project: { id: projectId, name: projectName, url } 
    });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({ message: 'Erreur lors de la création du projet', error: error.message });
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