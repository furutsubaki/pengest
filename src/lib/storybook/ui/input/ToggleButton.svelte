<script lang="ts">
export let value: string;
export let items: { label: string; value: string; icon?: string }[];

const onToggle = (v: string) => {
    value = v;
};
</script>

<div class="toggle">
    {#each items as item (item.value)}
        <button
            type="button"
            class="item"
            class:is-active={item.value === value}
            on:click={() => onToggle(item.value)}
        >
            {#if item.icon}
                <i class="icon {item.icon}" />
            {/if}
            {item.label}
        </button>
    {/each}
</div>

<style lang="scss">
.toggle {
    display: flex;
    height: 2em;
    border: 1px solid var(--color-theme-active);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;
    .item {
        height: auto;
        border: 0;
        padding: 0 16px;
        color: var(--color-theme-active);
        transition: background-color 0.2s, color 0.2s;
        &.is-active {
            color: var(--color-theme-text-primary);
            background-color: var(--color-theme-active);
        }
        .icon {
            margin-right: 4px;
        }
    }
}
</style>
