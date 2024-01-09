import {
	validateInputArticle,
	partialValidateInputArticle,
} from '../../schemas/articles.js';
import { randomUUID } from 'node:crypto';
import { connectionDB } from '../../DB/connection.js';
import { ClientError } from '../../utils/errors.js';

export async function getAllModel({ category }) {
	const connection = await connectionDB();

	if (!category) {
		const [articles] = await connection.execute(
			'SELECT a.article_id, a.title, a.content, c.category FROM articles a LEFT JOIN categories c ON a.article_id = c.article_id;',
		);

		return articles;
	}

	const [article] = await connection.execute(
		'SELECT a.article_id, a.title, a.content, c.category FROM articles a LEFT JOIN categories c ON a.article_id = c.article_id WHERE category = ?;',
		[category],
	);

	if (article.length === 0) throw new ClientError('category not found');

	return article;
}

export async function getByIdModel({ id }) {
	const connection = await connectionDB();

	const [article] = await connection.execute(
		'SELECT a.article_id, a.title, a.content, c.category FROM articles a LEFT JOIN categories c ON a.article_id = c.article_id WHERE a.article_id = ?;',
		[id],
	);

	if (article.length === 0) throw new ClientError('Invalid ID');

	return article;
}

export async function createModel({ input }) {
	// validate input data
	const result = validateInputArticle(input);

	if (!result.success) throw new ClientError('data entered is incorrect');

	const newArticle = {
		id: randomUUID(),
		...result,
	};

	// connect and insert in DB
	const connection = await connectionDB();
	try {
		await connection.beginTransaction();

		await connection.execute(
			'INSERT INTO articles(article_id, title, content) VALUES(?,?,?)',
			[newArticle.id, newArticle.data.title, newArticle.data.content],
		);

		for (let category of newArticle.data.category) {
			await connection.execute(
				'INSERT INTO categories(article_id, category) VALUES(?,?)',
				[newArticle.id, category],
			);
		}

		await connection.commit();

		return {
			message: 'the article was correctly inserted in the database',
			article_id: newArticle.id,
		};
	} catch (error) {
		await connection.rollback();
		if (error instanceof Error)
			return { success: false, message: error.message, code: error.code };
	}
}

export async function updateModel({ id, input }) {
	const result = partialValidateInputArticle(input);

	if (!result.success) throw new ClientError('data entered is incorrect');

	const connection = await connectionDB();

	let query = 'UPDATE articles SET ';
	let params = [];

	if (result.data.title !== undefined) {
		query += 'title = ?, ';
		params.push(result.data.title);
	}

	if (result.data.content !== undefined) {
		query += 'content = ?, ';
		params.push(result.data.content);
	}

	query = query.slice(0, -2);

	query += ' WHERE article_id = ?';
	params.push(id);

	try {
		await connection.execute(query, params);
		return {
			message: 'The article was correctly updated in the database',
			article_id: id,
		};
	} catch (error) {
		if (error instanceof Error)
			return { success: false, message: error.message, code: error.code };
	}
}

export async function removeModel({ id }) {
	const connection = await connectionDB();

	try {
		await connection.execute('DELETE FROM articles WHERE article_id = ?', [id]);

		return {
			message: 'the article was correctly deleted',
			article_id: id,
		};
	} catch (error) {
		return { success: false, message: error.message, code: error.code };
	}
}
