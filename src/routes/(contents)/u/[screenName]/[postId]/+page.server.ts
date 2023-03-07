import { error } from '@sveltejs/kit';
import axios from 'axios';

import type { Column } from '$lib/stores/column';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { params } = event;
    // 対象ユーザーのprofile取得
    const { data: user } = await axios(`/api/v1/users/${params.screenName}`);

    if (!user.data) {
        if (user.meta.isDeactivate) {
            throw error(404, '対象のユーザーは削除されています');
        }

        if (user.meta.isFreeze) {
            throw error(404, '対象のユーザーは凍結されています');
        }

        throw error(404, '対象のユーザーは存在しません');
    }

    // 対象ユーザーのposts取得
    const { data: post } = await axios(`/api/v1/posts/${params.postId}`);

    const title = user.data.Profile.name;

    const columns: Column[] = [
        {
            id: 'main', // TODO: ユーザー設定で固有のIDが振られる
            title,
            mode: 'post',
            type: 'post',
            post: post,
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
