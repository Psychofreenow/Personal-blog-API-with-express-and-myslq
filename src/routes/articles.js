import { Router } from 'express';
import {
	create,
	getAll,
	getById,
	remove,
	update,
} from '../controllers/articles.js';
import catchedErrors from '../utils/catchedErrors.js';

export const articlesRouter = Router();

articlesRouter.get('/', catchedErrors(getAll));

articlesRouter.get('/:id', catchedErrors(getById));

articlesRouter.post('/', catchedErrors(create));

articlesRouter.patch('/:id', catchedErrors(update));

articlesRouter.delete('/:id', catchedErrors(remove));
