<script lang="ts">
let className = '';
export let variant:
| 'primary'
| 'secondary'
| 'link'
| 'info'
| 'success'
| 'warning'
| 'danger' = 'link';
export let size: 'large' | 'medium' | 'small' = 'medium';
export let isBlock = false;
export { className as class };
</script>

<button
    type="button"
    class={`button ${size} ${variant} ${className}`}
    class:block={isBlock}
    on:click
    on:focus
    on:mouseover
    on:mouseleave
    {...$$restProps}
>
    <slot />
</button>

<style lang="scss">
.button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    height: auto;
    border: 0;
    margin: 0;
    padding: 0;
    transition: color 0.2s, opacity 0.2s;
    &:disabled {
        opacity: 0.5;
    }
    @media (hover: hover) {
        &:hover {
            text-decoration: underline;
        }
    }
    @media (hover: none) {
        &:active {
            text-decoration: underline;
        }
    }
}
.primary {
    color: var(--color-theme-active);
}

.secondary {
}

.link {
    color: var(--color-theme-link);
}

.info {
    color: var(--color-status-info);
}

.success {
    color: var(--color-status-success);
}

.warning {
    color: var(--color-status-warning);
}

.danger {
    border-color: var(--color-status-danger);
}

.large {
    font-size: var(--font-size-large);
}

.medium {
    font-size: var(--font-size-common);
}

.small {
    font-size: var(--font-size-small);
}

.block {
    display: block;
    width: 100%;
}
</style>
