export class ClientError extends Error {
	constructor(message, status = 400) {
		super(message);
		this.statusCode = status;
	}
}

export class ValidationError extends Error {
	constructor(message, status = 400, infoError) {
		super(message);
		this.statusCode = status;
		this.infoError = infoError;
	}
}
