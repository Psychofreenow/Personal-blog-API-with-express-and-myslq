import { connectionDB } from '../../DB/connection.js';
import { randomUUID } from 'node:crypto';
import { validateInputUserCreate } from '../../schemas/userCreate.js';
import bcrypt from 'bcryptjs';
import { ClientError, ValidationError } from '../../utils/errors.js';

export const createUserModel = async ({ input }) => {
	const connection = await connectionDB();
	try {
		const result = validateInputUserCreate(input);
		if (!result.success)
			throw new ValidationError(
				'data entered is invalidated',
				403,
				result.error,
			);

		const newUser = {
			user_id: randomUUID(),
			...result.data,
		};

		const { user_id, username, email, password, rol_id } = newUser;

		//encrypted password
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);

		connection.execute(
			'INSERT INTO users(user_id, username, email, password, rol_id) VALUES(?,?,?,?,?)',
			[user_id, username, email, encryptedPassword, rol_id],
		);

		return {
			code: 201,
			response: `User with ${user_id} was successfully created`,
		};
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

export const getUserModel = async ({ username }) => {
	const connection = await connectionDB();

	try {
		if (!username) {
			const [users] = await connection.execute(
				'SELECT user_id, username, email, rol_id FROM users;',
			);
			return { code: 200, response: users };
		}

		const [user] = await connection.execute(
			'SELECT user_id, username, email, rol_id FROM users WHERE username = ?',
			[username],
		);

		if (user.length === 0) throw new ClientError('user not found');

		return { code: 200, response: user };
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
};

export const deleteUserModel = async ({ id }) => {
	const connection = await connectionDB();

	try {
		await connection.execute('DELETE FROM users WHERE user_id = ?', [id]);

		return { code: 201, response: `User with ${id} was successfully deleted` };
	} catch (error) {
		throw { completeError: error };
	} finally {
		connection.end();
	}
};
