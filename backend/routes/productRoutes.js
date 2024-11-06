import {
    Router
} from "express";
import {
    getProducts,
    getProduct,
    createProduct
} from "../controllers/productController.js";
import {
    protect
} from '../middlewares/Auth.js'

const router = Router(); // Create router instance

router.get('/', protect, getProducts);
router.get('/:id', protect, getProduct);
router.post('/', protect, createProduct);

export default router; // Export the router