
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const title = '料金体系';

    return {
        title,
    };
};

export const prerender = true;
