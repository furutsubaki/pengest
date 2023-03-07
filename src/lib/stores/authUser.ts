import { writable } from 'svelte/store';

import type { User, UserMeta } from '$lib/selectModels/user';

export interface UserObj {
    data: User,
    meta: UserMeta
}

export const authUser = writable<UserObj | null>(null);
