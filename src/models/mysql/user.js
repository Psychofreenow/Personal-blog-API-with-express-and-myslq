import { connectionDB } from '../../DB/connection.js';
import {
	partialValidateInputUser,
	validateInputUser,
} from '../../schemas/user.js';
import bcrypt from 'bcryptjs';
import { ValidationError } from '../../utils/errors.js';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../../PRIVATE_KEY.js';

export const createUserModel = async ({ input }) => {
	try {
		//validate data
		const result = validateInputUser(input);

		if (!result.success)
			throw new ValidationError('VALIDATION_ERROR', 400, result.error);

		const { username, email, password } = result.data;

		const connection = await connectionDB();

		//encrypted password
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(password, salt);

		//insert new user
		await connection.execute(
			'INSERT INTO users(username, email, password, rol_id) VALUES(?,?,?,2)',
			[username, email, encryptedPassword],
		);

		return { message: 'User was successfully created' };
	} catch (error) {
		if (error.message === 'VALIDATION_ERROR')
			return {
				success: false,
				error: error.message,
				infoError: error.infoError.issues,
			};

		return { success: false, error: error.message };
	}
};

export const loginUserModel = async ({ input }) => {
	try {
		//validate data
		const result = partialValidateInputUser(input);

		if (!result.success)
			throw new ValidationError('VALIDATION_ERROR', 400, result.error);

		const { user_id, username, password } = result.data;

		const connection = await connectionDB();

		const [user] = await connection.execute(
			'SELECT username, password FROM users WHERE username = ?',
			[username],
		);

		// validate password
		const comparePassword = bcrypt.compare(password, user[0].password);

		if (comparePassword) {
			const token = jwt.sign({ id: user_id }, PRIVATE_KEY, {
				expiresIn: 86400,
			});

			return token;
		}
	} catch (error) {
		return error;
	}
};
