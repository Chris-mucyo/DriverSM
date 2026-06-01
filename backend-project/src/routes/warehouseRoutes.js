import express from 'express';
import {
    getAllWarehouses,
    getWarehouseByCode,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
} from '../controllers/warehouseController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllWarehouses);
router.get('/:code', getWarehouseByCode);
router.post('/', createWarehouse);
router.put('/:code', updateWarehouse);
router.delete('/:code', deleteWarehouse);

export default router;