import axios from 'axios';

import type { UserObj } from '$lib/stores/authUser';
import type { LayoutServerLoad } from './$types';

import { MESSAGE } from '$lib/consts/message';
import prisma from '$lib/server/prisma';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
    depends('supabase:auth');
    const session = await locals.getSession();

    let authUser: UserObj | null = null;
    if (session) {
        let user;
        try {
            ({ data: user } = await axios('/api/v1/authed/authUser', {
                headers: {
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                },
            }));

            if (!user.data && user.meta) {
                if (user.meta.isDeactivate) {
                    return {
                        error: {
                            status: 404,
                            message: '対象のユーザーは削除されています',
                        },
                    };
                }

                if (user.meta.isFreeze) {
                    return {
                        error: {
                            status: 404,
                            message: '対象のユーザーは凍結されています',
                        },
                    };
                }
                return {
                    error: {
                        status: 500,
                        message: MESSAGE.ERROR.UNKNOWN,
                    },
                };
            }

            if (!user.data && !user.meta) {

                // ユーザーがいません=初回ログイン時にはユーザーレコードを作成

                // 重複チェック
                const registedUser = await prisma.user.findFirst({
                    where: {
                        authId: session.user.id,
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
                    authId: session.user.id,
                    Profile: {
                        create: {
                            // screenName: '',//  初回はuuidで自動生成のため不要
                            name: session.user.user_metadata.name,
                            icon: data.publicUrl,
                        },
                    },
                    Setting: {
                        create: {},
                    },
                };
                user = await prisma.user.create({
                    data: createUserData,
                    include: {
                        Profile: true,
                        Setting: true,
                    },
                });
            }

            const { data: _authUser } = await axios(`/api/v1/users/userId/${user.data.id}`);

            if (_authUser.data && _authUser.data.Profile) {
                authUser = _authUser;
            }
        } catch (_error) {
            return {
                error: {
                    status: 500,
                    message: MESSAGE.ERROR.UNKNOWN,
                },
            };

        }
    }

    return {
        session,
        authUser,
    };
};
