import { Router } from 'express';
import multer from 'multer';
import { getAllProjects, getProjectById, createProject, deleteProject, getProjectDashboard, downloadProjectPdf, uploadZipAndScan } from '../controllers/projetController.js';

const router = Router();
const upload = multer({ dest: 'storage/uploads/' });

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.get('/:id/dashboard', getProjectDashboard);
router.post('/', createProject);
router.post('/scan-zip', upload.single('zipFile'), uploadZipAndScan);
router.delete('/:id', deleteProject);
router.get('/:id/export-pdf', downloadProjectPdf);

export default router;