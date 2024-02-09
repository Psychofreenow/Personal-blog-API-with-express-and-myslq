import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../PRIVATE_KEY.js';
import { connectionDB } from '../DB/connection.js';
import { ClientError, UnauthorizedError } from '../utils/errors.js';

export const verifyJwt = async (req, res, next) => {
	let token = req.headers['x-access-token'];
	const connection = await connectionDB();

	try {
		if (!token) throw new UnauthorizedError('No token provided', 401);

		const decoded = jwt.verify(token, PRIVATE_KEY);
		req.id = decoded;

		const [user] = await connection.execute(
			'SELECT username FROM users WHERE user_id = ?',
			[req.id.id],
		);

		if (user.length === 0) throw new ClientError('no user found', 400);

		next();
	} catch (error) {
		if (error.statusCode === 401) {
			next({
				code: error.statusCode,
				response: error.message,
			});
			return;
		}

		if (error.statusCode === 400) {
			next({
				code: error.statusCode,
				response: error.message,
			});
			return;
		}

		next({ completeErrors: error });
	} finally {
		connection.end();
	}
};
