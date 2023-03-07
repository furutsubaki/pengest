import { writable } from 'svelte/store';

import type { Image } from '$lib/selectModels/image';

export const library = writable<Image[]>([]);
