
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const title = '問い合わせ';

    return {
        title,
    };
};

export const prerender = true;
