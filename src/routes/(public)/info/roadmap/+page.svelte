<script lang="ts">
import { onMount } from 'svelte';

import { applyJsAgain } from '$lib/utils/routerOption';

const list = [
    {
        title: '基本機能拡充',
        text: 'SNSの基本となる機能を拡充予定です。',
        items: ['リポスト', 'いいね', 'メンション', 'ユーザー設定'],
    },
    {
        title: '検索機能拡張',
        text: '',
        items: ['オプション'],
    },
    {
        title: '機能拡張',
        text: '',
        items: [
            'マルチランゲージ',
            '画像投稿',
            '画像投稿拡張',
            '投稿管理',
            'ブロック',
            'ミュート',
            'DM',
            '他カラム対応',
            '通知',
        ],
    },
    {
        title: 'セキュリティ',
        text: `セキュリティを随時強化していきます。
また、アカウントの管理機能の強化を行います。`,
        items: ['アカウント凍結'],
    },
    {
        title: 'API',
        text: '各種APIの提供',
        items: [],
    },
    {
        title: 'サブスクライブ',
        text: `広告の追加、サブスクの追加を予定しています。
料金は数百円〜を想定しています。`,
        items: ['広告', 'サブスク'],
    },
];

onMount(() => {
    applyJsAgain();
});
</script>

<div class="roadmap">
    <H1>ROADMAP</H1>
    <div>
        <p>※下記ロードマップは順不同のため対応時期は前後します。</p>
        <p>実装されたものはリストから削除されていきます。</p>
        <p>機能の要望は中の人までお知らせください</p>
        <a href="/furutsubaki">中の人</a>（<a
            href="https://twitter.con/furu_tsubaki">twitter</a
        >）
    </div>
    <div class="timeline">
        <div class="lines">
            {#each list as item}
                <div class="line">
                    <div class="symbol">◆</div>
                    <div class="item">
                        <H2>{item.title}</H2>
                        {#each item.text.split('\n') as text}
                            <p>{text}</p>
                        {/each}
                        {#if item.items.length}
                            <ul>
                                {#each item.items as i}
                                    <li>{i}</li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
.roadmap {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    width: 100%;
    max-width: var(--main-width);
    padding: 24px;
    // height: 100%;
    margin: auto;
    text-align: center;
}

.timeline {
    width: 100%;
    max-width: 900px;
    text-align: start;
    .lines {
        display: flex;
        flex-direction: column;
        gap: 80px;
        padding: 24px 0;

        --border-height: 8px;
        .line {
            position: relative;
            display: flex;
            gap: 24px;
            margin: calc(var(--border-height) / 2 * -1) 0;
            .symbol {
                display: flex;
                align-items: center;
                height: 32px;
            }
            .item {
            }
            &::before,
            &::after {
                position: absolute;
                left: 0;
                display: block;
                width: 2px;
                height: var(--border-height);
                margin-left: 7px;
                content: '';
                background-color: var(--color-theme-text-primary);
                transition: background-color 0.2s, height 0.1s;
            }
            &::before {
                top: -8px;
            }
            &::after {
                top: 2em;
                height: calc(100% + 32px);
            }
        }
    }
}
</style>
