import { Router } from 'express';
import { singUp, singin } from '../controllers/auth.js';
import { isUserExist } from '../middleware/verifySingup.js';
import catchedErrors from '../utils/catchedErrors.js';

export const authRouter = Router();

authRouter.post('/singup', [isUserExist], catchedErrors(singUp));
authRouter.post('/singin', catchedErrors(singin));
