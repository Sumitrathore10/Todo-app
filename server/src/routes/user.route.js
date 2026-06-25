import { Router } from "express";
import { loginUser, registerUser, logoutUser, currentUser } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/authentication.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticated, currentUser);

export default router;