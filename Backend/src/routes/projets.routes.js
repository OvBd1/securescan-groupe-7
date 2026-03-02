import { Router } from 'express';
import { getAllProjects, getProjectById, createProject, deleteProject} from '../controllers/projet.controller.js';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('', createProject);
router.delete('/:id', deleteProject);

export default router;