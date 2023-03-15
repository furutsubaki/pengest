<script lang="ts">
import '$lib/assets/scss/reboot.css';
import '$lib/assets/scss/style.scss';
import '$lib/assets/scss/variables.css';
import { error } from '@sveltejs/kit';
import { onMount } from 'svelte';

import type { LayoutData } from './$types';
import type { StatusNoticePayload } from '../@types/broadcastPayload';
import type { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';

import { page } from '$app/stores';
import { APP_NAME, APP_VERSION } from '$lib/consts';
import { authUser } from '$lib/stores/authUser';
import { title } from '$lib/stores/page';
import { postData } from '$lib/stores/post';
import { session } from '$lib/stores/session';
import { setCookie } from '$lib/utils/cookie';
import { browserCheck, deviceCheck } from '$lib/utils/index';
import { info } from '$lib/utils/notification';

export let data: LayoutData;

if ($page.data.error) {
    throw error($page.data.error.status, $page.data.error.message);
}

$: {
    $title = $page.data.title ?? '';
}
$: pageMetaData = {
    title: $title ? `${$title} - ${APP_NAME}` : APP_NAME,
};

const setStatusBroadcast = () => {
    if (!$authUser) {
        return;
    }

    interface Payload {
        type: `${REALTIME_LISTEN_TYPES.BROADCAST}`;
        event: string;
        [key: string]: unknown;
    }
    const newNotice = (payload: Payload) => {
        if (!$authUser) {
            return;
        }
        const data: StatusNoticePayload = payload.payload;
        if (data.payloadType === 'FOLLOW') {
            info(data.message);
            $authUser.meta.followerIds = [
                ...$authUser.meta.followerIds,
                data.user.id,
            ];
        }
    };
    data.supabase
        .channel(`user-${$authUser.data.id}`)
        .on('broadcast', { event: 'status-notice' }, newNotice)
        .subscribe();
};

authUser.subscribe((newAuth) => {
    if (newAuth) {
        // ユーザー情報があるときはstatusをブロードキャスト
        setStatusBroadcast();
    }
});

onMount(() => {
    // // SSR(初回)時のみ発火
    const isDark = window.matchMedia('(prefers-color-scheme: dark)');
    const systemColor = isDark ? 'dark' : 'light';
    const theme = $page.data.theme ?? systemColor;

    setCookie('theme', theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.device = deviceCheck();
    document.documentElement.dataset.browser = browserCheck();

    const setVh = () => {
        // 100vh mobile fix
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh, { passive: true });

    console.log(`${APP_NAME}: v${APP_VERSION}`);

    return () => {
        window.removeEventListener('resize', setVh);
    };
});
</script>

<svelte:head>
    <!-- 要共通化 -->
    <title>{pageMetaData.title}</title>
</svelte:head>

<Header />
<div class="layout" class:is-sidebar={$session || data.pathname !== '/login'}>
    {#if data.pathname.startsWith('/info')}
        <InfoSidebar />
    {:else if $session}
        <Sidebar />
    {:else if data.pathname !== '/login'}
        <InfoSidebar />
    {/if}
    <div
        class="wrapper"
        style={`--padding-left: ${
            $session || data.pathname !== '/login' ? 'var(--sidebar-width)' : 0
        }`}
    >
        <PageTransition pathname={data.pathname}>
            <slot />
        </PageTransition>
    </div>
</div>
{#if $session && $postData.isShow}
    <PostArea />
{/if}

<Notify />

<style lang="scss">
@import '../lib/assets/scss/core/_breakpoints';

.layout {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: var(--header-height);
    transition: background-color 0.2s;
    .wrapper {
        display: flex;
        flex: 1;
        flex-direction: column;
        width: 100%;
        margin: auto;
        transition: padding-left 0.2s;
    }

    @include device('tablet') {
        &.is-sidebar .wrapper {
            padding-left: var(--padding-left);
        }
    }
}
</style>
