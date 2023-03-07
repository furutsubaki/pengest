/*
 * ==================================================
 * File Name    composables/useRouterOption.js
 * Description  ルーティング後処理ファイル
 * ==================================================
 */

// 外部リンクに自動で_blankを挿入
const autoSetBlank = () => {
    document.querySelectorAll('a[href^=http]').forEach((node: HTMLLinkElement) => {
        // 外部リンク以外は早期return
        if (
            node.href.startsWith('https://directus.shigurezuki.jp') ||
            node.href.includes(location.hostname)
        ) {
            return;
        }

        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener');
    });
};

const imagePreload = () => {
    // 画像リンクの場合、画像をプリロード（ブラウザサイズが640px以上の場合のみ
    if (window.parent.screen.width > 640) {
        document
            .querySelectorAll('.wrapper a')
            .forEach((node: HTMLLinkElement) => {
                if (
                    node.href.startsWith(
                        'https://directus.shigurezuki.jp/assets/',
                    )
                ) {
                    const img = document.createElement('img');
                    img.src = node.getAttribute('href');
                }
            });
    }
};

// js再適用用（各ページのmountedで使用）
export const applyJsAgain = () => {
    autoSetBlank();
    imagePreload();
};
