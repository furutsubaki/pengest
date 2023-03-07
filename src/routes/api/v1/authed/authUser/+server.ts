import axios from 'axios';
import { ZodError } from 'zod';

import type { RequestHandler } from '@sveltejs/kit';

import prisma from '$lib/server/prisma';
import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';

/**
 * ログインユーザー取得API
 */
export const GET: RequestHandler = async (event) => {
    try {
        // 入力チェック
        const { locals: {getSession} } = event;
        const session = await getSession();

        const user = await prisma.user.findFirst({
            select: { id: true },
            where: {
                authId: session?.user.id,
            },
        });

        const { data: authUser } = await axios(`/api/v1/users/userId/${user?.id}`);

        return createResponse(authUser);

    } catch (error) {
        if (error instanceof ZodError) {
            return createBadRequest(error.issues);
        }
        return createInternalServerError(error);
    }
};
