<script lang="ts">
import { createEventDispatcher } from 'svelte';

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
    <Overlay on:close={onClose}>
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
    </Overlay>
{/if}

<style lang="scss">
.dialog {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    height: auto;
    min-height: 100px;
    max-height: 400px;
    background-color: var(--color-theme-bg-primary);
    transition: background-color 0.2s;
    .title {
        display: flex;
        gap: 24px;
        align-items: center;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 1px solid var(--color-theme-border);
        transition: border-bottom 0.2s;
        .close-button {
            margin: auto 0;
            border: 0;
        }
    }
    .content {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 24px;
        text-align: center;
    }
    .button-area {
        display: flex;
        gap: 24px;
        align-items: center;
        justify-content: center;
        padding: 24px;
        border-top: 1px solid var(--color-theme-border);
        transition: border-top 0.2s;
    }
}
</style>
