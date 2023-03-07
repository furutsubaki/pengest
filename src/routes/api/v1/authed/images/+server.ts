
import type { RequestHandler } from '@sveltejs/kit';

import selectImageModel, { type Image } from '$lib/selectModels/image';
import prisma from '$lib/server/prisma';
import { createResponse, createInternalServerError } from '$lib/utils/createResponse';

/**
 * ユーザーの画像リストを取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        const { locals: {getSession} } = event;
        const session = await getSession();
        // 検索対象
        const whereTarget = {
            User: {
                users: {
                    id: session?.user.id,
                },
            },
        };

        // 実行
        const images = await prisma.image.findMany({
            select: selectImageModel,
            where: {
                ...whereTarget,
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: images.map(image => {
                const _image = { ...image, Post: image?.Post_Image.map(v => v.Post) } as Image;
                delete _image.Post_Image;
                return _image;
            }),
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
