<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value: string;
export let maxLength = null as unknown as number;
export let placeholder: string;
export let icon = '';
export let isLoading = false;

const dispatch = createEventDispatcher();
const onSubmit = () => {
    dispatch('iconClick');
};
</script>

<div class="input-wrap">
    <div class="input-box">
        <input
            bind:value
            class="input"
            class:is-icon={icon}
            autocomplete=""
            on:keydown
            {...$$restProps}
            placeholder=" "
        />
        {#if icon}
            <div class="submit-button">
                <ButtonText
                    on:click={onSubmit}
                    size="large"
                    disabled={isLoading || !value.length}
                    ><i class={icon} /></ButtonText
                >
            </div>
        {/if}
        <div class="placeholder">{placeholder}</div>
    </div>
    {#if maxLength !== null}
        <TextCounter {value} {maxLength} />
    {/if}
</div>

<style lang="scss">
.input-wrap {
    width: 100%;
}

.input-box {
    position: relative;
    .placeholder {
        position: absolute;
        top: 0;
        left: 8px;
        display: flex;
        align-items: center;
        margin: auto 0;
        color: var(--color-theme-placeholder);
        pointer-events: none;
        transition: color 0.2s, transform 0.2s, font-size 0.2s;
        transform: translateY(10px);
    }
    .input {
        width: 100%;
        height: 40px;
        padding: 0 8px;
        border: 0;
        border-bottom: 1px solid var(--color-theme-border);
        &:focus,
        &:not(:placeholder-shown) {
            padding-top: 8px;
            + .placeholder {
                font-size: var(--font-size-small);
                color: var(--color-theme-active);
                transform: translateY(0);
            }
        }
        &.is-icon {
            padding-right: 40px;
        }
    }
}

.submit-button {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    margin: auto 0;
    border: 0;
}
</style>
