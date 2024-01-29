import { connectionDB } from '../DB/connection.js';

export const isAdmin = async (req, res, next) => {
	let userId = req.id.id;

	const connection = await connectionDB();
	const [[rolOfUser]] = await connection.execute(
		'SELECT rol_id FROM users WHERE user_id = ?',
		[userId],
	);

	const [[roles]] = await connection.execute(
		'SELECT rol_id FROM roles WHERE rol = "admin"',
	);

	if (rolOfUser.rol_id !== roles.rol_id)
		res.status(401).json({ message: 'Unauthorized' });

	next();
};
