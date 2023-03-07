import { AuthError } from '@supabase/supabase-js';
import { error as svelteError, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

import prisma from '$lib/server/prisma';

// import { goto } from '$app/navigation';

export const load: PageServerLoad = async (event) => {
    const { url, locals } = event;

    // 既存セッションがある場合強制ログアウト
    await locals.supabase.auth.signOut();

    try {
        // 入力チェック
        const searchParams = url.searchParams;
        const token = searchParams.get('token') as string;
        const email = searchParams.get('email') as string;
        if (!token || !email) {
            throw new AuthError('認証エラー');
        }

        // 有効化チェック
        const { data: { session }, error } = await locals.supabase.auth.verifyOtp({ email, token, type: 'signup' });
        if (error) {
            throw new AuthError('認証エラー');
        }

        // セッション更新
        const { data: { session: newSession, user: sessionUser } } = await locals.supabase.auth.setSession({
            access_token: session?.access_token as string,
            refresh_token: session?.refresh_token as string,
        });
        if (!newSession || !sessionUser) {
            throw new AuthError('認証エラー');
        }

        // 重複チェック
        const registedUser = await prisma.user.findFirst({
            where: {
                authId: sessionUser.id,
            },
        });

        if (registedUser) {
            throw new Error('登録済みのユーザーです');
        }

        // default icon
        const defaultUserIconFileNmaes = ['default_icon1.png', 'default_icon2.png', 'default_icon3.png', 'default_icon4.png', 'default_icon5.png', 'default_icon6.png'];
        const defaultUserIconFileNmae = defaultUserIconFileNmaes[Math.floor(Math.random() * defaultUserIconFileNmaes.length)];
        // TODO: 共通化で画像取得APIを作る
        const { data } = await locals.supabase.storage.from('default').getPublicUrl(`user-icon/${defaultUserIconFileNmae}`);

        // ユーザーレコード作成
        const createUserData = {
            authId: sessionUser.id,
            Profile: {
                create: {
                    // screenName: '',//  初回はuuidで自動生成のため不要
                    name: sessionUser.user_metadata.name,
                    icon: data.publicUrl,
                },
            },
            Setting: {
                create: {},
            },
        };
        await prisma.user.create({
            data: createUserData,
            include: {
                Profile: true,
                Setting: true,
            },
        });
    } catch (error) {
        throw svelteError(401, {
            message: '認証エラーが発生しました',
        });
    }

    throw redirect(301, '/');
};

export const prerender = true;
