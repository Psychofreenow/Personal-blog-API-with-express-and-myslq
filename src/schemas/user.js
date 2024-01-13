import z from 'zod';

const userSchema = z.object({
	username: z.string().refine(value => /^[\wñÑ]+$/.test(value), {
		message: 'username not validated',
	}),
	email: z.string().email({
		message: 'email not validated',
	}),
	password: z.string().min(8).max(16),
});

export function validateInputUser(input) {
	return userSchema.safeParse(input);
}

export function partialValidateInputUser(input) {
	return userSchema.partial().safeParse(input);
}
