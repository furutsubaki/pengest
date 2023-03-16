import { writable } from 'svelte/store';

export const list = writable([
    {
        id: 'account',
        label: 'アカウント',
        child: [
            {
                id: 'mailaddress',
                label: 'メールアドレス',
            },
            // {
            //     id: 'mute',
            //     label: 'ミュート',
            // },
            // {
            //     id: 'block',
            //     label: 'ブロック',
            // },
        ],
    },
    {
        id: 'security',
        label: 'セキュリティ',
        child: [
            {
                id: 'password-update',
                label: 'パスワード更新',
            },
            // {
            //     id: 'login-history',
            //     label: 'ログイン履歴',
            // },
        ],
    },
    {
        id: 'accessibility',
        label: 'アクセシビリティ',
        child: [
            // {
            //     id: 'notifications',
            //     label: '通知',
            // },
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
    {
        id: 'other',
        label: 'その他',
        child: [
            {
                id: 'account-information',
                label: 'アカウント情報',
            },
            {
                id: 'drive',
                label: 'ドライブ',
            },
            {
                id: 'account-deactivate',
                label: 'アカウント休止',
            },
        ],
    },
]);
