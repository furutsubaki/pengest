import axios from 'axios';

import type { Column } from '$lib/stores/column';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { locals: { getSession }} = event;
    const session = await getSession();

    // 対象ユーザーのタイムライン取得
    const { data: timeline } = await axios('/api/v1/authed/timelines', {
        params: {
            before: new Date(),
        },
    });

    // 画像取得
    const { data: images } = await axios('/api/v1/authed/images', {
        headers: {
            access_token: session?.access_token,
            refresh_token: session?.refresh_token,
        },
    });

    const title = 'HOME';

    const columns: Column[] = [
        {
            id: 'main', // TODO: ユーザー設定で固有のIDが振られる
            title,
            mode: 'timeline',
            type: 'post',
            posts: timeline,
            option: {
                width: 500,
            },
        },
    ];

    const settings = {
        columns,
    };

    return {
        title,
        images,
        settings,
    };
};

export const prerender = true;
