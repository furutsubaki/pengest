import { ZodError } from 'zod';

import type { RequestHandler } from '@sveltejs/kit';

import prisma from '$lib/server/prisma';
import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';

/**
 * ユーザー再アクティベートAPI
 */
export const POST: RequestHandler = async (event) => {
    try {
        const { locals: {getSession} } = event;
        const session = await getSession();

        // アカウント再アクティベート
        const deleteUser = await prisma.user.update({
            select: {
                id: true,
            },
            data: {
                deactivateAt: null,
            },
            where: {
                authId: session?.user.id,
            },
        });

        // create meta data
        const meta = {};

        // create response
        const resposne = {
            data: deleteUser,
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
