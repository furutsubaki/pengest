import {z} from 'zod';

import { VALIDATION } from '$lib/consts/validation';

// TODO: validationを共通化
export const signupPostSchema = z.object({
    name: z.string().min(1, VALIDATION.EMPTY_USER_NAME).max(40, VALIDATION.MAX_COUNT_USER_NAME),
    email: z.string().min(1, VALIDATION.EMPTY_USER_MAIL).email(VALIDATION.NOT_TYPE_USER_MAIL).max(100, VALIDATION.MAX_COUNT_USER_MAIL),
    password: z.string().min(8, VALIDATION.MIN_COUNT_USER_PASSWORD).max(20, VALIDATION.MAX_COUNT_USER_PASSWORD),
    passwordConfirm: z.string().min(8, VALIDATION.MIN_COUNT_USER_PASSWORD).max(20, VALIDATION.MAX_COUNT_USER_PASSWORD),
}).refine(data => data.password === data.passwordConfirm, {
    message: VALIDATION.PASSWORD_DISAGREEMENT,
    path: ['password','passwordConfirm'],
});
export type SignupPostType = z.infer<typeof signupPostSchema>;
