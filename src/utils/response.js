const response = (res, statusCode, data) => {
	if (data.success === false) return res.status(400).json(data);

	res.status(statusCode).json({
		success: true,
		data,
	});
};

export default response;
