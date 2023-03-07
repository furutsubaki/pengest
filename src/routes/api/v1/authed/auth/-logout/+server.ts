import { AuthApiError } from '@supabase/supabase-js';

import type { RequestHandler } from '@sveltejs/kit';

import { createBadRequest, createInternalServerError, createResponse } from '$lib/utils/createResponse';

/**
 * ログアウトAPI
 */
export const POST: RequestHandler = async (event) => {
    try {
        const { locals } = event;

        const { error } = await locals.supabase.auth.signOut();

        if (error) {
            if (error instanceof AuthApiError && error.status === 400) {
                return createBadRequest([{ message: 'ログアウトできませんでした' }]);
            }
            return createInternalServerError(error);
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
        return createInternalServerError(error);
    }
};
