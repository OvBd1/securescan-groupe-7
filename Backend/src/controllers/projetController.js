import { analyzeRepo } from '../services/gitServices.js';

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
    const { url } = req.body;
    
    console.log('Ici', url);
    const resultsFile = await analyzeRepo(url);

    res.status(201).json({ message: 'Projet créé avec succès', project: { resultsFile } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du projet', error });
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