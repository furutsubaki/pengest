
import axios from 'axios';

import type { Column, DisplayType } from '$lib/stores/column';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { url, locals: { getSession }} = event;
    const session = await getSession();

    const type = url.searchParams.get('type') as DisplayType ?? 'user';
    const q = url.searchParams.get('q');

    // queryで初期検索
    let posts = { data: [], meta: {} };
    if (q?.length) {
        if (type === 'user') {
            const { data: searchUsers } = await axios('/api/v1/authed/search/users', {
                params: {
                    q,
                },
                headers: {
                    access_token: session?.access_token,
                    refresh_token: session?.refresh_token,
                },
            });
            // TODO: 型
            posts = searchUsers;
        } else if (type === 'post') {
            const { data: searchPosts } = await axios('/api/v1/authed/search/posts', {
                params: {
                    q,
                },
                headers: {
                    access_token: session?.access_token,
                    refresh_token: session?.refresh_token,
                },
            });
            // TODO: 型
            posts = searchPosts;
        }
    }

    const title = 'SEARCH';

    const columns: Column[] = [
        {
            id: 'test', // TODO: ユーザー設定で固有のIDが振られる
            mode: 'search',
            title,
            type,
            posts,
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
        settings,
    };

};

export const prerender = true;
