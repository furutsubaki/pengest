<script lang="ts">
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

import { browser } from '$app/environment';
import { page } from '$app/stores';
import { session } from '$lib/stores/session';

const menus = [
    ...($session
        ? [
            {
                id: 'home',
                label: 'HOME',
                href: '/',
                icon: 'las la-home',
            },
        ]
        : [
            {
                id: 'login',
                label: 'LOGIN',
                href: '/',
                icon: 'las la-sign-in-alt',
            },
        ]),
    ...[
        {
            id: 'terms',
            label: '利用規約',
            href: '/info/terms',
            icon: 'las la-list-alt',
        },
        {
            id: 'policy',
            label: 'プライバシーポリシー',
            href: '/info/policy',
            icon: 'las la-shield-alt',
        },
        {
            id: 'guideline',
            label: 'ガイドライン',
            href: '/info/guideline',
            icon: 'las la-book-open',
        },
        {
            id: 'subscription',
            label: '料金体系',
            href: '/info/subscription',
            icon: 'las la-coins',
        },
        {
            id: 'roadmap',
            label: 'ROADMAP',
            href: '/info/roadmap',
            icon: 'las la-road',
        },
    ],
];

let isMobileSidebarShow = false;
let transitionInDuration = 0;
const MOBILE_BREAKPOINT = 768;
let isBreakpointMode = !browser ? '' : MOBILE_BREAKPOINT <= window.innerWidth ? 'pc' : 'mobile';
$: {
    $page.data.pathname;
    isMobileSidebarShow = false;
}
const changeSidebar = () => {
    if (MOBILE_BREAKPOINT > window.innerWidth) {
        isBreakpointMode = 'mobile';
    } else {
        isBreakpointMode = 'pc';
    }
    transitionInDuration = 500;
};
const debounce = (func: () => void, delay: number) => {
    let timer: NodeJS.Timeout;

    return function (this: () => void) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this), delay);
    };
};
const debouncedSetWindowWidth = debounce(changeSidebar, 300);

onMount(() => {
    window.addEventListener('resize', debouncedSetWindowWidth);
    changeSidebar();
    return () => {
        window.removeEventListener('resize', debouncedSetWindowWidth);
    };
});
</script>

{#if isBreakpointMode === 'mobile'}
    <div class="header-line">
        <button
            type="button"
            class="hamburger-button"
            on:click={() => {
                isMobileSidebarShow = !isMobileSidebarShow;
            }}><i class="las la-bars" /></button
        >
    </div>
{/if}
{#if isBreakpointMode === 'pc' || (isBreakpointMode === 'mobile' && isMobileSidebarShow)}
    <div
        class="sidebar"
        in:fly={{ x: -200, duration: transitionInDuration }}
        out:fly={{ x: -200, duration: transitionInDuration }}
    >
        <div class="header-line">
            {#if isBreakpointMode === 'mobile'}
                <button
                    type="button"
                    class="hamburger-button"
                    on:click={() => {
                        isMobileSidebarShow = !isMobileSidebarShow;
                    }}><i class="las la-times" /></button
                >
            {/if}
        </div>
        <ul class="menus">
            {#each menus as menu (menu.id)}
                <li class="item" class:is-active={$page.data.pathname === menu.href}>
                    <a href={menu.href} class="link"
                        ><span class="icon"><i class={menu.icon} /></span>{menu.label}</a
                    >
                </li>
            {/each}
        </ul>
        <Footer />
    </div>
{/if}

<style lang="scss">
@import '../../../assets/scss/core/_breakpoints';

.hamburger-button {
    position: fixed;
    top: 8px;
    left: 16px;
    z-index: 1;
    font-size: 2.4rem;
    color: var(--color-theme-text-primary);
    border: 0;
}

.header-line {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: var(--header-height);
    padding: 0 24px;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 60vw;
    width: 60dvw;
    height: 100%;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;

    @include device('tablet') {
        width: var(--sidebar-width);
        background-color: var(--color-theme-bg-alpha);
    }
    .hamburger-button {
        position: initial;
    }
    .menus {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 24px;
        margin: 0;
        font-size: var(--font-size-large);
        list-style: none;

        @include device('tablet') {
            font-size: var(--font-size-common);
        }
        .item {
            transition: margin-left 0.2s;
            &.is-active {
                margin-left: 8px;
                filter: brightness(1.5);
            }
        }
        .link {
            display: flex;
            gap: 8px;
        }
    }
}
</style>
