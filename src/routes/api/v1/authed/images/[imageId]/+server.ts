
import type { RequestHandler } from '@sveltejs/kit';

import { VALIDATION } from '$lib/consts/validation';
import prisma from '$lib/server/prisma';
import { createBadRequest, createResponse, createInternalServerError, createInvalidCredentials } from '$lib/utils/createResponse';

/**
 * ユーザーの画像を削除API
 */
export const DELETE: RequestHandler = async (event) => {
    try {
        const { params, locals: {getSession} } = event;
        const session = await getSession();
        if (!params.imageId) {
            return createBadRequest([{ message: VALIDATION.EMPTY_ID }]);
        }

        // 検索対象
        const whereTarget = {
            User: {
                users: {
                    id: session?.user.id,
                },
            },
            id: params.imageId,
        };

        const authedImage = await prisma.image.findFirst({
            select: {
                id: true,
            },
            where: {
                ...whereTarget,
            },
        });

        if (!authedImage) {
            createInvalidCredentials([{ message: '認証エラーです' }]);
        }

        const deletedImage = await prisma.$transaction(async (prisma) => {
            // 中間テーブル削除
            await prisma.post_Image.deleteMany({
                where: {
                    imageId: params.imageId,
                },
            });

            // 画像削除
            return await prisma.image.delete({
                where: {
                    id: params.imageId,
                },
            });
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: deletedImage,
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
