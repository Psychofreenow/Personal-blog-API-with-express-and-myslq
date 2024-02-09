import z from 'zod';

const userSchema = z.object({
	username: z.string().refine(value => /^[\wñÑ]+$/.test(value), {
		message: 'username not validated',
	}),
	email: z.string().email({
		message: 'email not validated',
	}),
	password: z.string().min(8).max(16, { message: 'password not validated' }),

	rol_id: z.number().refine(value => value === 1 || value === 2, {
		message: 'invalid id',
	}),
});

export function validateInputUserCreate(input) {
	return userSchema.safeParse(input);
}
