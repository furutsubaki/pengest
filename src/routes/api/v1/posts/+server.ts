import dayjs from 'dayjs';

import type { RequestHandler } from '@sveltejs/kit';

import selectPostModel, { type Post } from '$lib/selectModels/post';
import prisma from '$lib/server/prisma';
import { createBadRequest, createResponse, createInternalServerError } from '$lib/utils/createResponse';

const LIMIT = 50;

/**
 * screenNameかuserIdの投稿一覧を取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { url } = event;
        const screenName = url.searchParams.get('screenName');
        const userId = url.searchParams.get('userId');
        const before = url.searchParams.get('before');
        const after = url.searchParams.get('after');
        const limit = Number(url.searchParams.get('limit')) !== 0 ? Number(url.searchParams.get('limit')) : LIMIT;
        if (!screenName && !userId) {
            return createBadRequest([{ message: 'screenNameかuserIdを指定してください' }]);
        }

        // TODO: ユーザーチェック

        // 検索対象
        const whereTarget = screenName
            ? {
                User: {
                    Profile: {
                        screenName: {
                            equals: screenName as string,
                        },
                    },
                },
            }
            : {
                User: {
                    id: {
                        equals: userId as string,
                    },
                },
            };
        const whereAfter = after ? {
            gte: new Date(after),
        } : {};
        const whereBefore = before ? {
            lt: new Date(before),
        } : {};

        const whereAt = {
            updatedAt: {
                ...whereBefore,
                ...whereAfter,
            },
        };

        // 実行
        const posts = await prisma.post.findMany({
            select: selectPostModel,
            where: {
                ...whereAt,
                ...whereTarget,
            },
            take: limit,
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // create meta data
        const latestPost = posts[0];
        const oldestPost = posts[posts.length - 1];
        const meta = posts.length ? {
            latestDate: latestPost ? latestPost.updatedAt : dayjs().toString(),
            oldestDate: oldestPost ? oldestPost.updatedAt : dayjs().toString(),
        } : {};

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
