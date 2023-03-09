<script lang="ts">
export let value: string;
export let maxLength = null as unknown as number;
export let placeholder: string;
</script>

<div class="input-wrap">
    <div class="input-box">
        <input
            bind:value
            class="input"
            autocomplete=""
            on:keydown
            {...$$restProps}
            placeholder=" "
        />
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
    }
    .placeholder {
        position: absolute;
        transform: translateY(10px);
        top: 0;
        left: 8px;
        margin: auto 0;
        display: flex;
        align-items: center;
        color: var(--color-theme-placeholder);
        transition: color 0.2s, transform 0.2s, font-size 0.2s;
        pointer-events: none;
    }
}
</style>
