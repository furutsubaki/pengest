import { z } from 'zod';

import { VALIDATION } from '$lib/consts/validation';

// TODO: validationを共通化
export const passwordUpdatePatchSchema = z.object({
    currentPassword: z.string().min(8, VALIDATION.MIN_COUNT_USER_PASSWORD).max(20, VALIDATION.MAX_COUNT_USER_PASSWORD),
    password: z.string().min(8, VALIDATION.MIN_COUNT_USER_PASSWORD).max(20, VALIDATION.MAX_COUNT_USER_PASSWORD),
    passwordConfirm: z.string().min(8, VALIDATION.MIN_COUNT_USER_PASSWORD).max(20, VALIDATION.MAX_COUNT_USER_PASSWORD),
}).refine(data => data.password === data.passwordConfirm, {
    message: VALIDATION.PASSWORD_DISAGREEMENT,
    path: ['password', 'passwordConfirm'],
});
export type passwordUpdatePatchType = z.infer<typeof passwordUpdatePatchSchema>;
