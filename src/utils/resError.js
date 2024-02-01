const resError = (res, status, response) => {
	res.status(status).json({
		success: false,
		response,
	});
};

export default resError;
