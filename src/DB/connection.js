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
		//Por ahora, luego me gustaría en caso de que haya un error de verdad con esto, enviarlo a un servicio para que este no se muestre en el cliente
		console.error('Error connecting to the database:', err);
		throw err;
	}
};
