import { z } from 'zod';

import { VALIDATION } from '$lib/consts/validation';

export const profilePostSchema = z.object({
    name: z.string().min(1, VALIDATION.EMPTY_USER_NAME),
    screenName: z.string().min(1, VALIDATION.EMPTY_SCREEN_NAME),
    detail: z.string(),
    icon: z.string().min(1, VALIDATION.EMPTY_ICON),
    headerImage: z.string().nullable(),
    linkHome: z.string(),
    linkTwitter: z.string(),
    linkPixiv: z.string(),
    linkGithub: z.string(),
});
export type ProfilePostType = z.infer<typeof profilePostSchema>;
