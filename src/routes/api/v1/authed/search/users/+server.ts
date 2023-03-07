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
        const { url } = event;
        const q = url.searchParams.get('q');
        if (!q) {
            return createBadRequest([{ message: '検索対象を指定してください' }]);
        }

        // 検索対象
        const where = {
            OR: [
                {
                    Profile: {
                        detail: {
                            search: q,
                        },
                    },
                },
                {
                    Profile: {
                        detail: {
                            contains: q,
                        },
                    },
                },
                {
                    Profile: {
                        screenName: {
                            contains: q,
                        },
                    },
                },
                {
                    Profile: {
                        name: {
                            contains: q,
                        },
                    },
                },
            ],
        };

        // ユーザー取得
        const users = await prisma.user.findMany({
            select: selectUserModel,
            where: {
                deactivateAt: null,
                freezeAt: null,
                ...where,
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: users,
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
