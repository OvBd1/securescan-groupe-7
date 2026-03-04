import { Router } from 'express';
import { getAllProjects, getProjectById, createProject, deleteProject, getProjectDashboard } from '../controllers/projetController.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.get('/:id/dashboard', getProjectDashboard);
router.post('/', createProject);
router.delete('/:id', deleteProject);

export default router;