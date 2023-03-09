<script lang="ts">
import { page } from '$app/stores';
import { authUser } from '$lib/stores/authUser';
import { title } from '$lib/stores/page';
import { session } from '$lib/stores/session';

const onToggleLang = () => {
    // TODO: 言語設定
};
</script>

<header class="header">
    {#if !$page.data.pathname.startsWith('/info')}
        <div class="title">{$title}</div>
    {/if}
    <div class="corner">
        <!-- <button
            type="button"
            class="icon"
            aria-label="言語切り替え"
            on:click={onToggleLang}
        >
            Ja
        </button> -->

        {#if $session}
            <a class="icon" href={`/u/${$authUser?.data.Profile?.screenName}`}
                ><img src={$authUser?.data.Profile?.icon} alt="profile" /></a
            >
        {/if}
    </div>
</header>

<style lang="scss">
@import '../../../assets/scss/core/_breakpoints';

.header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: var(--header-height);
    padding: 0 24px;
    pointer-events: none;
    background-color: var(--color-theme-bg-alpha);
    transition: background-color 0.2s;
}

.title {
    flex: 1;
    margin-left: 25px;
    font-weight: bold;

    @include device('tablet') {
        margin-left: var(--sidebar-width);
    }
}

.corner {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
    pointer-events: initial;
}

.icon {
    display: inline-block;
    max-width: 50px;
    height: auto;
    max-height: 50px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-size: 2.4rem;
    color: var(--color-theme-text-primary);
    border: 0;
    border-radius: 100%;
    transition: color 0.2s;

    @media (hover: hover) {
        // PC
        &:hover {
            color: var(--color-theme-text-secondary);
        }
    }

    @media (hover: none) {
        // mobile
        &:active {
            color: var(--color-theme-text-secondary);
        }
    }
}

.logo-wrap {
    width: 50px;
    height: 50px;
}

.logo {
    top: 8px;
    left: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    .logo-icon {
        width: 50vw;
        pointer-events: initial;
    }
}
</style>
