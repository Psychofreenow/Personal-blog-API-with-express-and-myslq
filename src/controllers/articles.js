import {
	createModel,
	getAllModel,
	getByIdModel,
	removeModel,
	updateModel,
} from '../models/mysql/articles.js';

import response from '../utils/response.js';

export async function getAll(req, res) {
	const { category } = req.query;

	const article = await getAllModel({ category });

	response(res, article.code, article);
}

export async function getById(req, res) {
	const { id } = req.params;

	const article = await getByIdModel({ id });

	response(res, 200, article);
}

export async function create(req, res) {
	const newArticle = await createModel({ input: req.body });

	response(res, newArticle.code, newArticle);
}

export async function update(req, res) {
	const { id } = req.params;

	const updateArticle = await updateModel({ id, input: req.body });

	response(res, 200, updateArticle);
}

export async function remove(req, res) {
	const { id } = req.params;

	const deleteArticle = await removeModel({ id });

	return response(res, 200, deleteArticle);
}
