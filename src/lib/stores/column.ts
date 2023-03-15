import { writable } from 'svelte/store';

import type { Post } from '$lib/selectModels/post';
import type { User } from '$lib/selectModels/user';

export type ColumnMode = 'timeline' | 'user' | 'post' | 'search';
export type DisplayType = 'post' | 'user';

export interface Column {
    id: string;
    title: string;
    mode: ColumnMode;
    type: DisplayType,
    user?: { data: User, meta: object },
    posts?: { data: Post[], meta: object },
    post?: { data: Post, meta: object },
    option: {
        width?: number
    }
}
export const columns = writable<Column[]>([]);
