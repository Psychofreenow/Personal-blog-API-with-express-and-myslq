import { Router } from 'express';
import { singUp, singin } from '../controllers/auth.js';
import { isUserExist } from '../middleware/verifySingup.js';

export const authRouter = Router();

authRouter.post('/singup', [isUserExist], singUp);
authRouter.post('/singin', singin);
