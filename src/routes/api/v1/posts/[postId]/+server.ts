
import type { RequestHandler } from '@sveltejs/kit';

import selectPostModel, { type Post } from '$lib/selectModels/post';
import prisma from '$lib/server/prisma';
import { createBadRequest, createResponse, createInternalServerError } from '$lib/utils/createResponse';

/**
 * PostIdで投稿を取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { params } = event;
        if (!params.postId) {
            return createBadRequest([{ message: 'postIdを指定してください' }]);
        }

        // 検索対象
        const whereTarget = {
            id: params.postId,
        };

        // 実行
        const post = await prisma.post.findFirst({
            select: selectPostModel,
            where: {
                ...whereTarget,
            },
        });

        // ユーザーチェック
        const user = await prisma.user.findFirst({
            select: {
                id: true,
            },
            where: {
                id: post?.User.id,
                deactivateAt: null,
                freezeAt: null,
            },
        });

        if (!user) {
            createBadRequest([{ message: '投稿を取得できません' }]);
        }

        // create meta data
        const meta = {};

        // create response
        const _post = { ...post, Images: post?.Post_Image.map(image => image.Image) } as unknown as Post;
        delete _post.Post_Image;
        const resposne = {
            data: _post,
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
