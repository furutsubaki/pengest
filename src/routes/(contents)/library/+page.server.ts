
import axios from 'axios';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { locals: { getSession }} = event;
    const session = await getSession();

    const { data: images } = await axios('/api/v1/authed/images', {
        headers: {
            access_token: session?.access_token,
            refresh_token: session?.refresh_token,
        },
    });

    const title = 'LIBRARY';

    return {
        title,
        images,
    };

};

export const prerender = true;
