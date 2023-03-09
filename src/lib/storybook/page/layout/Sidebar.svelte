<script lang="ts">
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

import { browser } from '$app/environment';
import { page } from '$app/stores';
import { authUser } from '$lib/stores/authUser';

const menus = [
    {
        id: 'home',
        label: 'HOME',
        href: '/',
        icon: 'las la-home',
    },
    {
        id: 'search',
        label: 'SEARCH',
        href: '/search',
        icon: 'las la-search',
    },
    {
        id: 'notification',
        label: 'NOTIFICATION',
        href: '#',
        icon: 'las la-bell',
    },
    {
        id: 'bookmark',
        label: 'BOOKMARK',
        href: '#',
        icon: 'las la-bookmark',
    },
    {
        id: 'board',
        label: 'BOARD',
        href: '#',
        icon: 'las la-clipboard-list',
    },
    {
        id: 'dm',
        label: 'DM',
        href: '#',
        icon: 'las la-envelope',
    },
    {
        id: 'library',
        label: 'LIBRARY',
        href: '/library',
        icon: 'las la-image',
    },
    {
        id: 'stamp',
        label: 'STAMP',
        href: '#',
        icon: 'las la-stamp',
    },
    {
        id: 'profile',
        label: 'PROFILE',
        href: `/u/${$authUser?.data.Profile?.screenName}`,
        icon: 'las la-user',
    },
    {
        id: 'setting',
        label: 'SETTINGS',
        href: '/settings/account',
        icon: 'las la-cog',
    },
];

$: isActive = (menu: (typeof menus)[0]) => {
    if (menu.id === 'profile') {
        return $page.data.pathname === menu.href;
    } else {
        return $page.data.pathname.split('/')[1] === menu.href.split('/')[1];
    }
};

let isMobileSidebarShow = false;
let transitionInDuration = 0;
const MOBILE_BREAKPOINT = 768;
$: isBreakpointMode = !browser
    ? ''
    : MOBILE_BREAKPOINT <= window.innerWidth
        ? 'pc'
        : 'mobile';
$: {
    $page.data.pathname;
    isMobileSidebarShow = false;
}
const changeSidebar = () => {
    if (MOBILE_BREAKPOINT <= window.innerWidth) {
        isBreakpointMode = 'pc';
    } else {
        isBreakpointMode = 'mobile';
    }
    transitionInDuration = 500;
};
const debounce = (func: Function, delay: number) => {
    let timer: NodeJS.Timeout;

    return function (this: Function) {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(context, args), delay);
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
    <button
        type="button"
        class="hamburger-button"
        on:click={() => {
            isMobileSidebarShow = !isMobileSidebarShow;
        }}><i class="las la-bars" /></button
    >
{/if}
{#if isBreakpointMode === 'pc' || (isBreakpointMode === 'mobile' && isMobileSidebarShow)}
    <div
        class="sidebar"
        transition:fly={{ x: -200, duration: transitionInDuration }}
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
                <li class="item" class:is-active={isActive(menu)}>
                    <a href={menu.href} class="link"
                        ><span class="icon"><i class={menu.icon} /></span
                        >{menu.label}</a
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
            position: relative;
            &::before{
                position: absolute;
                content: '';
                transition: margin-left 0.2s;
            }
            &.is-active {
                &::before{
                    content: '';
                }
            }
            &:has([href='#']) {
                // TODO: 未実装メニューが無くなったら削除
                text-decoration: line-through;
            }
        }
        .link {
            display: flex;
            gap: 8px;
        }
    }
}
</style>
