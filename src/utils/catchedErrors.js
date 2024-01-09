const catchedErrors = fn => (req, res, next) =>
	fn(req, res).catch(err => next(err));

export default catchedErrors;
