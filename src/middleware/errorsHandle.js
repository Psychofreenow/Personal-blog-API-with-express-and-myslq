import resError from '../utils/resError.js';

const errorsHandle = (err, req, res, next) => {
	const { code, response } = err;

	//Para más adelante opmitmizar el manejo de errores de errorsHandle
	if (!code) return resError(res, 500, err);

	resError(res, code, response);
};

export default errorsHandle;
