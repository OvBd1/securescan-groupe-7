import { Router } from 'express';
import { getAllProjects, getProjectById, createProject, deleteProject, getProjectDashboard, downloadProjectPdf } from '../controllers/projetController.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.get('/:id/dashboard', getProjectDashboard);
router.post('/', createProject);
router.delete('/:id', deleteProject);
router.get('/:id/export-pdf', downloadProjectPdf);

export default router;