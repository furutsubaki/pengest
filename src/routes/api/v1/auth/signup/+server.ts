import { AuthApiError } from '@supabase/supabase-js';
import { ZodError } from 'zod';

import type { SignupPostType } from '$lib/validations/signup';
import type { RequestHandler } from '@sveltejs/kit';

import { MESSAGE } from '$lib/consts/message';
import { VALIDATION } from '$lib/consts/validation';
import prisma from '$lib/server/prisma';
import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';
import { signupPostSchema } from '$lib/validations/signup';

/**
 * ユーザー登録API
 */
export const POST: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { request, locals } = event;
        const params: SignupPostType = await request.json();
        signupPostSchema.parse(params);

        // 重複チェック
        const registedUser = await prisma.users.findFirst({
            where: {
                email: params.email,
            },
        });

        if (registedUser) {
            return createBadRequest([{ message: '登録済みのユーザーです' }]);
        }

        // 登録処理
        const { error } = await locals.supabase.auth.signUp({
            email: params.email,
            password: params.password,
            options: {
                data: {
                    name: params.name,
                },
            },
        });

        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                return createBadRequest([{ message: VALIDATION.VALID_CREATE_USER }]);
            }
            console.error(error);
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
