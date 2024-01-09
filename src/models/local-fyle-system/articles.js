import { validateInputArticle } from '../../schemas/articles.js';
import { readJSON } from '../../utils/readJSON.js';
import { randomUUID } from 'node:crypto';

const articles = readJSON('../../articles.json');

export async function getAllModel({ category }) {
	try {
		if (!category) return { code: 200, response: articles };

		const filteredArticles = articles.filter(article =>
			article.category.some(c => c.toLowerCase() === category.toLowerCase()),
		);
		if (filteredArticles.length === 0) throw new Error(`${category} not found`);

		return { code: 200, response: filteredArticles };
	} catch (e) {
		return { code: 400, response: e.message };
	}
}

export async function getByIdModel({ id }) {
	try {
		const findArticle = articles.find(article => article.id === parseInt(id));

		if (findArticle.length === 0) throw new Error(`${category} not found`);

		return { code: 200, response: findArticle };
	} catch (error) {
		return { code: 400, response: findArticle };
	}
}

export async function createModel({ input }) {
	const result = validateInputArticle(req.body);

	if (!result.success) {
		return res.status(400).json({ error: JSON.parse(result.error.message) });
	}

	const newArticle = {
		id: randomUUID(),
		...input,
	};

	articles.push(newArticle);

	return newArticle;
}

export async function updateModel({ id, input }) {
	const articleIndex = articles.findIndex(
		article => article.id === parseInt(id),
	);

	if (articleIndex === -1) {
		return { code: 400, response: { error: 'article not found' } };
	}

	const updateArticle = {
		...articles[articleIndex],
		...input,
	};

	articles[articleIndex] = updateArticle;

	return { code: 201, response: updateArticle };
}

export async function removeModel({ id }) {
	const articleIndex = articles.findIndex(
		article => article.id === parseInt(id),
	);

	if (articleIndex === -1) {
		return { code: 400, response: { message: 'article not found' } };
	}

	articles.splice(articleIndex, 1);

	return { code: 200, response: { message: 'article deleted' } };
}
