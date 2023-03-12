<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { fly } from 'svelte/transition';

const dispatch = createEventDispatcher();

const onShowSidebar = () => {
    dispatch('showSidebar');
};
</script>

<div class="buttom-menu" transition:fly|local={{ y: 200 }}>
    <button type="button" class="icon" on:click={onShowSidebar}
        ><i class="las la-bars" /></button
    >
    <button type="button" class="icon" on:click={onShowSidebar}
        ><i class="las la-pen" /></button
    >
</div>

<style lang="scss">
.buttom-menu {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: var(--omit-scroll-vw);
    height: clamp(40px, 10vw, var(--header-height));
    height: clamp(40px, 10dvw, var(--header-height));
    padding: 0 24px;
    padding-bottom: env(safe-area-inset-bottom); // ios対策
    background-color: var(--color-theme-bg-primary);
    .icon {
        font-size: 2.4rem;
        color: var(--color-theme-text-primary);
        border: 0;
    }
}
</style>
