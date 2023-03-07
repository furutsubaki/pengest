import type { RequestHandler } from '@sveltejs/kit';

import selectPostModel from '$lib/selectModels/post';
import prisma from '$lib/server/prisma';
import { createBadRequest, createResponse, createInternalServerError } from '$lib/utils/createResponse';

/**
 * プロフィール取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { url } = event;
        const q = url.searchParams.get('q');
        if (!q) {
            return createBadRequest([{ message: '検索対象を指定してください' }]);
        }

        // 検索対象
        const where = {
            User: {
                deactivateAt: null,
                freezeAt: null,
            },
            OR: [
                {
                    text: {
                        search: q,
                    },
                },
                {
                    text: {
                        contains: q,
                    },
                },
            ],
        };

        // 投稿取得
        const posts = await prisma.post.findMany({
            select: selectPostModel,
            where,
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: [...posts.map(post => {
                const _post = { ...post, Images: post?.Post_Image.map(image => image.Image) } as unknown as Post;
                delete _post.Post_Image;
                return _post;
            })],
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
