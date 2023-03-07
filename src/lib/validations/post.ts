import { z } from 'zod';

import { VALIDATION } from '$lib/consts/validation';

export const postPostSchema = z.object({
    text: z.string().min(1, VALIDATION.EMPTY_POST_TEXT).max(140, VALIDATION.MAX_COUNT_POST_TEXT),
    images: z.string().array().max(4, VALIDATION.MAX_COUNT_POST_IMAGE),
    imageIds: z.string().array().max(4, VALIDATION.MAX_COUNT_POST_IMAGE),
}).refine(data => data.images.length + data.imageIds.length <= 4, {
    message: VALIDATION.MAX_COUNT_POST_IMAGE,
    path: ['images', 'imageIds'],
});
export type PostPostType = z.infer<typeof postPostSchema>;

export const postDeleteSchema = z.object({
    id: z.string().min(1, VALIDATION.EMPTY_ID),
});
export type PostDeleteType = z.infer<typeof postDeleteSchema>;
