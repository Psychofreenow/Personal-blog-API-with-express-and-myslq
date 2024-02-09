import { connectionDB } from '../DB/connection.js';
import { UnauthorizedError } from '../utils/errors.js';

export const isAdmin = async (req, res, next) => {
	let userId = req.id.id;

	try {
		const connection = await connectionDB();
		const [[rolOfUser]] = await connection.execute(
			'SELECT rol_id FROM users WHERE user_id = ?',
			[userId],
		);

		const [[roles]] = await connection.execute(
			'SELECT rol_id FROM roles WHERE rol = "admin"',
		);

		if (rolOfUser.rol_id !== roles.rol_id)
			throw new UnauthorizedError('Unauthorized', 401);

		next();
	} catch (error) {
		if (error.statusCode === 401) {
			next({
				code: error.statusCode,
				response: error.message,
			});
			return;
		}

		next({ completeErrors: error });
	}
};
