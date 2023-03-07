import axios from 'axios';

import type { Column } from '$lib/stores/column';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { params } = event;
    // 対象ユーザーのprofile取得
    const { data: user } = await axios(`/api/v1/users/${params.screenName}`);

    // 対象ユーザーのposts取得
    let posts = [];
    if (user.data) {
        ({ data: posts } = await axios('/api/v1/posts', {
            params: {
                before: new Date(),
                screenName: params.screenName,
            },
        }));
    }

    const title = user.data ? user.data.Profile.name : 'プロフィール';

    const columns: Column[] = [
        {
            id: 'main', // TODO: ユーザー設定で固有のIDが振られる
            title,
            mode: 'user',
            type: 'post',
            posts: posts,
            user: user,
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
