import z from 'zod';

const userLoginSchema = z.object({
	username: z.string().refine(value => /^[\wñÑ]+$/.test(value), {
		message: 'username not validated',
	}),
	password: z.string().min(8).max(16, { message: 'password not validated' }),
});

export function validateInputUserLogin(input) {
	return userLoginSchema.safeParse(input);
}
