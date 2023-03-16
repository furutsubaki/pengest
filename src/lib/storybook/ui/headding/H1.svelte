<h1 class="h1">
    <slot />
</h1>

<style lang="scss">
.h1 {
    display: flex;
    gap: 8px;
    width: fit-content;
    padding: 4px 0;
    padding-left: 16px;
    border-left: 4px solid var(--color-theme-text-primary);
    transition: border 0.2s;
}
</style>
