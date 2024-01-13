import response from '../utils/response.js';
import { createUserModel, loginUserModel } from '../models/mysql/user.js';

export const singUp = async (req, res) => {
	const newUser = await createUserModel({ input: req.body });

	response(res, 201, newUser);
	// console.log(newUser);
	// res.json(newUser);
};

export const singin = async (req, res) => {
	const token = await loginUserModel({ input: req.body });
	response(res, 200, token);
};
