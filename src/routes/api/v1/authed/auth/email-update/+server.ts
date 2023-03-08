import { ZodError } from 'zod';

import type { SignupPostType } from '$lib/validations/signup';
import type { RequestHandler } from '@sveltejs/kit';

import { MESSAGE } from '$lib/consts/message';
import prisma from '$lib/server/prisma';
import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';
import { emailUpdatePatchSchema } from '$lib/validations/emailUpdate';

/**
 * メールアドレス更新API
 */
export const PATCH: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { request, locals } = event;
        const params: SignupPostType = await request.json();
        emailUpdatePatchSchema.parse(params);

        // 重複チェック
        const registedEmail = await prisma.users.findFirst({
            where: {
                email: params.email,
            },
        });

        if (registedEmail) {
            return createBadRequest([{ message: MESSAGE.ERROR.REGISTERED_EMAIL }]);
        }
        // 更新処理
        const { error } = await locals.supabase.auth.updateUser({
            email: params.email,
        }, { emailRedirectTo: '/settings/account/mailaddress?success' });

        if (error) {
            return createInternalServerError([{ message: MESSAGE.ERROR.UNKNOWN }]);
        }

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: {},
            meta,
        };

        return createResponse(resposne);

    } catch (error) {
        console.log(error);

        if (error instanceof ZodError) {
            return createBadRequest(error.issues);
        } else if (error.status === 429) {
            error.message = '試行時間が短すぎます。時間を開けてお試しください';
        }

        return createInternalServerError(error);
    }
};
