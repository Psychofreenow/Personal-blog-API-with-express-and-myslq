const response = (res, statusCode, data) => {
	if (data.success === false) res.status(500).json(data);

	res.status(statusCode).json({
		success: true,
		data,
	});
};

export default response;
