import { Router } from 'express';
import { getAllScan, getScanById, createScan, deleteScan} from '../controllers/scanController.js';

const router = Router();

router.get('/', getAllScan);
router.get('/:id', getScanById);
router.post('', createScan);
router.delete('/:id', deleteScan);

export default router;