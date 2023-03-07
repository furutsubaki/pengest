<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
import Portal from 'svelte-portal';

export let isShow = false;
export let title = '';
export let variant: 'info' | 'warning' | 'danger' = 'info';
export let primaryText = ['info', 'warning'].includes(variant) ? 'OK' : '削除';
export let secondaryText = variant === 'info' ? '閉じる' : 'キャンセル';

const dispatch = createEventDispatcher();
const onClose = () => {
    isShow = false;
};
const onSubmit = () => {
    dispatch('submit');
};
</script>

{#if isShow}
    <Portal>
        <div class="overlay" transition:fade={{ duration: 200 }}>
            <div class="dialog">
                <div class="title">
                    <span>{title}</span>
                    <button class="close-button" on:click={onClose}
                        ><i class="las la-times" /></button
                    >
                </div>
                <div class="content">
                    <slot />
                </div>
                <div class="button-area">
                    <Button variant="secondary" on:click={() => onClose()}
                        >{secondaryText}</Button
                    >

                    {#if variant !== 'info'}
                        <Button
                            {variant}
                            on:click={() => onClose()}
                            on:click={() => onSubmit()}
                        >
                            {primaryText}
                        </Button>
                    {/if}
                </div>
            </div>
        </div>
    </Portal>
{/if}

<style lang="scss">
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    .dialog {
        width: 100%;
        height: auto;
        min-height: 100px;
        max-width: 600px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
        background-color: var(--color-theme-bg-primary);
        transition: background-color 0.2s;
        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 24px;
            padding: 8px;
            border-bottom: 1px solid var(--color-theme-border);
            transition: border-bottom 0.2s;
            .close-button {
                margin: auto 0;
                border: 0;
            }
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 24px;
            padding: 24px;
            text-align: center;
        }
        .button-area {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 24px;
            padding: 24px;
            border-top: 1px solid var(--color-theme-border);
            transition: border-top 0.2s;
        }
    }
}
</style>
