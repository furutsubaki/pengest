
import type { RequestHandler } from '@sveltejs/kit';

import selectPostModel, { type Post } from '$lib/selectModels/post';
import prisma from '$lib/server/prisma';
import { createResponse, createInternalServerError } from '$lib/utils/createResponse';

const LIMIT = 50;

/**
 * タイムライン取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        const { url, locals: {getSession} } = event;
        const session = await getSession();
        const before = url.searchParams.get('before');
        const after = url.searchParams.get('after');
        const limit = Number(url.searchParams.get('limit')) !== 0 ? Number(url.searchParams.get('limit')) : LIMIT;

        // フォロー中のユーザー情報取得
        const followingUsers = await prisma.follower.findMany({
            select: {
                User_Follower_followedIdToUser: {
                    select: {
                        id: true,
                    },
                },
            },
            where: {
                User_Follower_followerIdToUser: {
                    authId: session?.user.id,
                    deactivateAt: null,
                    freezeAt: null,
                },
            },
        });
        const followingUserIds = followingUsers.map(user => user.User_Follower_followedIdToUser.id);

        // 検索条件
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
                OR: [
                    {
                        User: {
                            authId: session?.user.id,
                        },
                    },
                    {
                        User: {
                            id: {
                                in: followingUserIds,
                            },
                        },
                    },
                ],
            },
            take: limit,
            orderBy: {
                updatedAt: 'desc',
            },
        });

        // create meta data
        const latestPost = posts[0];
        const oldestPost = posts[posts.length - 1];
        const meta = {
            latestDate: latestPost ? latestPost.updatedAt : null,
            oldestDate: oldestPost ? oldestPost.updatedAt : null,
        };

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
