import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { locals: {getSession} } = event;
    const session = await getSession();
    if (session) {
        throw redirect(301, '/');
    }

    return {
    };
};

export const prerender = true;
