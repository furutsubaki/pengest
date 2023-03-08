<script lang="ts">
import axios from 'axios';
import { onMount } from 'svelte';
import { type TransitionConfig, fly } from 'svelte/transition';

import type { PageData } from './$types';

import { beforeNavigate, goto } from '$app/navigation';
import { page } from '$app/stores';
import { session } from '$lib/stores/session';
import { list } from '$lib/stores/settings';
import { crossfade } from '$lib/utils/crossfade';
import { danger, success } from '$lib/utils/notification';
import { applyJsAgain } from '$lib/utils/routerOption';

export let data: PageData;

const [send, receive] = crossfade;
const pageTransitionDuration = 500;
let isActivebarTransition = true;

$: parentItem = $page.data.ids
    ? ($list.find((item) => item.id === $page.data.ids[0]) as (typeof $list)[0])
    : undefined;

$: currentChildItem = parentItem
    ? (parentItem.child.find(
        (item) => item.id === $page.data.ids[1],
    ) as (typeof $list)[0])
    : undefined;

const onBack = () => {
    if (currentChildItem) {
        goto(`/settings/${$page.data.ids[0]}`);
    } else {
        goto('/settings');
    }
};

const maybe = (node: HTMLElement, fn: typeof receive | typeof send) => {
    if (isActivebarTransition) {
        return fn(node, { key: 'setting-activebar' });
    }
    return (): TransitionConfig => {
        return {} as unknown as TransitionConfig;
    };
};

let isLoading = false;
let isShowLogoutDialog = false;
let isShowDeactivateDialog = false;
const onLogoutConfirm = () => {
    isShowLogoutDialog = true;
};
const onLogout = async () => {
    try {
        isShowLogoutDialog = false;
        isLoading = true;

        await data.supabase.auth.signOut();

        goto('/login');
        success('ログアウトしました');
    } catch (error) {
        danger('ログアウトに失敗しました');
    } finally {
        isLoading = false;
    }
};
const onDeactivateConfirm = () => {
    isShowDeactivateDialog = true;
};
const onDeactivate = async () => {
    try {
        isShowDeactivateDialog = false;
        isLoading = true;
        // deactivatePostSchema.parse(model);

        await axios.post(
            '/api/v1/authed/auth/deactivate',
            {},
            {
                headers: {
                    access_token: $session?.access_token,
                    refresh_token: $session?.refresh_token,
                },
            },
        );

        // await data.supabase.auth.signOut();

        // goto('/login');
        success('アカウントを削除しました');
    } catch (error) {
        danger('アカウントの削除に失敗しました');
    } finally {
        isLoading = false;
    }
};

onMount(() => {
    applyJsAgain();
});

beforeNavigate((navigation) => {
    if (navigation.from?.params?.id && navigation.to?.params?.id) {
        isActivebarTransition =
            navigation.from.params.id.split('/')[0] !==
            navigation.to.params.id.split('/')[0];
    } else {
        isActivebarTransition = true;
    }
});
</script>

<div class="page">
    <div
        class="column left"
        class:is-mobile-hide={$page.data.ids && $page.data.ids.length}
    >
        {#each $list as item (item.id)}
            <a href="/settings/{item.id}" class="item">
                {#if $page.data.ids && $page.data.ids[0] === item.id}
                    <div
                        class="active-bar"
                        in:maybe={receive}
                        out:maybe={send}
                    />
                {/if}
                {item.label}
            </a>
        {/each}

        <button
            type="button"
            class="item"
            on:click={onLogoutConfirm}
            disabled={isLoading}
        >
            ログアウト
        </button>
    </div>
    <div
        class="column right"
        class:is-mobile-hide={$page.data.ids && !$page.data.ids.length}
    >
        {#key $page.url.pathname}
            <div
                in:fly|local={{
                    x: 10,
                    duration: pageTransitionDuration,
                    delay: pageTransitionDuration,
                }}
                out:fly|local={{ x: 10, duration: pageTransitionDuration }}
            >
                {#if parentItem}
                    <H1>
                        <ButtonText variant="secondary" on:click={onBack}
                            >《</ButtonText
                        >
                        {#if currentChildItem}
                            {currentChildItem.label}
                        {:else}
                            {parentItem.label}
                        {/if}
                    </H1>
                    {#if $page.data.ids[1] === 'mailaddress'}
                        <SettingEmail />
                    {:else if $page.data.ids[1] === 'password-update'}
                        <SettingPasswordUpdate />
                    {:else if $page.data.ids[1] === 'theme-change'}
                        <Theme />
                    {:else}
                        {#each parentItem.child as item (item.id)}
                            <a
                                href="/settings/{$page.data.ids[0]}/{item.id}"
                                class="item"
                            >
                                {item.label}
                            </a>
                        {/each}
                        {#if parentItem.id === 'account'}
                            <button
                                type="button"
                                class="item danger"
                                on:click={onDeactivateConfirm}
                                disabled={isLoading}
                            >
                                アカウント削除
                            </button>
                        {/if}
                    {/if}
                {/if}
            </div>
        {/key}
    </div>
</div>

{#if isShowLogoutDialog}
    <Dialog
        title="ログアウト"
        variant="danger"
        primaryText="ログアウト"
        bind:isShow={isShowLogoutDialog}
        on:submit={onLogout}
    >
        ログアウトしてもよろしいですか？
    </Dialog>
{/if}

{#if isShowDeactivateDialog}
    <Dialog
        title="アカウント削除"
        variant="danger"
        primaryText="削除"
        bind:isShow={isShowDeactivateDialog}
        on:submit={onDeactivate}
    >
        アカウントを削除してもよろしいですか？
    </Dialog>
{/if}

<style lang="scss">
@import '../../../../lib/assets/scss/core/_breakpoints.scss';
.page {
    display: flex;
    justify-content: center;
    max-width: var(--main-width);
    width: 100%;
    height: 100%;
    margin: auto;
}

.column {
    width: 100%;
    height: 100%;
    padding: 24px 0;
    transition: border-color 0.2s;
    @include device('tablet') {
        width: 200px;
    }
    &.is-mobile-hide {
        display: none;
        @include device('tablet') {
            display: initial;
        }
    }
    &.left {
        @include device('tablet') {
            border-right: 1px solid var(--color-theme-border);
        }
    }
    &.right {
        flex: 1;
    }
    .item {
        position: relative;
        display: inline-block;
        width: 100%;
        height: auto;
        padding: 8px 24px;
        border: 0;
        color: var(--color-theme-active);
        text-align: left;
        transition: opacity 0.2s, color 0.2s;
        @media (hover: hover) {
            &:hover {
                text-decoration: underline;
            }
        }
        @media (hover: none) {
            &:active {
                text-decoration: underline;
            }
        }
        &.danger {
            color: var(--color-status-danger);
        }
        .active-bar {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            background-color: var(--color-theme-bg-primary);
            border-right: 2px solid var(--color-theme-active);
            transition: background-color 0.2s;
            z-index: -1;
        }
    }
}
</style>
