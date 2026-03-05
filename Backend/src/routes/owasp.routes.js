import { Router } from 'express';
import { insertOwaspTop10, getAllOwasp, getOwaspById } from '../controllers/owaspController.js';

const router = Router();

router.post('/', insertOwaspTop10);
router.get('/', getAllOwasp);
router.get('/:id', getOwaspById);

export default router;
