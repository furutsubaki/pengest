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
@import '../../../assets/scss/core/_breakpoints.scss';

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 1;
    pointer-events: none;
    height: var(--header-height);
    padding: 0 24px;
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
    justify-content: center;
    align-items: center;
    gap: 16px;
    pointer-events: initial;
}
.icon {
    display: inline-block;
    margin: 0;
    padding: 0;
    height: auto;
    max-width: 50px;
    max-height: 50px;
    line-height: 1;
    font-size: 2.4rem;
    color: var(--color-theme-text-primary);
    border: 0;
    border-radius: 100%;
    overflow: hidden;
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
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo-icon {
        width: 50vw;
        pointer-events: initial;
    }
}
</style>
