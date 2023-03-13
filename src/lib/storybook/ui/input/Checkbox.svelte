<script lang="ts">
export let value: string;
export let items: { label: string; value: unknown }[] | string[] = [];
</script>

<div class="checkbox-wrap">
    <div class="checkbox-box">
        {#each items as item (typeof item === 'string' ? item : item.label)}
            <label>
                <input
                    bind:group={value}
                    type="checkbox"
                    class="checkbox"
                    value={typeof item === 'string' ? item : item.value}
                    on:click
                    {...$$restProps}
                />
                {typeof item === 'string' ? item : item.label}
            </label>
        {/each}
    </div>
</div>

<style lang="scss">
.checkbox-wrap {
    width: 100%;
}

.checkbox-box {
    position: relative;
    display: flex;
    gap: 16px;
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
        transform: translateY(6px);
    }
    .checkbox {
        display: none;
        &:focus,
        &:not(:placeholder-shown) {
            padding-top: 8px;
            + .placeholder {
                font-size: var(--font-size-small);
                color: var(--color-theme-active);
                transform: translateY(-6px);
            }
        }
    }
}
</style>
