
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const title = '利用規約';

    return {
        title,
    };
};

export const prerender = true;
