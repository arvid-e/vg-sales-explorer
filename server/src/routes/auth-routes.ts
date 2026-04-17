import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { AuthService } from '../services/auth-service.js';

const router = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

router.get('/login', authController.login);
router.get('/callback', authController.callback);

export default router;
