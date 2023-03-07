
import type { RequestHandler } from '@sveltejs/kit';

import selectImageModel from '$lib/selectModels/image';
import prisma from '$lib/server/prisma';
import { createBadRequest, createResponse, createInternalServerError } from '$lib/utils/createResponse';

/**
 * imageIdで画像を取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { params } = event;

        if (!params.imageId) {
            return createBadRequest([{ message: 'imageIdを指定してください' }]);
        }

        // 検索対象
        const whereTarget = {
            id: params.imageId,
        };

        // 実行
        const image = await prisma.image.findFirst({
            select: selectImageModel,
            where: {
                ...whereTarget,
            },
        });

        // create meta data
        const meta = {};

        // create response
        const _image = { ...image, Post: image?.Post_Image.map(v => v.Post) };
        delete _image.Post_Image;
        const resposne = {
            data: _image,
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        return createInternalServerError(error);
    }
};
