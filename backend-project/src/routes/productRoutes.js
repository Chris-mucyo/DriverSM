import express from 'express';
import {
    getAllProducts,
    getProductByCode,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllProducts);
router.get('/:code', getProductByCode);
router.post('/', createProduct);
router.put('/:code', updateProduct);
router.delete('/:code', deleteProduct);

export default router;