import { connectionDB } from '../DB/connection.js';
import { validateInputUser } from '../schemas/user.js';
import { ClientError, ValidationError } from '../utils/errors.js';

export const isUserExist = async (req, res, next) => {
	try {
		const result = validateInputUser(req.body);
		if (!result.success)
			throw new ValidationError('validate error', 403, result.error);

		const { username, email } = result.data;

		const connection = await connectionDB();

		const [[response]] = await connection.execute(
			'SELECT username, email FROM users WHERE username = ? OR email = ?',
			[username, email],
		);

		if (!response) return next();

		if (response.username === username)
			throw new ClientError('username exist, try another');
		if (response.email === email)
			throw new ClientError('email exist, try another');
	} catch (error) {
		if (error.statusCode === 403) {
			return next({
				code: error.statusCode,
				response: error.completeErrors,
			});
		}

		if (error.statusCode === 400) {
			return next({
				code: error.statusCode,
				response: error.message,
			});
		}

		next({ completeErrors: error });
	}
};
