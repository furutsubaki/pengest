<script lang="ts">
export let label: string;
export let canDelete = true;
</script>

<button type="button" class="tag" on:click>
    {label}
    {#if canDelete}
        <i class="las la-times" />
    {/if}
</button>

<style lang="scss">
.tag {
    background-color: var(--color-theme-bg-secondary);
    transition: background-color 0.2s;
}
</style>
