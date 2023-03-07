
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const title = 'ガイドライン';

    return {
        title,
    };
};

export const prerender = true;
