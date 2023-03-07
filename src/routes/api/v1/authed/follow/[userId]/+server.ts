
import type { RequestHandler } from '@sveltejs/kit';
import type { StatusNoticePayload } from 'src/@types/broadcastPayload';

import selectUserModel from '$lib/selectModels/user';
import prisma from '$lib/server/prisma';
import { createResponse, createInternalServerError, createBadRequest } from '$lib/utils/createResponse';
import { followPostSchema, followDeleteSchema } from '$lib/validations/follow';

/**
 * フォローAPI
 */
export const POST: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { params, locals: {getSession} } = event;
        const session = await getSession();
        followPostSchema.parse(params);

        const { followerUser, followedUser, isFollowed } = await checkFollow(session?.user.id, params.userId);

        if (isFollowed) {
            createBadRequest([{ message: 'フォロー済みです' }]);
        }

        // 実行
        await prisma.follower.create({
            data: {
                followerId: followerUser?.id as string,
                followedId: followedUser?.id as string,
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: followedUser,
            meta,
        };

        // ===== フォローの通知 =====

        const userChannelName = `user-${followedUser?.id}`;
        const userChannel = event.locals.supabase.channel(userChannelName);
        await userChannel.on('broadcast', { event: 'status-notice' }, () => { return; }).subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                const payload: StatusNoticePayload = {
                    payloadType: 'FOLLOW',
                    message: `${followedUser?.Profile?.name}さんにフォローされました`,
                    user: followedUser,
                };
                await userChannel.send({
                    type: 'broadcast',
                    event: 'status-notice',
                    payload,
                });
                await event.locals.supabase.removeChannel(userChannel);
            }
        });

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};

/**
 * アンフォローAPI
 */
export const DELETE: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { params, locals: {getSession} } = event;
        const session = await getSession();
        followDeleteSchema.parse(params);

        const { followerUser, followedUser, isFollowed } = await checkFollow(session?.user.id, params.userId);

        if (!isFollowed) {
            createBadRequest([{ message: 'フォローしていません' }]);
        }

        // 実行
        await prisma.follower.delete({
            where: {
                followerId_followedId: {
                    followerId: followerUser?.id as string,
                    followedId: followedUser?.id as string,
                },
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: followedUser,
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};

const checkFollow = async (followerId: string, followedId: string) => {
    // followするユーザー情報取得
    const followerUser = await prisma.user.findFirst({
        select: selectUserModel,
        where: {
            authId: followerId,
        },
    });

    // followされるユーザー情報取得
    const followedUser = await prisma.user.findFirst({
        select: selectUserModel,
        where: {
            id: followedId,
        },
    });

    if (!followedUser) {
        createBadRequest([{ message: 'ユーザーが存在しませんです' }]);
    }

    if (followedUser?.deactivateAt) {
        createBadRequest([{ message: '削除されたユーザーです' }]);
    }

    if (followedUser?.freezeAt) {
        createBadRequest([{ message: '凍結されたユーザーです' }]);
    }

    // follow済みかチェック
    const isFollowed = await prisma.user.findFirst({
        select: {
            id: true,
        },
        where: {
            Follower_Follower_followedIdToUser: {
                every: {
                    followerId: followerUser?.id as string,
                    followedId: followedUser?.id as string,
                },
            },
        },
    });

    return {
        followerUser,
        followedUser,
        isFollowed,
    };
};
