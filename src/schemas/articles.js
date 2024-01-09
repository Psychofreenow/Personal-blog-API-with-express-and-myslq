import { z } from 'zod';

const articleSchema = z.object({
	title: z.string().max(255),
	category: z.array(z.enum(['salud', 'cocina', 'programacion', 'jardineria'])),
	content: z.string(),
});

export function validateInputArticle(input) {
	return articleSchema.safeParse(input);
}

export function partialValidateInputArticle(input) {
	return articleSchema.partial().safeParse(input);
}
