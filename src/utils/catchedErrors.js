// Esta función lo que hace es enviar los errores directamente al manejador de errores de express.

const catchedErrors = fn => (req, res, next) =>
	fn(req, res).catch(err => next(err));

export default catchedErrors;
