import {
	getUserModel,
	createUserModel,
	deleteUserModel,
} from '../models/mysql/user.js';
import response from '../utils/response.js';

export const create = async (req, res) => {
	const newUser = await createUserModel({ input: req.body });
	response(res, newUser.code, newUser);
};

export const getByUsername = async (req, res) => {
	const { username } = req.query;

	const users = await getUserModel({ username });

	response(res, users.code, users);
};

export const remove = async (req, res) => {
	const { id } = req.params;
	const deletedUser = await deleteUserModel({ id });
	response(res, deletedUser.code, deletedUser);
};
