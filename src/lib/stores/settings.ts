import { writable } from 'svelte/store';

export const list = writable([
    {
        id: 'account',
        label: 'アカウント',
        child: [
            {
                id: 'mailaddress-update',
                label: 'メールアドレス更新',
            },
            {
                id: 'password-update',
                label: 'パスワード更新',
            },
        ],
    },
    {
        id: 'accessibility',
        label: 'アクセシビリティ',
        child: [
            {
                id: 'theme-change',
                label: 'テーマ',
            },
            // {
            //     id: 'language-change',
            //     label: '言語',
            // },
        ],
    },
]);
