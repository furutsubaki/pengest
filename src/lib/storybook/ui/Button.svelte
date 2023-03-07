<script lang="ts">
let className = '';
export let variant:
| 'primary'
| 'secondary'
| 'info'
| 'success'
| 'warning'
| 'danger' = 'primary';
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
    min-width: 100px;
    border: 1px solid;
    border-radius: 4px;
    padding: 0 8px;
    transition: color 0.2s, background-color 0.2s, border-color 0.2s,
        opacity 0.2s;
    &:disabled {
        opacity: 0.5;
    }
}
.primary {
    color: var(--color-base-white);
    background-color: var(--color-theme-active);
    border-color: var(--color-theme-active);
    @media (hover: hover) {
        &:hover {
            color: var(--color-theme-active);
            background-color: transparent;
            border-color: var(--color-theme-active);
        }
    }
    @media (hover: none) {
        &:active {
            color: var(--color-theme-active);
            background-color: transparent;
            border-color: var(--color-theme-active);
        }
    }
}

.secondary {
    color: var(--color-theme-text-primary);
    background-color: transparent;
    border-color: var(--color-theme-text-primary);
    @media (hover: hover) {
        &:hover {
            color: var(--color-base-white);
            background-color: var(--color-theme-active);
            border-color: var(--color-theme-active);
        }
    }
    @media (hover: none) {
        &:active {
            color: var(--color-base-white);
            background-color: var(--color-theme-active);
            border-color: var(--color-theme-active);
        }
    }
}

.info {
    color: var(--color-status-info);
    border-color: var(--color-status-info);
    background-color: var(--color-status-info);
    @media (hover: hover) {
        &:hover {
            color: var(--color-status-info);
            background-color: transparent;
            border-color: var(--color-status-info);
        }
    }
    @media (hover: none) {
        &:active {
            color: var(--color-status-info);
            background-color: transparent;
            border-color: var(--color-status-info);
        }
    }
}

.success {
    color: var(--color-base-white);
    border-color: var(--color-status-success);
    background-color: var(--color-status-success);
    @media (hover: hover) {
        &:hover {
            color: var(--color-status-success);
            background-color: transparent;
            border-color: var(--color-status-success);
        }
    }
    @media (hover: none) {
        &:active {
            color: var(--color-status-success);
            background-color: transparent;
            border-color: var(--color-status-success);
        }
    }
}

.warning {
    color: var(--color-base-black);
    border-color: var(--color-status-warning);
    background-color: var(--color-status-warning);
    @media (hover: hover) {
        &:hover {
            color: var(--color-status-warning);
            background-color: transparent;
            border-color: var(--color-status-warning);
        }
    }
    @media (hover: none) {
        &:active {
            color: var(--color-status-warning);
            background-color: transparent;
            border-color: var(--color-status-warning);
        }
    }
}

.danger {
    color: var(--color-base-white);
    border-color: var(--color-status-danger);
    background-color: var(--color-status-danger);
    @media (hover: hover) {
        &:hover {
            color: var(--color-status-danger);
            background-color: transparent;
            border-color: var(--color-status-danger);
        }
    }
    @media (hover: none) {
        &:active {
            color: var(--color-status-danger);
            background-color: transparent;
            border-color: var(--color-status-danger);
        }
    }
}

// .large {

// }

.medium {
    height: 35px;
}

.small {
    height: 28px;
}

.block {
    display: block;
    width: 100%;
}
</style>
