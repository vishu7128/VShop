import {
    Router
} from "express";
import {
    loginUser,
    registerUser,
    getUserProfile,
    updateUserProfile
} from "../controllers/userController.js";
import {
    protect
} from "../middlewares/Auth.js";

const router = Router(); // Create router instance

router.post('/login', loginUser)
router.post('/register', registerUser)
router.get('/profile', protect, getUserProfile)
router.put('/profile', protect, updateUserProfile)



export default router; // Export the router