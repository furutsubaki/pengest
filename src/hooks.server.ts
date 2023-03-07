
import '$lib/axios';
import '$lib/dayjs';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import axios from 'axios';

import type { LayoutData } from '.svelte-kit/types/src/routes/$types';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createInvalidCredentials } from '$lib/utils/createResponse';

export let data: LayoutData;

const isAuthedRoute = (event: RequestEvent, paths: string[]) => {
    return paths.some(path => {
        if (path === '/') {
            return event.url.pathname === path;
        }
        return event.url.pathname.startsWith(path);
    });
};

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event,
    });
    event.locals.getSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    const session = await event.locals.getSession();

    if (event.url.pathname.startsWith('/api/v1')) {
        // APIルート
        if (event.url.pathname.startsWith('/api/v1/authed')) {
            // 認証が必須
            if (!session) {
                return createInvalidCredentials([{ message: '認証エラーです' }]);
            }
        }

        return resolve(event, {
            /**
             * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
             *
             * https://github.com/sveltejs/kit/issues/8061
             */
            filterSerializedResponseHeaders(name) {
                return name === 'content-range';
            },
        });
    }

    // ページの場合
    const blacklistPage = [
        '/',
        '/library',
        '/settings',
    ];

    // 認証不要ルート
    if (!isAuthedRoute(event, blacklistPage)) {
        return resolve(event, {
            /**
           * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
           *
           * https://github.com/sveltejs/kit/issues/8061
           */
            filterSerializedResponseHeaders(name) {
                return name === 'content-range';
            },
            transformPageChunk: ({ html }) => html.replace('%theme%', event.cookies.get('theme') as string),
        });
    }

    // 上記以外は認証ルート
    if (!session) {
        throw redirect(303, '/login');
    }

    // axios初期設定（headerとcookieの付与
    axios.defaults.headers.access_token = session.access_token;
    axios.defaults.headers.refresh_token = session.refresh_token;
    axios.defaults.headers.cookie = event.request.headers.get('cookie');

    return resolve(event, {
        /**
         * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
         *
         * https://github.com/sveltejs/kit/issues/8061
         */
        filterSerializedResponseHeaders(name) {
            return name === 'content-range';
        },
        transformPageChunk: ({ html }) => html.replace('%theme%', event.cookies.get('theme') as string),
    });
};
