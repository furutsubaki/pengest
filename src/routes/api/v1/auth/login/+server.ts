import { AuthError } from '@supabase/supabase-js';
import axios from 'axios';
import { ZodError } from 'zod';

import type { SigninPostType } from '$lib/validations/signin';
import type { RequestHandler } from '@sveltejs/kit';

import { ERROR_MESSAGE } from '$lib/consts/errorMessage';
import { VALIDATION } from '$lib/consts/validation';
import selectUserModel from '$lib/selectModels/user';
import prisma from '$lib/server/prisma';
import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';
import { signinPostSchema } from '$lib/validations/signin';

/**
 * ログインAPI
 */
export const POST: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { request, locals } = event;

        const params: SigninPostType = await request.json();
        signinPostSchema.parse(params);

        // TODO:凍結・削除チェック

        // 実行
        const { data, error } = await locals.supabase.auth.signInWithPassword({
            email: params.email,
            password: params.password,
        });

        if (error) {
            if (error instanceof AuthError && error.status === 400) {
                return createBadRequest([{ message: VALIDATION.VALID_LOGIN }]);
            }
            console.error(error);
            return createInternalServerError([{ message: ERROR_MESSAGE.UNKNOWN }]);
        }

        const user = await prisma.user.findFirst({
            select: selectUserModel,
            where: {
                authId: data.user?.id,
            },
        });
        const { data: authUser } = await axios(`/api/v1/users/userId/${user?.id}`);

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: {
                user: authUser,
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
            },
            meta,
        };

        return createResponse(resposne);

    } catch (error) {
        if (error instanceof ZodError) {
            return createBadRequest(error.issues);
        }
        return createInternalServerError(error);
    }
};
