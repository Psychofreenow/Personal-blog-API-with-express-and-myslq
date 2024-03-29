import z from 'zod';

const userSchema = z.object({
	username: z.string().refine(value => /^[\wñÑ]+$/.test(value), {
		message: 'username not validated',
	}),
	email: z.string().email({
		message: 'email not validated',
	}),
	password: z.string().min(8).max(16, { message: 'password not validated' }),
});

export function validateInputUser(input) {
	return userSchema.safeParse(input);
}
