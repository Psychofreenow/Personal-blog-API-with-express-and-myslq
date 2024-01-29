import { Router } from 'express';
import {
	create,
	getAll,
	getById,
	remove,
	update,
} from '../controllers/articles.js';
import catchedErrors from '../utils/catchedErrors.js';
import { isAdmin } from '../middleware/verifyRoles.js';
import { verifyJwt } from '../middleware/verifyJwt.js';

export const articlesRouter = Router();

articlesRouter.get('/', catchedErrors(getAll));

articlesRouter.get('/:id', catchedErrors(getById));

articlesRouter.post('/', [verifyJwt, isAdmin], catchedErrors(create));

articlesRouter.patch('/:id', [verifyJwt, isAdmin], catchedErrors(update));

articlesRouter.delete('/:id', [verifyJwt, isAdmin], catchedErrors(remove));
