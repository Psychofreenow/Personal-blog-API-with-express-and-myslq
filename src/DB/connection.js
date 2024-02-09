import { createConnection } from 'mysql2/promise';

export const connectionDB = async () => {
	const connection = await createConnection({
		host: process.env.HOST,
		user: process.env.USER,
		password: process.env.PASSWORD,
		database: process.env.DATABASE,
	});
	try {
		return connection;
	} catch (err) {
		throw { completeError: err };
	}
};
