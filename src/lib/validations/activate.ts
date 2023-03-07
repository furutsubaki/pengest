import {z} from 'zod';

import { VALIDATION } from '$lib/consts/validation';

// TODO: validationを共通化
export const activatePostSchema = z.object({
    id: z.string(),
    name: z.string().min(1, VALIDATION.EMPTY_USER_NAME).max(40, VALIDATION.MAX_COUNT_USER_NAME),
});
export type ActivatePostType = z.infer<typeof activatePostSchema>;
