
import axios from 'axios';

import type { PostPostType, PostDeleteType } from '$lib/validations/post';
import type { Image } from '@prisma/client';
import type { RequestHandler } from '@sveltejs/kit';

import { VALIDATION } from '$lib/consts/validation';
import prisma from '$lib/server/prisma';
import { base642Blob, createShortId, getImageFormat } from '$lib/utils';
import { createResponse, createInternalServerError, createBadRequest } from '$lib/utils/createResponse';
import { postPostSchema, postDeleteSchema } from '$lib/validations/post';

/**
 * 投稿API
 */
export const POST: RequestHandler = async (event) => {
    try {
        // ===== 投稿処理 =====

        // 入力チェック
        const { request, locals } = event;
        const session = await locals.getSession();
        const params: PostPostType = await request.json();
        postPostSchema.parse(params);

        // ユーザー情報取得
        const postUser = await prisma.user.findFirst({
            select: {
                id: true,
            },
            where: {
                authId: {
                    equals: session?.user.id,
                },
            },
        });

        // 画像を先に更新
        let createdImages = [] as Image[];
        if (params.images.length) {
            // 画像登録
            // Check
            const files = params.images.map(image => new File([base642Blob(image, 'image/webp')], 'icon.webp', { type: 'image/webp' }));
            await Promise.all(files.map(file => inValidFile(file)));

            // アップロード
            const res = await Promise.all(files.map(file => {
                return locals.supabase.storage.from('users')
                    .upload(`${postUser?.id}/${createShortId()}.webp`, file, { contentType: 'image/webp', cacheControl: '3600', upsert: false });
            }));

            // DB登録
            const paths = await Promise.all(res.map(r => locals.supabase.storage.from('users').getPublicUrl(r.data?.path as string)));
            const updateImages = paths.map(path => {
                const shortId = createShortId();
                return { id: shortId, src: `/i/${shortId}`, originalSrc: path.data.publicUrl, userId: postUser?.id as string };
            });
            createdImages = await Promise.all(updateImages.map(updateImage => prisma.image.create({
                data: updateImage,
            })));
        }

        // 実行
        const createdPost = await prisma.post.create({
            data: {
                userId: postUser?.id as string,
                text: params.text,
                Post_Image: {
                    createMany: {
                        data: [
                            ...createdImages.map(image => ({ imageId: image.id })),
                            ...params.imageIds.map(id => ({ imageId: id })),
                        ],
                    },
                },
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: {
                id: createdPost.id,
            },
            meta,
        };

        // ===== フォロワーのタイムラインへデータを送信 =====

        // ポストデータを取得
        const { data: posted } = await axios(`/api/v1/posts/${createdPost.id}`);

        const userChannelName = `user-${postUser?.id}`;
        const userChannel = event.locals.supabase.channel(userChannelName);
        await userChannel.on('broadcast', { event: 'post-insert' }, () => { return; }).subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await userChannel.send({
                    type: 'broadcast',
                    event: 'post-insert',
                    payload: posted,
                });
                await event.locals.supabase.removeChannel(userChannel);
            }
        });

        // ===== 完了statusを返却 =====

        return createResponse(resposne);
    } catch (error) {
        console.log(error);
        return createInternalServerError(error);
    }
};

/**
 * 投稿削除API
 */
export const DELETE: RequestHandler = async (event) => {
    try {
        // ===== 投稿削除処理 =====

        // 入力チェック
        const { request, locals: {getSession} } = event;
        const session = await getSession();
        const params: PostDeleteType = await request.json();
        postDeleteSchema.parse(params);

        // ユーザー情報取得
        const postUser = await prisma.user.findFirst({
            select: {
                id: true,
            },
            where: {
                authId: {
                    equals: session?.user.id,
                },
            },
        });

        // 実行
        const deletedPost = await prisma.post.delete({
            where: {
                id: params.id,
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: {
                id: deletedPost.id,
            },
            meta,
        };

        // ===== フォロワーのタイムラインへデータを送信 =====

        const userChannelName = `user-${postUser?.id}`;
        const userChannel = event.locals.supabase.channel(userChannelName);
        await userChannel.on('broadcast', { event: 'post-delete' }, () => { return; }).subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await userChannel.send({
                    type: 'broadcast',
                    event: 'post-delete',
                    payload: {
                        data: {
                            id: deletedPost.id,
                        },
                    },
                });
                await event.locals.supabase.removeChannel(userChannel);
            }
        });

        // ===== 完了statusを返却 =====

        return createResponse(resposne);
    } catch (error) {

        return createInternalServerError(error);
    }
};

const inValidFile = async (file: File) => {
    const type = await getImageFormat(file);
    // MEMO: webp,png,gif,jpeg、10MB以下を許可
    if (
        !type ||
        !['image/webp', 'image/png', 'image/gif', 'image/jpeg'].includes(
            type,
        ) ||
        file.size / 1000 ** 2 > 10
    ) {
        return createBadRequest([{ message: VALIDATION.VALID_UPLOAD_FILE }]);
    }
};
