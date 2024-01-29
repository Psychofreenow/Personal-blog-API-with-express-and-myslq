import { connectionDB } from '../DB/connection.js';
import { validateInputUser } from '../schemas/user.js';
import { ClientError, ValidationError } from '../utils/errors.js';

export const isUserExist = async (req, res, next) => {
	try {
		const result = validateInputUser(req.body);
		if (!result.success)
			throw new ValidationError('validation error', 400, result.error);

		const { username, email } = result.data;

		const connection = await connectionDB();

		const [[respuesta]] = await connection.execute(
			'SELECT username, email FROM users WHERE username = ? OR email = ?',
			[username, email],
		);

		if (!respuesta) return next();

		if (respuesta.username === username)
			throw new ClientError('username exist, try another');
		if (respuesta.email === email)
			throw new ClientError('email exist, try another');
	} catch (error) {
		return res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};
