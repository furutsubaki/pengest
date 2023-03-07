
import sharp from 'sharp';

import type { RequestHandler } from '@sveltejs/kit';

import { getImageFormat } from '$lib/utils';
import { createBadRequest, createResponse, createInternalServerError } from '$lib/utils/createResponse';

const QUALITY = 1;

/**
 * 画像base64からwebpbase64に変換
 */
export const POST: RequestHandler = async (event) => {
    try {

        // 入力チェック
        const { request } = event;
        const params = await request.json();
        if (!params.image) {
            return createBadRequest([{ message: '画像を指定してください' }]);
        }

        // 拡張子チェック
        const type = await getImageFormat(params.image);
        if (
            !type ||
            !['image/webp', 'image/png', 'image/gif', 'image/jpeg'].includes(
                type,
            )
        ) {
            return createBadRequest([{ message: '画像ファイルを指定してください' }]);
        }

        const webp = await sharp(Buffer.from(
            params.image,
            'base64',
        ), { pages: -1 }).webp({ lossless: true });
        const webpBuf = await webp.toBuffer();
        const webpBase64 = 'data:image/webp;base64,' + webpBuf.toString('base64');

        // create meta data
        const meta = {
            quality: QUALITY,
        };

        // create response
        const resposne = {
            data: { image: webpBase64 },
            meta,
        };

        return createResponse(resposne);
    } catch (error) {
        console.log(error);

        return createInternalServerError(error);
    }
};
