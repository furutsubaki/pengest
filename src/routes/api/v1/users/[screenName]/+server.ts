import type { RequestHandler } from '@sveltejs/kit';

import selectUserModel from '$lib/selectModels/user';
import prisma from '$lib/server/prisma';
import { createBadRequest, createResponse, createInternalServerError } from '$lib/utils/createResponse';

/**
 * プロフィール取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { params } = event;
        if (!params.screenName) {
            return createBadRequest([{ message: 'screenNameを指定してください' }]);
        }

        // 検索対象
        const whereScreen = {
            Profile: {
                screenName: {
                    equals: params.screenName,
                },
            },
        };

        // ユーザー取得
        const user = await prisma.user.findFirst({
            select: {
                ...selectUserModel,
                _count: {
                    select: {
                        Follower_Follower_followerIdToUser: true,
                        Follower_Follower_followedIdToUser: true,
                    },
                },
                Follower_Follower_followerIdToUser: {
                    select: {
                        User_Follower_followedIdToUser: {
                            select: {
                                id: true,// フォローしているユーザー情報
                            },
                        },
                    },
                },
                Follower_Follower_followedIdToUser: {
                    select: {
                        User_Follower_followerIdToUser: {
                            select: {
                                id: true, // フォローされているユーザー情報
                            },
                        },
                    },
                },
            },
            where: {
                ...whereScreen,
            },
        });

        // create meta data
        const meta = user ? {
            isDeactivate: user.deactivateAt,
            isFreeze: user.freezeAt,
            followingCount: user._count.Follower_Follower_followerIdToUser,
            followerCount: user._count.Follower_Follower_followedIdToUser,
            followingIds: user.Follower_Follower_followerIdToUser.map(user => user.User_Follower_followedIdToUser.id),
            followerIds: user.Follower_Follower_followedIdToUser.map(user => user.User_Follower_followerIdToUser.id),
        } : {};

        delete user?._count;
        delete user?.Follower_Follower_followedIdToUser;
        delete user?.Follower_Follower_followerIdToUser;

        // create response
        const resposne = {
            data: user && !user.deactivateAt ? user : null,
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
