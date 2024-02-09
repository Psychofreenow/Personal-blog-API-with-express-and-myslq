import { Router } from 'express';
import { getByUsername, create, remove } from '../controllers/user.js';
import catchedErrors from '../utils/catchedErrors.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { isAdmin } from '../middleware/verifyRoles.js';
import { isUserExist } from '../middleware/verifySingup.js';

export const userRouter = Router();

userRouter.post('/', [isUserExist, verifyJwt, isAdmin], catchedErrors(create));
userRouter.get('/', [verifyJwt, isAdmin], catchedErrors(getByUsername));
userRouter.delete('/:id', [verifyJwt, isAdmin], catchedErrors(remove));
