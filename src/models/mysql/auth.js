import { connectionDB } from '../../DB/connection.js';
import { validateInputUser } from '../../schemas/user.js';
import { validateInputUserLogin } from '../../schemas/userLogin.js';
import bcrypt from 'bcryptjs';
import { UnauthorizedError, ValidationError } from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../../PRIVATE_KEY.js';

export const createUserModel = async ({ input }) => {
	const connection = await connectionDB();
	try {
		//validate data
		const result = validateInputUser(input);

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
			'SELECT rol_id FROM roles WHERE rol = "user_generic"',
		);

		await connection.execute(
			'INSERT INTO users(username, email, password, rol_id) VALUES(?,?,?,?)',
			[username, email, encryptedPassword, rol.rol_id],
		);

		return { code: 201, response: 'User was successfully created' };
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

export const loginUserModel = async ({ input }) => {
	const connection = await connectionDB();

	try {
		//validate data
		const result = validateInputUserLogin(input);

		if (!result.success)
			throw new ValidationError(
				'your input data is invalidated',
				403,
				result.error,
			);

		const { username, password } = result.data;

		const [user] = await connection.execute(
			'SELECT user_id, username, password FROM users WHERE username = ?',
			[username],
		);

		// validate password
		const comparePassword = await bcrypt.compare(password, user[0].password);

		if (!comparePassword) throw new UnauthorizedError('Unauthorized');

		const token = jwt.sign({ id: user[0].user_id }, PRIVATE_KEY, {
			expiresIn: 86400,
		});

		return token;
	} catch (error) {
		if (error.statusCode === 403)
			throw {
				code: error.statusCode,
				response: error.completeErrors,
			};

		if (error.statusCode === 401) {
			throw {
				code: error.statusCode,
				response: error.message,
			};
		}

		throw { completeError: error };
	} finally {
		connection.end();
	}
};
