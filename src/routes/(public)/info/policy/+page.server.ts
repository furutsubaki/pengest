
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
    const title = 'プライバシーポリシー';

    return {
        title,
    };
};

export const prerender = true;
