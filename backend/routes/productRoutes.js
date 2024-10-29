import {
    Router
} from "express";
import {
    getProducts,
    getProduct,
    createProduct
} from "../controllers/productController.js";

const router = Router(); // Create router instance

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);

export default router; // Export the router