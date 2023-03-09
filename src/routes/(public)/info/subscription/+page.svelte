<script lang="ts">
import { APP_NAME } from '$lib/consts';

const planData = {
    画像拡張子: {
        jpeg: {
            free: true,
            mini: true,
            plus: true,
        },
        png: {
            free: true,
            mini: true,
            plus: true,
        },
        git: {
            free: true,
            mini: true,
            plus: true,
        },
        webp: {
            free: true,
            mini: true,
            plus: true,
        },
        'gif(anime)': {
            free: false,
            mini: true,
            plus: true,
        },
        'webp(anime)': {
            free: false,
            mini: true,
            plus: true,
        },
    },
    広告非表示: {
        free: false,
        mini: true,
        plus: true,
    },
    投稿文字数: {
        free: '〜140文字',
        mini: '〜140文字',
        plus: '〜1000文字',
    },
    ミュート: {
        free: '〜50件',
        mini: '〜100件',
        plus: '〜500件',
    },
    ブロック: {
        free: '〜50件',
        mini: '〜100件',
        plus: '〜500件',
    },
    '加算Pt/日': {
        free: '50pt',
        mini: '100pt',
        plus: '無制限',
    },
    累計保持Pt: {
        free: '200pt',
        mini: '400pt',
        plus: '無制限',
    },
    // https://twitter.com/nnS_momon/status/1626829700361490432
    // ・デイリーログインすると50TP(ツイポイント)がもらえる（最大値200）
    // ・タイムラインを更新するごとに1TP消費
    // ・ツイートやRTでも5TP消費
    // ・500円課金で250TP付与
};
</script>

<div class="page">
    <H1>サブスクリプション</H1>
    <div>
        <p>下記の表は予定となっております。</p>
        <p>現在はfreeプランのみのため、下記の制限は未適用の状態となります。</p>
    </div>
    <div class="subscription">
        <table>
            <thead>
                <tr>
                    <th class="logo" colspan="2">{APP_NAME}</th>
                    <th>
                        <div>Free</div>
                        <div>¥0/月（税込）</div>
                    </th>
                    <th>
                        <div>Mini</div>
                        <div>¥--/月（税込）</div>
                        <!-- 200円？ -->
                    </th>
                    <th>
                        <div>+（Plus）</div>
                        <div>¥--/月（税込）</div>
                        <!-- 500円？ -->
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each Object.keys(planData) as key, i (key)}
                    {#if planData[key].hasOwnProperty('free')}
                        <tr>
                            <td colspan="2"> {key}</td>
                            {#each Object.keys(planData[key]) as plan}
                                <td>
                                    {#if typeof planData[key][plan] === 'string'}
                                        {planData[key][plan]}
                                    {:else if planData[key][plan]}
                                        <i class="las la-check-circle" />
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {:else}
                        {#each Object.keys(planData[key]) as subKey, j (subKey)}
                            <tr>
                                {#if j === 0}
                                    <td
                                        rowspan={Object.keys(planData[key])
                                            .length}
                                    >
                                        {key}
                                    </td>
                                {/if}
                                <td> {subKey}</td>

                                {#each Object.keys(planData[key][subKey]) as plan}
                                    <td>
                                        {#if typeof planData[key][subKey][plan] === 'string'}
                                            {planData[key][subKey][plan]}
                                        {:else if planData[key][subKey][plan]}
                                            <i class="las la-check-circle" />
                                        {/if}
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>
    <div class="meta">
        <div>改定日: 20xx/xx/xx</div>
    </div>
</div>

<style lang="scss">
.page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-width: var(--main-width);
    padding: 24px;
    margin: 0 auto;
    .subscription {
        overflow-x: auto;
    }
}

table {
    width: 100%;
    min-width: 600px;
    overflow: hidden;
    text-align: center;
    white-space: nowrap;
    border-spacing: 0;
    border-collapse: separate;
    border: 1px solid var(--color-theme-border);
    border-radius: 8px;
}

thead {
    border-bottom: 1px solid var(--color-theme-border);
    transition: background-color 0.2s;
}

tr {
    &:nth-child(odd) {
        background-color: var(--color-theme-bg-secondary);
        transition: background-color 0.2s;
    }
    &:nth-child(even) {
        background-color: var(--color-theme-bg-primary);
        transition: background-color 0.2s;
    }
    th,
    td {
        padding: 8px 24px;
        border-right: 1px solid var(--color-theme-border);
        &:last-child {
            border-right: 0;
        }
    }
}

.active {
    color: var(--color-theme-active);
    transition: color 0.2s;
}

.meta {
    width: 100%;
    text-align: right;
}
</style>
