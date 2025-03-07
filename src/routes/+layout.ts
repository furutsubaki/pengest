
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import axios from 'axios';

import type { LayoutLoad } from './$types';
import type { Database } from '../DatabaseDefinitions';

import { invalidateAll } from '$app/navigation';
import {
    PUBLIC_SUPABASE_ANON_KEY,
    PUBLIC_SUPABASE_URL,
} from '$env/static/public';
import { authUser, type UserObj } from '$lib/stores/authUser';
import { session } from '$lib/stores/session';
import { getCookie } from '$lib/utils/cookie';

export const load: LayoutLoad = async ({ fetch, url, data }) => {

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
        onAuthStateChange() {
            // invalidate('supabase:auth');
            invalidateAll();
        },
    });

    // 先にユーザーstoreを設定しないと一瞬Profileなどが取得不可になるタイミングがある
    authUser.set(data.authUser as UserObj);
    session.set(data.session);
    if (!!data.session && !data.authUser) {
        const { data: user } = await axios('/api/v1/authed/authUser', {
            headers: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
            },
        });

        authUser.set(user);
    }

    return {
        // session: data.session,
        // authUser: authUser,
        supabase,
        theme: getCookie('theme'),
        pathname: url.pathname,
    };
};
