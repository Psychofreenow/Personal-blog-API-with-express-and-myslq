import {
	validateInputArticle,
	partialValidateInputArticle,
} from '../../schemas/articles.js';
import { randomUUID } from 'node:crypto';
import { connectionDB } from '../../DB/connection.js';
import { ClientError } from '../../utils/errors.js';

export async function getAllModel({ category }) {
	const connection = await connectionDB();

	try {
		if (!category) {
			const [articles] = await connection.execute(
				'SELECT a.article_id, a.title, a.content, c.category FROM articles a LEFT JOIN categories c ON a.article_id = c.article_id;',
			);

			return { code: 200, response: articles };
		}

		const [article] = await connection.execute(
			'SELECT a.article_id, a.title, a.content, c.category FROM articles a LEFT JOIN categories c ON a.article_id = c.article_id WHERE category = ?;',
			[category],
		);

		if (article.length === 0) throw new ClientError('category not found');

		return { code: 200, response: article };
	} catch (error) {
		if (error.statusCode === 400)
			throw {
				code: error.statusCode,
				response: error.message,
			};

		throw { completeError: error };
	} finally {
		connection.end();
	}
}

export async function getByIdModel({ id }) {
	const connection = await connectionDB();

	try {
		const [article] = await connection.execute(
			'SELECT a.article_id, a.title, a.content, c.category FROM articles a LEFT JOIN categories c ON a.article_id = c.article_id WHERE a.article_id = ?;',
			[id],
		);

		if (article.length === 0) throw new ClientError('Invalid ID');

		return { code: 200, response: article };
	} catch (error) {
		if (error.statusCode === 400)
			throw {
				code: error.statusCode,
				response: error.message,
			};
		throw { completeError: error };
	} finally {
		connection.end();
	}
}

export async function createModel({ input }) {
	const connection = await connectionDB();

	try {
		// validate input data
		const result = validateInputArticle(input);

		if (!result.success) throw new ClientError('your input data is not valid');

		const newArticle = {
			id: randomUUID(),
			...result,
		};

		//Insert data articles
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
			code: 201,
			message: `the article was insert in database with id ${newArticle.id}`,
		};
	} catch (error) {
		await connection.rollback();

		if (error.statusCode === 400)
			throw {
				code: error.statusCode,
				response: error.message,
			};
		throw { completeError: error };
	} finally {
		connection.end();
	}
}

export async function updateModel({ id, input }) {
	const connection = await connectionDB();
	try {
		//Validate input data
		const result = partialValidateInputArticle(input);

		if (!result.success) throw new ClientError('data entered is incorrect');

		const [article] = await connection.execute(
			'SELECT title FROM articles WHERE article_id = ?',
			[id],
		);

		if (article.length === 0) throw new ClientError('invalid id');

		//Building query to update the article

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

		await connection.execute(query, params);
		return {
			code: 204,
			message: `The article with id ${id} was updated`,
		};
	} catch (error) {
		if (error.statusCode === 400)
			throw {
				code: error.statusCode,
				response: error.message,
			};
		throw { completeError: error };
	} finally {
		connection.end();
	}
}

export async function removeModel({ id }) {
	const connection = await connectionDB();

	try {
		const [article] = await connection.execute(
			'SELECT title FROM articles WHERE article_id = ?',
			[id],
		);

		if (article.length === 0) throw new ClientError('invalid id');

		await connection.execute('DELETE FROM articles WHERE article_id = ?', [id]);

		return {
			code: 204,
			response: 'the article with id ${id} was correctly deleted',
		};
	} catch (error) {
		if (error.statusCode === 400)
			throw {
				code: error.statusCode,
				response: error.message,
			};
		throw { completeError: error };
	}
}
