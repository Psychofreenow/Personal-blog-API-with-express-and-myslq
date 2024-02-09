import { connectionDB } from '../DB/connection.js';
import { validateInputUser } from '../schemas/user.js';
import { ValidationError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';
import response from '../utils/response.js';

export const createAdminUser = async (req, res, next) => {
	const connection = await connectionDB();

	try {
		const [isAdmin] = await connection.execute(
			'SELECT username FROM users WHERE rol_id = 1',
		);
		if (isAdmin.length !== 0) return next();

		//validate data
		const result = validateInputUser(req.body);
		if (!result.success)
			throw new ValidationError(
				'your input data is invalidated',
				403,
				result.error,
			);

		const { username, email, password } = result.data;

		//encrypted password
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);

		//insert new user
		const [[rol]] = await connection.execute(
			'SELECT rol_id FROM roles WHERE rol = "admin"',
		);

		await connection.execute(
			'INSERT INTO users(username, email, password, rol_id) VALUES(?,?,?,?)',
			[username, email, encryptedPassword, rol.rol_id],
		);

		response(res, 201, { response: 'User was successfully created' });
	} catch (error) {
		if (error.statusCode === 403)
			throw {
				code: error.statusCode,
				response: error.completeErrors,
			};

		throw { completeError: error };
	} finally {
		connection.end();
	}
};
