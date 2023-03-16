import axios from 'axios';
import { ZodError } from 'zod';

import type { RequestHandler } from '@sveltejs/kit';

import { VALIDATION } from '$lib/consts/validation';
import prisma from '$lib/server/prisma';
import { base642Blob, getImageFormat } from '$lib/utils';
import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';
import { profilePostSchema, type ProfilePostType } from '$lib/validations/profile';

/**
 * プロフィール更新
 */
export const PATCH: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { request, locals } = event;
        const session = await locals.getSession();
        const params: ProfilePostType = await request.json();
        profilePostSchema.parse(params);

        // ユーザー取得
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                Profile: {
                    select: {
                        icon: true,
                        headerImage: true,
                    },
                },
            },
            where: {
                authId: {
                    equals: session?.user.id,
                },
            },
        });

        // スクリーンネーム重複チェック
        const screenNameUser = await prisma.profile.findFirst({
            select: {
                screenName: true,
            },
            where: {
                User: {
                    id: {
                        not: user?.id,
                    },
                },
                screenName: params.screenName,
            },
        });

        if (screenNameUser) {
            return createBadRequest([{ message: 'このスクリーンネームは使用できません' }]);
        }

        // 画像を先に更新
        const updateImages: { [key: string]: string | null } = {
            icon: user?.Profile?.icon as string,
            headerImage: user?.Profile?.headerImage as string,
        };

        if (!params.icon.startsWith('http')) {
            // アイコン更新
            const file = new File([base642Blob(params.icon, 'image/webp')], 'icon.webp', { type: 'image/webp' });
            await inValidFile(file);
            const { data } = await locals.supabase.storage.from('users')
                .upload(`${user?.id}/icon.webp`, file, { contentType: 'image/webp', cacheControl: '3600', upsert: true });
            const { data: path } = await locals.supabase.storage.from('users').getPublicUrl(data?.path as string);
            updateImages.icon = path.publicUrl;
        }
        if (params.headerImage && !params.headerImage.startsWith('http')) {
            // ヘッダー更新
            const file = new File([base642Blob(params.headerImage, 'image/webp')], 'header.webp', { type: 'image/webp' });
            await inValidFile(file);
            const { data } = await locals.supabase.storage.from('users')
                .upload(`${user?.id}/header.webp`, file, { contentType: 'image/webp', cacheControl: '3600', upsert: true });
            const { data: path } = await locals.supabase.storage.from('users').getPublicUrl(data?.path as string);
            updateImages.headerImage = path.publicUrl;
        } else if (!params.headerImage) {
            await locals.supabase.storage.from('users').remove([`${user?.id}/header.webp`]);
            updateImages.headerImage = '';
        }

        // 更新
        await prisma.user.update({
            data: {
                Profile: {
                    update: {
                        name: params.name,
                        screenName: params.screenName,
                        detail: params.detail,
                        linkHome: params.linkHome,
                        linkTwitter: params.linkTwitter,
                        linkPixiv: params.linkPixiv,
                        linkGithub: params.linkGithub,
                        ...updateImages,
                    },

                },
            },
            where: {
                id: user?.id as string,
            },
        });

        // アップデート後の情報取得
        const { data: authUser } = await axios(`/api/v1/users/userId/${user?.id}`);

        return createResponse(authUser);

    } catch (error) {
        console.log(error);

        if (error instanceof ZodError) {
            return createBadRequest(error.issues);
        }
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
