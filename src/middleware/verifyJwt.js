import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../PRIVATE_KEY.js';
import { connectionDB } from '../DB/connection.js';

export const verifyJwt = async (req, res, next) => {
	let token = req.headers['x-access-token'];

	if (!token) return res.status(403).json({ message: 'No token provided' });

	try {
		const decoded = jwt.verify(token, PRIVATE_KEY);
		req.id = decoded;

		const connection = await connectionDB();

		const [user] = await connection.execute(
			'SELECT username FROM users WHERE user_id = ?',
			[req.id.id],
		);

		if (user.length === 0)
			return res.status(404).json({ message: 'no user found' });

		next();
	} catch (error) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
};
