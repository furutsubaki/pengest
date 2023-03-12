<script lang="ts">
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

import { APP_NAME } from '$lib/consts';
import { applyJsAgain } from '$lib/utils/routerOption';

const categories = [
    {
        id: 'underConsideration',
        title: '検討中',
        text: '検討中の要件になります。\n問い合わせから拾い上げる場合もあります。',
    },
    {
        id: 'implementationPlan',
        title: '実装予定',
        text: '今後実装を予定している要件となります。',
    },
    {
        id: 'security',
        title: 'セキュリティ',
        text: 'セキュリティを随時強化していきます。\nまた、アカウントの管理機能の強化を行います。',
    },
    {
        id: 'subscription',
        title: 'サブスクリプション',
        text: '広告の追加、サブスクの追加を予定しています。\n料金は数百円〜を想定しています。',
    },
    {
        id: 'api',
        title: 'API提供',
        text: '未定',
    },
    {
        id: 'released',
        title: 'リリース完了',
        text: '実装が完了したものになります。\n定期的に項目は削除されていきます。',
    },
    {
        id: 'rejection',
        title: '却下',
        text: '検討にあがったものの、実装を見送った要件になります。',
    },
];

const list = [
    {
        title: 'ポイント制',
        text: 'サブスクリプション導入に伴い、各種操作にポイント制を導入するかの検討を行っています。',
        categoryId: 'underConsideration',
    },
    {
        title: 'ウィジェット',
        text: 'ユーザー側で設定可能ないくつかのウィジェット機能を実装するか検討しています。\n※ウィジェット機能はPCなどの画面が広い場合にのみ使用可能な想定をしています。',
        categoryId: 'underConsideration',
    },
    {
        title: 'リポスト',
        text: '他のユーザーが投稿したポストを自身のポストでシェアする機能になります。コメントを付与することもできます。',
        categoryId: 'implementationPlan',
    },
    {
        title: 'ブックマーク',
        text: '他のユーザーが投稿したポストをブックマークしておいて、いつでもアクセスしやすくします。お気に入りのような使い方を想定しています。',
        categoryId: 'implementationPlan',
    },
    {
        title: 'ボード',
        text: '自身のポストからグループを作り、まとめることができます。関連するポストをまとめて公開するなどの使い方を想定しています。',
        categoryId: 'implementationPlan',
    },
    {
        title: 'アイコンフレーム',
        text: 'ユーザーアイコンに任意の枠を追加することができるようになります。',
        categoryId: 'underConsideration',
    },
    {
        title: 'スタンプ',
        text: '某緑のSNSのような1投稿をするような形にするか、業務系チャットツールにあるようなリアクション系にするかは未定ですが、どちらか・もしくは両方の機能を検討しています。',
        categoryId: 'underConsideration',
    },
    {
        title: 'メンション',
        text: '他のユーザーもしくはポストに対して返信を行う機能になります。',
        categoryId: 'implementationPlan',
    },
    {
        title: '検索にオプションを追加',
        text: '検索において、いくつかのオプションを予定しています。',
        categoryId: 'implementationPlan',
    },
    {
        title: 'マルチランゲージ',
        text: '多言語対応の予定ですが、優先度は低いです。',
        categoryId: 'underConsideration',
    },
    {
        title: '投稿管理',
        text: '自身のポストを管理できる機能を実装するか検討中です。\n基本的には自身のプロフィール画面で表示されるポスト一覧と同じもののため、もっと細かい管理が必要な場合に実装するかもしれません。',
        categoryId: 'underConsideration',
    },
    {
        title: 'ブロック',
        text: '他のユーザーをブロックし、検索・タイムラインに表示されなくするようにします。\nミュートとは異なり、ブロックされたユーザーはフォロー・フォロワーの関係は解除されます。',
        categoryId: 'implementationPlan',
    },
    {
        title: 'ミュート',
        text: '多のユーザーをミュートし、検索・タイムラインに表示されなくするようにします。\nブロックとは異なり、ミュートを行ってもフォロー・フォロワーの関係は変更されません。',
        categoryId: 'implementationPlan',
    },
    {
        title: '多カラム対応',
        text: 'ホーム画面に表示できる項目を増やすことができるようになります。',
        categoryId: 'implementationPlan',
    },
    {
        title: '通知',
        text: '各アクションが発生した際に、スマートフォンやメールなどに通知を行う機能になります。\nオプションから個別に設定が可能になります。',
        categoryId: 'implementationPlan',
    },
    {
        title: 'アカウント凍結',
        text: '規約違反・悪質なユーザーに対してアカウントの凍結を行います。\n凍結中は自動的には解除されませんので、解除を希望する場合は問い合わせをお願いします。',
        categoryId: 'security',
    },
    {
        title: '広告',
        text: 'タイムライン等に広告を表示します。これはサブスクリプションのプランによって排除することが可能になります。',
        categoryId: 'subscription',
    },
    {
        title: 'DM',
        text: `DMなどのクローズドなやり取りには法的にふさわしくない内容が発生する可能性があるため、${APP_NAME}では、ユーザー間のやりとりは原則オープンなものとするため。`,
        categoryId: 'rejection',
    },
];

let isOpen = false;
let currentDetailData = { title: '', text: '', categoryId: '' };
const onDetailOpen = (item: {
    title: string;
    text: string;
    categoryId: string;
}) => {
    currentDetailData = item;
    isOpen = true;
};
const onDetailHide = () => {
    isOpen = false;
};

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
            {#each categories as category}
                <div class="line">
                    <div class="symbol">◆</div>
                    <div class="category">
                        <H2>{category.title}</H2>
                        {#each category.text.split('\n') as text}
                            <p>{text}</p>
                        {/each}
                        {#if list.filter((item) => category.id === item.categoryId).length}
                            <ul>
                                {#each list.filter((item) => category.id === item.categoryId) as item}
                                    <li>
                                        <ButtonText
                                            on:click={() => onDetailOpen(item)}
                                            >{item.title}</ButtonText
                                        >
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

{#if isOpen}
    <Overlay on:close={() => onDetailHide()}>
        <div class="detail" transition:fly|local={{ x: 200 }}>
            <div class="close-button">
                <ButtonText size="large" on:click={() => onDetailHide()}
                    ><i class="las la-angle-double-right" /></ButtonText
                >
            </div>
            <div>
                category: {categories.find(
                    (category) => category.id === currentDetailData.categoryId,
                )?.title}
            </div>
            <div class="title">{currentDetailData.title}</div>
            <div>
                {#each currentDetailData.text.split('\n') as text}
                    <p>{text}</p>
                {/each}
            </div>
        </div>
    </Overlay>
{/if}

<style lang="scss">
@import '../../../../lib/assets/scss/core/_breakpoints';

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
                height: 22px;
            }
            &::before,
            &::after {
                position: absolute;
                left: 0;
                display: block;
                width: 2px;
                height: var(--border-height);
                margin-left: 6px;
                content: '';
                background-color: var(--color-theme-text-primary);
                transition: background-color 0.2s, height 0.1s;
            }
            &::before {
                top: -12px;
            }
            &::after {
                top: 2em;
                height: calc(100% + 32px);
            }
        }
    }
}

.detail {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 90vw;
    width: 90dvw;
    height: 100%;
    padding: 24px;
    background-color: var(--color-theme-bg-primary);

    @include device('tablet') {
        width: 40vw;
        width: 40dvw;
    }
    .close-button {
        position: absolute;
        top: 2px;
        left: 2px;
    }
    .title {
        font-weight: bold;
    }
}
</style>
