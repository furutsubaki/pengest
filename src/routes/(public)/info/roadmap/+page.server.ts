
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const title = 'ロードマップ';

    return {
        title,
    };
};

export const prerender = true;
