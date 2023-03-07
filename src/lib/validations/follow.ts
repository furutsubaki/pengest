import { z } from 'zod';

import { VALIDATION } from '$lib/consts/validation';

export const followPostSchema = z.object({
    userId: z.string().min(1, VALIDATION.EMPTY_ID),
});
export type FollowPostType = z.infer<typeof followPostSchema>;

export const followDeleteSchema = z.object({
    userId: z.string().min(1, VALIDATION.EMPTY_ID),
});
export type FollowDeleteType = z.infer<typeof followDeleteSchema>;
